#include <node_api.h>

#include <windows.h>
#include <wincrypt.h>
#include <ncrypt.h>
#include <bcrypt.h>
#include <string>
#include <vector>
#include <stdexcept>

#pragma comment(lib, "crypt32.lib")
#pragma comment(lib, "ncrypt.lib")
#pragma comment(lib, "bcrypt.lib")

std::wstring utf8_to_wstring(const std::string &str)
{
  if (str.empty())
    return std::wstring();
  int size_needed = MultiByteToWideChar(CP_UTF8, 0, &str[0], (int)str.size(), NULL, 0);
  std::wstring wstrTo(size_needed, 0);
  MultiByteToWideChar(CP_UTF8, 0, &str[0], (int)str.size(), &wstrTo[0], size_needed);
  return wstrTo;
}

napi_value SignDataWithCertificate(napi_env env, napi_callback_info info)
{
  size_t argc = 3;
  napi_value args[3];
  napi_get_cb_info(env, info, &argc, args, nullptr, nullptr);

  if (argc < 3)
  {
    napi_value error_msg;
    napi_create_string_utf8(env, "Expected: subject (string), data (Buffer), algorithm (string)", NAPI_AUTO_LENGTH, &error_msg);
    napi_value error;
    napi_create_type_error(env, nullptr, error_msg, &error);
    napi_throw(env, error);
    return nullptr;
  }

  napi_valuetype arg0_type, arg1_type, arg2_type;
  napi_typeof(env, args[0], &arg0_type);
  napi_typeof(env, args[1], &arg1_type);
  napi_typeof(env, args[2], &arg2_type);

  if (arg0_type != napi_string || arg1_type != napi_object || arg2_type != napi_string)
  {
    napi_value error_msg;
    napi_create_string_utf8(env, "Expected: subject (string), data (Buffer), algorithm (string)", NAPI_AUTO_LENGTH, &error_msg);
    napi_value error;
    napi_create_type_error(env, nullptr, error_msg, &error);
    napi_throw(env, error);
    return nullptr;
  }

  bool is_buffer;
  napi_is_buffer(env, args[1], &is_buffer);
  if (!is_buffer)
  {
    napi_value error_msg;
    napi_create_string_utf8(env, "Second argument must be a Buffer", NAPI_AUTO_LENGTH, &error_msg);
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

  size_t algorithm_len = 0;
  napi_get_value_string_utf8(env, args[2], nullptr, 0, &algorithm_len);
  std::string algorithm_str(algorithm_len, '\0');
  napi_get_value_string_utf8(env, args[2], &algorithm_str[0], algorithm_len + 1, nullptr);

  BYTE *data = nullptr;
  size_t dataLenSize = 0;
  napi_get_buffer_info(env, args[1], (void **)&data, &dataLenSize);
  DWORD dataLen = (DWORD)dataLenSize;

  HCERTSTORE hStore = NULL;
  PCCERT_CONTEXT pCertContext = NULL;
  HCRYPTPROV_OR_NCRYPT_KEY_HANDLE hCryptProv = NULL;
  DWORD dwKeySpec = 0;
  BOOL fCallerFreeProvOrNCryptKey = FALSE;
  HCRYPTHASH hHash = NULL;
  napi_value result = nullptr;

  try
  {
    hStore = CertOpenStore(
        CERT_STORE_PROV_SYSTEM_W,
        0,
        NULL,
        CERT_SYSTEM_STORE_CURRENT_USER,
        L"MY");
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

    ALG_ID hashAlg = 0;
    if (algorithm_str == "sha1")
    {
      hashAlg = CALG_SHA1;
    }
    else if (algorithm_str == "sha256")
    {
      hashAlg = CALG_SHA_256;
    }
    else
    {
      throw std::runtime_error("Unsupported algorithm: " + algorithm_str);
    }

    // For SHA256, prefer CNG from the start since many CSPs don't support it
    // Don't use SILENT flag for SHA256 to allow user interaction (e.g., smart card PIN)
    // For SHA1, allow both CSP and CNG to maximize compatibility, especially in CI environments
    DWORD acquireFlags;
    if (hashAlg == CALG_SHA_256)
    {
      acquireFlags = CRYPT_ACQUIRE_PREFER_NCRYPT_KEY_FLAG;
    }
    else
    {
      // For SHA1, allow both CSP and CNG to handle different certificate storage scenarios
      // This helps in CI environments where certificates may be stored differently
      acquireFlags = CRYPT_ACQUIRE_SILENT_FLAG | CRYPT_ACQUIRE_ALLOW_NCRYPT_KEY_FLAG;
    }

    if (!CryptAcquireCertificatePrivateKey(
            pCertContext,
            acquireFlags,
            NULL,
            &hCryptProv,
            &dwKeySpec,
            &fCallerFreeProvOrNCryptKey))
    {
      DWORD error = GetLastError();
      std::string errorMsg = "Failed to acquire private key. Error: " + std::to_string(error);

      if (error == 0x80090014) // NTE_BAD_KEYSET
      {
        errorMsg += " (NTE_BAD_KEYSET: The keyset does not exist or the private key is not accessible. "
                    "Ensure the certificate is installed with exportable key and the process has access to it.)";
      }

      throw std::runtime_error(errorMsg);
    }

    if (dwKeySpec == CERT_NCRYPT_KEY_SPEC)
    {
      // CNG (Next Generation Crypto API) - para certificados A3
      NCRYPT_KEY_HANDLE hKey = (NCRYPT_KEY_HANDLE)hCryptProv;

      LPCWSTR hashAlgorithm = nullptr;
      if (algorithm_str == "sha1")
      {
        hashAlgorithm = BCRYPT_SHA1_ALGORITHM;
      }
      else if (algorithm_str == "sha256")
      {
        hashAlgorithm = BCRYPT_SHA256_ALGORITHM;
      }
      else
      {
        throw std::runtime_error("Unsupported algorithm for CNG: " + algorithm_str);
      }

      BCRYPT_ALG_HANDLE hAlg = NULL;
      BCRYPT_HASH_HANDLE hHashHandle = NULL;
      BYTE *pbHashObject = NULL;
      DWORD cbHashObject = 0;
      DWORD cbData = 0;
      BYTE *pbHash = NULL;
      DWORD cbHash = 0;
      DWORD cbSignature = 0;
      BYTE *pbSignature = NULL;

      NTSTATUS status = BCryptOpenAlgorithmProvider(&hAlg, hashAlgorithm, NULL, 0);
      if (status != 0)
      {
        throw std::runtime_error("Failed to open hash algorithm provider. Error: " + std::to_string(status));
      }

      status = BCryptGetProperty(hAlg, BCRYPT_OBJECT_LENGTH, (PBYTE)&cbHashObject, sizeof(DWORD), &cbData, 0);
      if (status != 0)
      {
        BCryptCloseAlgorithmProvider(hAlg, 0);
        throw std::runtime_error("Failed to get hash object length. Error: " + std::to_string(status));
      }

      status = BCryptGetProperty(hAlg, BCRYPT_HASH_LENGTH, (PBYTE)&cbHash, sizeof(DWORD), &cbData, 0);
      if (status != 0)
      {
        BCryptCloseAlgorithmProvider(hAlg, 0);
        throw std::runtime_error("Failed to get hash length. Error: " + std::to_string(status));
      }

      pbHashObject = (BYTE *)LocalAlloc(LMEM_FIXED, cbHashObject);
      pbHash = (BYTE *)LocalAlloc(LMEM_FIXED, cbHash);
      if (!pbHashObject || !pbHash)
      {
        if (pbHashObject) LocalFree(pbHashObject);
        if (pbHash) LocalFree(pbHash);
        BCryptCloseAlgorithmProvider(hAlg, 0);
        throw std::runtime_error("Failed to allocate memory for hash");
      }

      status = BCryptCreateHash(hAlg, &hHashHandle, pbHashObject, cbHashObject, NULL, 0, 0);
      if (status != 0)
      {
        LocalFree(pbHashObject);
        LocalFree(pbHash);
        BCryptCloseAlgorithmProvider(hAlg, 0);
        throw std::runtime_error("Failed to create hash. Error: " + std::to_string(status));
      }

      status = BCryptHashData(hHashHandle, data, dataLen, 0);
      if (status != 0)
      {
        BCryptDestroyHash(hHashHandle);
        LocalFree(pbHashObject);
        LocalFree(pbHash);
        BCryptCloseAlgorithmProvider(hAlg, 0);
        throw std::runtime_error("Failed to hash data. Error: " + std::to_string(status));
      }

      status = BCryptFinishHash(hHashHandle, pbHash, cbHash, 0);
      if (status != 0)
      {
        BCryptDestroyHash(hHashHandle);
        LocalFree(pbHashObject);
        LocalFree(pbHash);
        BCryptCloseAlgorithmProvider(hAlg, 0);
        throw std::runtime_error("Failed to finish hash. Error: " + std::to_string(status));
      }

      BCryptDestroyHash(hHashHandle);
      hHashHandle = NULL;

      status = NCryptSignHash(hKey, NULL, pbHash, cbHash, NULL, 0, &cbSignature, NCRYPT_PAD_PKCS1_FLAG);
      if (status != 0 && status != NTE_BUFFER_TOO_SMALL)
      {
        LocalFree(pbHashObject);
        LocalFree(pbHash);
        BCryptCloseAlgorithmProvider(hAlg, 0);
        throw std::runtime_error("Failed to get signature size. Error: " + std::to_string(status));
      }

      pbSignature = (BYTE *)LocalAlloc(LMEM_FIXED, cbSignature);
      if (!pbSignature)
      {
        LocalFree(pbHashObject);
        LocalFree(pbHash);
        BCryptCloseAlgorithmProvider(hAlg, 0);
        throw std::runtime_error("Failed to allocate memory for signature");
      }

      status = NCryptSignHash(hKey, NULL, pbHash, cbHash, pbSignature, cbSignature, &cbSignature, NCRYPT_PAD_PKCS1_FLAG);
      if (status != 0)
      {
        LocalFree(pbHashObject);
        LocalFree(pbHash);
        LocalFree(pbSignature);
        BCryptCloseAlgorithmProvider(hAlg, 0);

        if (status == NTE_BAD_KEY_STATE || status == 0x80090027 || status == -2146893785)
        {
          throw std::runtime_error(
            "CNG signing failed. The certificate's key provider may not fully support CNG signing operations, "
            "or the key may require user interaction (e.g., smart card PIN). Error: " + std::to_string(status));
        }
        else
        {
          throw std::runtime_error("Failed to sign hash with CNG. Error: " + std::to_string(status));
        }
      }

      std::vector<BYTE> reversedSignature(cbSignature);
      for (DWORD i = 0; i < cbSignature; i++)
      {
        reversedSignature[i] = pbSignature[cbSignature - 1 - i];
      }

      napi_create_buffer_copy(env, cbSignature, reversedSignature.data(), nullptr, &result);

      LocalFree(pbHashObject);
      LocalFree(pbHash);
      LocalFree(pbSignature);
      BCryptCloseAlgorithmProvider(hAlg, 0);
    }
    else
    {
      // CSP (Crypto Service Provider) - para certificados A1
      DWORD error = 0;
      if (!CryptCreateHash(hCryptProv, hashAlg, 0, 0, &hHash))
      {
        error = GetLastError();
        if (error == NTE_BAD_ALGID && hashAlg == CALG_SHA_256)
        {
          if (fCallerFreeProvOrNCryptKey && hCryptProv)
          {
            CryptReleaseContext(hCryptProv, 0);
            hCryptProv = NULL;
          }

          HCRYPTPROV_OR_NCRYPT_KEY_HANDLE hNCryptKey = NULL;
          DWORD dwNCryptKeySpec = 0;
          BOOL fCallerFreeNCryptKey = FALSE;

          if (CryptAcquireCertificatePrivateKey(
                  pCertContext,
                  CRYPT_ACQUIRE_PREFER_NCRYPT_KEY_FLAG,
                  NULL,
                  &hNCryptKey,
                  &dwNCryptKeySpec,
                  &fCallerFreeNCryptKey) && dwNCryptKeySpec == CERT_NCRYPT_KEY_SPEC)
          {
            NCRYPT_KEY_HANDLE hKey = (NCRYPT_KEY_HANDLE)hNCryptKey;

            DWORD dwKeyUsage = 0;
            DWORD cbResult = 0;
            NTSTATUS testStatus = NCryptGetProperty(hKey, NCRYPT_KEY_USAGE_PROPERTY, (PBYTE)&dwKeyUsage, sizeof(DWORD), &cbResult, 0);
            if (testStatus == 0 && !(dwKeyUsage & NCRYPT_ALLOW_SIGNING_FLAG))
            {
              if (fCallerFreeNCryptKey) NCryptFreeObject(hNCryptKey);
              throw std::runtime_error("CNG key does not allow signing operations. The certificate's key provider may not fully support CNG signing. Try using SHA1 instead, or use a certificate stored in a CNG-compatible provider.");
            }

            BCRYPT_ALG_HANDLE hBcryptAlg = NULL;
            BCRYPT_HASH_HANDLE hBcryptHash = NULL;
            BYTE *pbBcryptHashObject = NULL;
            DWORD cbBcryptHashObject = 0;
            DWORD cbData = 0;
            BYTE *pbHash = NULL;
            DWORD cbHash = 0;
            DWORD cbSignature = 0;
            BYTE *pbSignature = NULL;
            NTSTATUS status = 0;

            status = BCryptOpenAlgorithmProvider(&hBcryptAlg, BCRYPT_SHA256_ALGORITHM, NULL, 0);
            if (status != 0)
            {
              if (fCallerFreeNCryptKey) NCryptFreeObject(hNCryptKey);
              throw std::runtime_error("Failed to open BCrypt SHA256 provider. Error: " + std::to_string(status));
            }

            status = BCryptGetProperty(hBcryptAlg, BCRYPT_OBJECT_LENGTH, (PBYTE)&cbBcryptHashObject, sizeof(DWORD), &cbData, 0);
            if (status != 0)
            {
              BCryptCloseAlgorithmProvider(hBcryptAlg, 0);
              if (fCallerFreeNCryptKey) NCryptFreeObject(hNCryptKey);
              throw std::runtime_error("Failed to get BCrypt hash object length. Error: " + std::to_string(status));
            }

            status = BCryptGetProperty(hBcryptAlg, BCRYPT_HASH_LENGTH, (PBYTE)&cbHash, sizeof(DWORD), &cbData, 0);
            if (status != 0)
            {
              BCryptCloseAlgorithmProvider(hBcryptAlg, 0);
              if (fCallerFreeNCryptKey) NCryptFreeObject(hNCryptKey);
              throw std::runtime_error("Failed to get BCrypt hash length. Error: " + std::to_string(status));
            }

            pbBcryptHashObject = (BYTE *)LocalAlloc(LMEM_FIXED, cbBcryptHashObject);
            pbHash = (BYTE *)LocalAlloc(LMEM_FIXED, cbHash);
            if (!pbBcryptHashObject || !pbHash)
            {
              if (pbBcryptHashObject) LocalFree(pbBcryptHashObject);
              if (pbHash) LocalFree(pbHash);
              BCryptCloseAlgorithmProvider(hBcryptAlg, 0);
              if (fCallerFreeNCryptKey) NCryptFreeObject(hNCryptKey);
              throw std::runtime_error("Failed to allocate memory for BCrypt hash");
            }

            status = BCryptCreateHash(hBcryptAlg, &hBcryptHash, pbBcryptHashObject, cbBcryptHashObject, NULL, 0, 0);
            if (status != 0)
            {
              LocalFree(pbBcryptHashObject);
              LocalFree(pbHash);
              BCryptCloseAlgorithmProvider(hBcryptAlg, 0);
              if (fCallerFreeNCryptKey) NCryptFreeObject(hNCryptKey);
              throw std::runtime_error("Failed to create BCrypt hash. Error: " + std::to_string(status));
            }

            status = BCryptHashData(hBcryptHash, data, dataLen, 0);
            if (status != 0)
            {
              BCryptDestroyHash(hBcryptHash);
              LocalFree(pbBcryptHashObject);
              LocalFree(pbHash);
              BCryptCloseAlgorithmProvider(hBcryptAlg, 0);
              if (fCallerFreeNCryptKey) NCryptFreeObject(hNCryptKey);
              throw std::runtime_error("Failed to hash data with BCrypt. Error: " + std::to_string(status));
            }

            status = BCryptFinishHash(hBcryptHash, pbHash, cbHash, 0);
            if (status != 0)
            {
              BCryptDestroyHash(hBcryptHash);
              LocalFree(pbBcryptHashObject);
              LocalFree(pbHash);
              BCryptCloseAlgorithmProvider(hBcryptAlg, 0);
              if (fCallerFreeNCryptKey) NCryptFreeObject(hNCryptKey);
              throw std::runtime_error("Failed to finish BCrypt hash. Error: " + std::to_string(status));
            }

            BCryptDestroyHash(hBcryptHash);
            LocalFree(pbBcryptHashObject);
            BCryptCloseAlgorithmProvider(hBcryptAlg, 0);

            status = NCryptSignHash(hKey, NULL, pbHash, cbHash, NULL, 0, &cbSignature, NCRYPT_PAD_PKCS1_FLAG);
            if (status != 0 && status != NTE_BUFFER_TOO_SMALL)
            {
              LocalFree(pbHash);
              if (fCallerFreeNCryptKey) NCryptFreeObject(hNCryptKey);
              throw std::runtime_error("Failed to get CNG signature size. Error: " + std::to_string(status));
            }

            pbSignature = (BYTE *)LocalAlloc(LMEM_FIXED, cbSignature);
            if (!pbSignature)
            {
              LocalFree(pbHash);
              if (fCallerFreeNCryptKey) NCryptFreeObject(hNCryptKey);
              throw std::runtime_error("Failed to allocate memory for signature");
            }

            status = NCryptSignHash(hKey, NULL, pbHash, cbHash, pbSignature, cbSignature, &cbSignature, NCRYPT_PAD_PKCS1_FLAG);
            if (status != 0)
            {
              status = NCryptSignHash(hKey, NULL, pbHash, cbHash, pbSignature, cbSignature, &cbSignature, 0);
              if (status != 0)
              {
                LocalFree(pbHash);
                LocalFree(pbSignature);
                if (fCallerFreeNCryptKey) NCryptFreeObject(hNCryptKey);

                // Provide more specific error messages with helpful suggestions
                if (status == NTE_BAD_KEY_STATE || status == 0x80090027 || status == -2146893785)
                {
                  throw std::runtime_error(
                    "SHA256 signing failed: The certificate's key provider does not fully support CNG signing operations. "
                    "This typically occurs with certificates stored in legacy CSP (Cryptographic Service Provider) providers that don't support SHA256. "
                    "Even though Windows can acquire a CNG handle, the actual signing operation fails because the underlying provider is CSP-based. "
                    "Solutions: 1) Use SHA1 instead of SHA256 (if acceptable for your use case), "
                    "2) Import/use a certificate stored in a CNG-compatible provider (e.g., Microsoft Software Key Storage Provider), "
                    "3) Check if your certificate requires user interaction (smart card PIN entry). "
                    "Error code: " + std::to_string(status));
                }
                else
                {
                  throw std::runtime_error("Failed to sign hash with CNG. Error: " + std::to_string(status));
                }
              }
            }

            std::vector<BYTE> reversedSignature(cbSignature);
            for (DWORD i = 0; i < cbSignature; i++)
            {
              reversedSignature[i] = pbSignature[cbSignature - 1 - i];
            }

            napi_create_buffer_copy(env, cbSignature, reversedSignature.data(), nullptr, &result);

            LocalFree(pbHash);
            LocalFree(pbSignature);

            hCryptProv = hNCryptKey;
            dwKeySpec = dwNCryptKeySpec;
            fCallerFreeProvOrNCryptKey = fCallerFreeNCryptKey;
          }
          else
          {
            if (CryptAcquireCertificatePrivateKey(
                    pCertContext,
                    CRYPT_ACQUIRE_SILENT_FLAG | CRYPT_ACQUIRE_ALLOW_NCRYPT_KEY_FLAG,
                    NULL,
                    &hCryptProv,
                    &dwKeySpec,
                    &fCallerFreeProvOrNCryptKey))
            {
              throw std::runtime_error("SHA256 is not supported by the certificate's CSP. The certificate may require a CSP that supports SHA256, or you may need to use SHA1 instead. Error: " + std::to_string(error));
            }
            else
            {
              throw std::runtime_error("Failed to re-acquire certificate key. Error: " + std::to_string(GetLastError()));
            }
          }
        }
        else
        {
          throw std::runtime_error("Failed to create hash. CSP does not support the requested algorithm. Error: " + std::to_string(error));
        }
      }
      else
      {
        if (!CryptHashData(hHash, data, dataLen, 0))
        {
          throw std::runtime_error("Failed to hash data. Error: " + std::to_string(GetLastError()));
        }

        DWORD signatureLen = 0;
        if (!CryptSignHash(hHash, dwKeySpec, NULL, 0, NULL, &signatureLen))
        {
          throw std::runtime_error("Failed to get signature size. Error: " + std::to_string(GetLastError()));
        }

        BYTE *signature = (BYTE *)LocalAlloc(LMEM_FIXED, signatureLen);
        if (!signature)
        {
          throw std::runtime_error("Failed to allocate memory for signature");
        }

        if (!CryptSignHash(hHash, dwKeySpec, NULL, 0, signature, &signatureLen))
        {
          LocalFree(signature);
          throw std::runtime_error("Failed to sign hash. Error: " + std::to_string(GetLastError()));
        }

        std::vector<BYTE> reversedSignature(signatureLen);
        for (DWORD i = 0; i < signatureLen; i++)
        {
          reversedSignature[i] = signature[signatureLen - 1 - i];
        }

        napi_create_buffer_copy(env, signatureLen, reversedSignature.data(), nullptr, &result);

        LocalFree(signature);
      }
    }
  }
  catch (const std::exception &e)
  {
    napi_throw_error(env, nullptr, e.what());
    result = nullptr;
  }

  if (hHash)
  {
    CryptDestroyHash(hHash);
  }

  if (fCallerFreeProvOrNCryptKey && hCryptProv)
  {
    if (dwKeySpec == CERT_NCRYPT_KEY_SPEC)
    {
      NCryptFreeObject(hCryptProv);
    }
    else
    {
      CryptReleaseContext(hCryptProv, 0);
    }
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

  napi_create_function(env, nullptr, 0, SignDataWithCertificate, nullptr, &fn);
  napi_set_named_property(env, exports, "sign", fn);

  return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
