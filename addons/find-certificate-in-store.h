#pragma once

#include <node_api.h>

#include <windows.h>
#include <wincrypt.h>

#include <stdexcept>
#include <string>
#include <vector>

inline std::vector<BYTE> ReadCertificateDer(napi_env env, napi_value value)
{
  if (value == nullptr)
    return {};

  napi_valuetype type;
  if (napi_typeof(env, value, &type) != napi_ok)
    return {};

  if (type == napi_undefined || type == napi_null)
    return {};

  bool is_buffer = false;
  if (napi_is_buffer(env, value, &is_buffer) != napi_ok || !is_buffer)
    throw std::runtime_error("Certificate DER must be a Buffer");

  void *data = nullptr;
  size_t length = 0;
  if (napi_get_buffer_info(env, value, &data, &length) != napi_ok ||
      data == nullptr || length == 0)
    return {};

  const auto *bytes = static_cast<const BYTE *>(data);
  return std::vector<BYTE>(bytes, bytes + length);
}

inline PCCERT_CONTEXT FindCertificateInStore(
    HCERTSTORE store,
    const std::wstring &subject,
    const std::vector<BYTE> &der)
{
  if (!der.empty())
  {
    PCCERT_CONTEXT needle = CertCreateCertificateContext(
        X509_ASN_ENCODING | PKCS_7_ASN_ENCODING,
        der.data(),
        static_cast<DWORD>(der.size()));

    if (!needle)
      throw std::runtime_error("Failed to parse certificate DER");

    PCCERT_CONTEXT found = CertFindCertificateInStore(
        store,
        X509_ASN_ENCODING | PKCS_7_ASN_ENCODING,
        0,
        CERT_FIND_EXISTING,
        needle,
        NULL);

    CertFreeCertificateContext(needle);

    if (!found)
      throw std::runtime_error("Certificate not found in store");

    return found;
  }

  PCCERT_CONTEXT found = CertFindCertificateInStore(
      store,
      X509_ASN_ENCODING | PKCS_7_ASN_ENCODING,
      0,
      CERT_FIND_SUBJECT_STR_W,
      (LPVOID)subject.c_str(),
      NULL);

  if (!found)
    throw std::runtime_error("Certificate not found in store");

  return found;
}
