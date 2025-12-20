#include <node_api.h>

#include <windows.h>
#include <winhttp.h>
#include <wincrypt.h>
#include <string>
#include <vector>
#include <stdexcept>

#pragma comment(lib, "winhttp.lib")
#pragma comment(lib, "crypt32.lib")

std::wstring utf8_to_wstring(const std::string &str)
{
  if (str.empty())
    return std::wstring();
  int size_needed = MultiByteToWideChar(CP_UTF8, 0, &str[0], (int)str.size(), NULL, 0);
  std::wstring wstrTo(size_needed, 0);
  MultiByteToWideChar(CP_UTF8, 0, &str[0], (int)str.size(), &wstrTo[0], size_needed);
  return wstrTo;
}

std::string wstring_to_utf8(const std::wstring &wstr)
{
  if (wstr.empty())
    return std::string();
  int size_needed = WideCharToMultiByte(CP_UTF8, 0, &wstr[0], (int)wstr.size(), NULL, 0, NULL, NULL);
  std::string strTo(size_needed, 0);
  WideCharToMultiByte(CP_UTF8, 0, &wstr[0], (int)wstr.size(), &strTo[0], size_needed, NULL, NULL);
  return strTo;
}

napi_value MakeRequest(napi_env env, napi_callback_info info)
{
  size_t argc = 4;
  napi_value args[4];
  napi_get_cb_info(env, info, &argc, args, nullptr, nullptr);

  if (argc < 4)
  {
    napi_value error_msg;
    napi_create_string_utf8(env, "Expected: subject (string), method (string), url (string), options (object)", NAPI_AUTO_LENGTH, &error_msg);
    napi_value error;
    napi_create_type_error(env, nullptr, error_msg, &error);
    napi_throw(env, error);
    return nullptr;
  }

  napi_valuetype arg0_type, arg1_type, arg2_type, arg3_type;
  napi_typeof(env, args[0], &arg0_type);
  napi_typeof(env, args[1], &arg1_type);
  napi_typeof(env, args[2], &arg2_type);
  napi_typeof(env, args[3], &arg3_type);

  if (arg0_type != napi_string || arg1_type != napi_string || arg2_type != napi_string || arg3_type != napi_object)
  {
    napi_value error_msg;
    napi_create_string_utf8(env, "Expected: subject (string), method (string), url (string), options (object)", NAPI_AUTO_LENGTH, &error_msg);
    napi_value error;
    napi_create_type_error(env, nullptr, error_msg, &error);
    napi_throw(env, error);
    return nullptr;
  }

  size_t subject_len = 0;
  napi_get_value_string_utf8(env, args[0], nullptr, 0, &subject_len);
  std::string subject_str(subject_len, '\0');
  napi_get_value_string_utf8(env, args[0], &subject_str[0], subject_len + 1, nullptr);
  std::wstring subject = utf8_to_wstring(subject_str);

  size_t method_len = 0;
  napi_get_value_string_utf8(env, args[1], nullptr, 0, &method_len);
  std::string method_str(method_len, '\0');
  napi_get_value_string_utf8(env, args[1], &method_str[0], method_len + 1, nullptr);
  std::wstring method = utf8_to_wstring(method_str);

  size_t url_len = 0;
  napi_get_value_string_utf8(env, args[2], nullptr, 0, &url_len);
  std::string url_str(url_len, '\0');
  napi_get_value_string_utf8(env, args[2], &url_str[0], url_len + 1, nullptr);
  std::wstring url = utf8_to_wstring(url_str);

  napi_value optionsObj = args[3];

  std::wstring headers;
  std::string body;
  int timeout = 30000;

  napi_value headers_key;
  napi_create_string_utf8(env, "headers", NAPI_AUTO_LENGTH, &headers_key);
  napi_value headers_val;
  napi_status status = napi_get_property(env, optionsObj, headers_key, &headers_val);
  if (status == napi_ok)
  {
    napi_valuetype headers_type;
    napi_typeof(env, headers_val, &headers_type);
    if (headers_type == napi_string)
    {
      size_t headers_len = 0;
      napi_get_value_string_utf8(env, headers_val, nullptr, 0, &headers_len);
      std::string headers_str(headers_len, '\0');
      napi_get_value_string_utf8(env, headers_val, &headers_str[0], headers_len + 1, nullptr);
      headers = utf8_to_wstring(headers_str);
    }
  }

  napi_value body_key;
  napi_create_string_utf8(env, "body", NAPI_AUTO_LENGTH, &body_key);
  napi_value body_val;
  status = napi_get_property(env, optionsObj, body_key, &body_val);
  if (status == napi_ok)
  {
    bool is_buffer;
    napi_is_buffer(env, body_val, &is_buffer);
    if (is_buffer)
    {
      BYTE *bodyData = nullptr;
      size_t bodyLen = 0;
      napi_get_buffer_info(env, body_val, (void **)&bodyData, &bodyLen);
      body = std::string((char *)bodyData, bodyLen);
    }
  }

  napi_value timeout_key;
  napi_create_string_utf8(env, "timeout", NAPI_AUTO_LENGTH, &timeout_key);
  napi_value timeout_val;
  status = napi_get_property(env, optionsObj, timeout_key, &timeout_val);
  if (status == napi_ok)
  {
    napi_valuetype timeout_type;
    napi_typeof(env, timeout_val, &timeout_type);
    if (timeout_type == napi_number)
    {
      double timeout_double;
      napi_get_value_double(env, timeout_val, &timeout_double);
      timeout = (int)timeout_double;
    }
  }

  HCERTSTORE hStore = NULL;
  PCCERT_CONTEXT pCertContext = NULL;
  HINTERNET hSession = NULL;
  HINTERNET hConnect = NULL;
  HINTERNET hRequest = NULL;
  napi_value result = nullptr;

  try
  {
    hStore = CertOpenSystemStoreW(0, L"MY");
    if (!hStore)
    {
      throw std::runtime_error("Failed to open certificate store");
    }

    pCertContext = CertFindCertificateInStore(
        hStore,
        X509_ASN_ENCODING | PKCS_7_ASN_ENCODING,
        0,
        CERT_FIND_SUBJECT_STR_W,
        (LPVOID)subject.c_str(),
        NULL);

    if (!pCertContext)
    {
      throw std::runtime_error("Certificate not found in store");
    }

    URL_COMPONENTS urlComp;
    ZeroMemory(&urlComp, sizeof(urlComp));
    urlComp.dwStructSize = sizeof(urlComp);
    urlComp.dwSchemeLength = (DWORD)-1;
    urlComp.dwHostNameLength = (DWORD)-1;
    urlComp.dwUrlPathLength = (DWORD)-1;
    urlComp.dwExtraInfoLength = (DWORD)-1;

    std::vector<wchar_t> schemeBuffer(32);
    std::vector<wchar_t> hostNameBuffer(256);
    std::vector<wchar_t> urlPathBuffer(2048);
    std::vector<wchar_t> extraInfoBuffer(256);

    urlComp.lpszScheme = schemeBuffer.data();
    urlComp.dwSchemeLength = (DWORD)schemeBuffer.size();
    urlComp.lpszHostName = hostNameBuffer.data();
    urlComp.dwHostNameLength = (DWORD)hostNameBuffer.size();
    urlComp.lpszUrlPath = urlPathBuffer.data();
    urlComp.dwUrlPathLength = (DWORD)urlPathBuffer.size();
    urlComp.lpszExtraInfo = extraInfoBuffer.data();
    urlComp.dwExtraInfoLength = (DWORD)extraInfoBuffer.size();

    std::vector<wchar_t> urlBuffer(url.length() + 1);
    wcscpy_s(urlBuffer.data(), urlBuffer.size(), url.c_str());

    if (!WinHttpCrackUrl(urlBuffer.data(), (DWORD)url.length(), 0, &urlComp))
    {
      throw std::runtime_error("Failed to parse URL. Error: " + std::to_string(GetLastError()));
    }

    std::wstring hostName(hostNameBuffer.data(), urlComp.dwHostNameLength);
    std::wstring urlPath(urlPathBuffer.data(), urlComp.dwUrlPathLength);
    if (urlPath.empty())
    {
      urlPath = L"/";
    }

    if (urlComp.dwExtraInfoLength > 0)
    {
      std::wstring extraInfo(extraInfoBuffer.data(), urlComp.dwExtraInfoLength);
      urlPath += extraInfo;
    }

    INTERNET_PORT port = urlComp.nPort;
    if (port == 0)
    {
      port = (urlComp.nScheme == INTERNET_SCHEME_HTTPS) ? INTERNET_DEFAULT_HTTPS_PORT : INTERNET_DEFAULT_HTTP_PORT;
    }

    hSession = WinHttpOpen(
        L"Node.js WinHTTP Client/1.0",
        WINHTTP_ACCESS_TYPE_DEFAULT_PROXY,
        WINHTTP_NO_PROXY_NAME,
        WINHTTP_NO_PROXY_BYPASS,
        0);

    if (!hSession)
    {
      throw std::runtime_error("Failed to create WinHTTP session");
    }

    DWORD timeoutMs = timeout;
    WinHttpSetTimeouts(hSession, timeoutMs, timeoutMs, timeoutMs, timeoutMs);

    hConnect = WinHttpConnect(hSession, hostName.c_str(), port, 0);
    if (!hConnect)
    {
      throw std::runtime_error("Failed to connect to server");
    }

    DWORD dwFlags = WINHTTP_FLAG_SECURE;
    if (urlComp.nScheme == INTERNET_SCHEME_HTTPS)
    {
      dwFlags |= WINHTTP_FLAG_SECURE;
    }

    hRequest = WinHttpOpenRequest(
        hConnect,
        method.c_str(),
        urlPath.c_str(),
        NULL,
        WINHTTP_NO_REFERER,
        WINHTTP_DEFAULT_ACCEPT_TYPES,
        dwFlags);

    if (!hRequest)
    {
      throw std::runtime_error("Failed to create request");
    }

    if (!WinHttpSetOption(
            hRequest,
            WINHTTP_OPTION_CLIENT_CERT_CONTEXT,
            (LPVOID)pCertContext,
            sizeof(CERT_CONTEXT)))
    {
      throw std::runtime_error("Failed to set client certificate");
    }

    if (!headers.empty())
    {
      if (!WinHttpAddRequestHeaders(
              hRequest,
              headers.c_str(),
              (DWORD)headers.length(),
              WINHTTP_ADDREQ_FLAG_ADD))
      {
        throw std::runtime_error("Failed to add request headers");
      }
    }

    BOOL bResults = FALSE;
    if (body.empty())
    {
      bResults = WinHttpSendRequest(
          hRequest,
          WINHTTP_NO_ADDITIONAL_HEADERS,
          0,
          WINHTTP_NO_REQUEST_DATA,
          0,
          0,
          0);
    }
    else
    {
      bResults = WinHttpSendRequest(
          hRequest,
          WINHTTP_NO_ADDITIONAL_HEADERS,
          0,
          (LPVOID)body.c_str(),
          (DWORD)body.length(),
          (DWORD)body.length(),
          0);
    }

    if (!bResults)
    {
      throw std::runtime_error("Failed to send request. Error: " + std::to_string(GetLastError()));
    }

    if (!WinHttpReceiveResponse(hRequest, NULL))
    {
      throw std::runtime_error("Failed to receive response. Error: " + std::to_string(GetLastError()));
    }

    DWORD dwStatusCode = 0;
    DWORD dwStatusCodeSize = sizeof(dwStatusCode);
    if (!WinHttpQueryHeaders(
            hRequest,
            WINHTTP_QUERY_STATUS_CODE | WINHTTP_QUERY_FLAG_NUMBER,
            WINHTTP_HEADER_NAME_BY_INDEX,
            &dwStatusCode,
            &dwStatusCodeSize,
            WINHTTP_NO_HEADER_INDEX))
    {
      throw std::runtime_error("Failed to query status code");
    }

    DWORD dwHeaderSize = 0;
    WinHttpQueryHeaders(
        hRequest,
        WINHTTP_QUERY_RAW_HEADERS_CRLF,
        WINHTTP_HEADER_NAME_BY_INDEX,
        WINHTTP_NO_OUTPUT_BUFFER,
        &dwHeaderSize,
        WINHTTP_NO_HEADER_INDEX);

    std::vector<wchar_t> headerBuffer(dwHeaderSize / sizeof(wchar_t));
    if (dwHeaderSize > 0)
    {
      WinHttpQueryHeaders(
          hRequest,
          WINHTTP_QUERY_RAW_HEADERS_CRLF,
          WINHTTP_HEADER_NAME_BY_INDEX,
          headerBuffer.data(),
          &dwHeaderSize,
          WINHTTP_NO_HEADER_INDEX);
    }

    std::vector<BYTE> responseData;
    DWORD dwBytesRead = 0;
    do
    {
      BYTE buffer[8192];
      dwBytesRead = 0;
      if (!WinHttpReadData(hRequest, buffer, sizeof(buffer), &dwBytesRead))
      {
        DWORD dwError = GetLastError();
        if (dwError != ERROR_WINHTTP_CONNECTION_ERROR)
        {
          break;
        }
      }
      if (dwBytesRead > 0)
      {
        responseData.insert(responseData.end(), buffer, buffer + dwBytesRead);
      }
    } while (dwBytesRead > 0);

    napi_create_object(env, &result);

    napi_value statusCode_key;
    napi_create_string_utf8(env, "statusCode", NAPI_AUTO_LENGTH, &statusCode_key);
    napi_value statusCode_val;
    napi_create_int32(env, dwStatusCode, &statusCode_val);
    napi_set_property(env, result, statusCode_key, statusCode_val);

    if (dwHeaderSize > 0)
    {
      std::string headersStr = wstring_to_utf8(std::wstring(headerBuffer.data()));
      napi_value headers_key;
      napi_create_string_utf8(env, "headers", NAPI_AUTO_LENGTH, &headers_key);
      napi_value headers_val;
      napi_create_string_utf8(env, headersStr.c_str(), NAPI_AUTO_LENGTH, &headers_val);
      napi_set_property(env, result, headers_key, headers_val);
    }

    napi_value body_key;
    napi_create_string_utf8(env, "body", NAPI_AUTO_LENGTH, &body_key);
    napi_value body_val;
    if (!responseData.empty())
    {
      napi_create_buffer_copy(env, responseData.size(), responseData.data(), nullptr, &body_val);
    }
    else
    {
      napi_create_buffer(env, 0, nullptr, &body_val);
    }
    napi_set_property(env, result, body_key, body_val);
  }
  catch (const std::exception &e)
  {
    napi_throw_error(env, nullptr, e.what());
    result = nullptr;
  }

  if (hRequest)
  {
    WinHttpCloseHandle(hRequest);
  }
  if (hConnect)
  {
    WinHttpCloseHandle(hConnect);
  }
  if (hSession)
  {
    WinHttpCloseHandle(hSession);
  }
  if (pCertContext)
  {
    CertFreeCertificateContext(pCertContext);
  }
  if (hStore)
  {
    CertCloseStore(hStore, 0);
  }

  return result;
}

napi_value Init(napi_env env, napi_value exports)
{
  napi_value fn;
  napi_create_function(env, nullptr, 0, MakeRequest, nullptr, &fn);
  napi_set_named_property(env, exports, "request", fn);
  return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
