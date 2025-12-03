#include <node_api.h>

#include <libxml/parser.h>
#include <libxml/xmlschemas.h>
#include "libxml/xmlversion.h"

#include <string.h>
#include <stdlib.h>
#include <stdio.h>
#include <sys/stat.h>

#ifdef _WIN32
#include <io.h>
#include <direct.h>
#include <windows.h>
#ifndef F_OK
#define F_OK 0
#endif
#define access _access
#define chdir _chdir
#define fileno _fileno

static char* dirname_win(char* path) {
  if (path == NULL) {
    return NULL;
  }

  if (*path == '\0') {
    path[0] = '.';
    path[1] = '\0';
    return path;
  }

  size_t len = strlen(path);
  while (len > 0 && (path[len - 1] == '\\' || path[len - 1] == '/')) {
    len--;
    path[len] = '\0';
  }

  if (len == 0) {
    path[0] = '.';
    path[1] = '\0';
    return path;
  }

  if (len == 2 && path[1] == ':') {
    path[2] = '\\';
    path[3] = '\0';
    return path;
  }

  char* last_backslash = strrchr(path, '\\');
  char* last_slash = strrchr(path, '/');
  char* last_sep = NULL;
  if (last_backslash != NULL && last_slash != NULL) {
    last_sep = (last_backslash > last_slash) ? last_backslash : last_slash;
  } else if (last_backslash != NULL) {
    last_sep = last_backslash;
  } else if (last_slash != NULL) {
    last_sep = last_slash;
  }

  if (last_sep == NULL) {
    path[0] = '.';
    path[1] = '\0';
    return path;
  }

  if (last_sep == path || (last_sep == path + 2 && path[1] == ':')) {
    last_sep[1] = '\0';
    return path;
  }

  if (path[0] == '\\' && path[1] == '\\' && last_sep == path + 1) {
    last_sep[1] = '\0';
    return path;
  }

  *last_sep = '\0';
  return path;
}

#define dirname dirname_win
#else
#include <unistd.h>
#include <libgen.h>
#endif

struct AsyncWorkData
{
  napi_env env;
  napi_deferred deferred;
  napi_async_work work;

  char *xmlStr;
  char *xsdPath;
  char *error;

  bool result;
};

struct ValidationError
{
  char *message = NULL;
};

void validationErrorCallback(void *ctx, const char *msg, ...)
{
  ValidationError *error = static_cast<ValidationError *>(ctx);

  char buffer[1024];

  va_list args;
  va_start(args, msg);
  vsnprintf(buffer, sizeof(buffer), msg, args);
  va_end(args);

  if (error->message == NULL)
  {
    error->message = strdup(buffer);
  }
  else
  {
    size_t size = strlen(error->message) + strlen(buffer) + 2;
    char *message = (char *)realloc(error->message, size);

    error->message = message;
    strcat(error->message, buffer);
  }
}

bool validate_xml(const char *xmlStr, const char *xsdFilePath, char *err, size_t size)
{

  if (xmlStr == NULL || strlen(xmlStr) == 0)
  {
    snprintf(err, size, "Please provide a valid xml content");
    return false;
  }

  if (xsdFilePath == NULL || strlen(xsdFilePath) == 0)
  {
    snprintf(err, size, "Please provide a valid existing xsd path");
    return false;
  }

  char *xsdPath = strdup(xsdFilePath);
  if (xsdPath != NULL)
  {
    char *xsdDir = dirname(xsdPath);
    if (xsdDir != NULL && access(xsdDir, F_OK) == 0)
    {
      chdir(xsdDir);
    }
    free(xsdPath);
  }

  FILE *file = fopen(xsdFilePath, "rb");
  if (file == NULL)
  {
    snprintf(err, size, "Cannot open XSD file: %s", xsdFilePath);
    return false;
  }

  struct stat fileStat;
  if (fstat(fileno(file), &fileStat) != 0)
  {
    fclose(file);
    snprintf(err, size, "Cannot get file size for XSD: %s", xsdFilePath);
    return false;
  }

  size_t fileSize = fileStat.st_size;
  char *xsdStr = (char *)malloc(fileSize);
  if (xsdStr == NULL)
  {
    fclose(file);
    snprintf(err, size, "Memory allocation failed for XSD file");
    return false;
  }

  size_t bytesRead = fread(xsdStr, 1, fileSize, file);
  fclose(file);

  if (bytesRead != fileSize)
  {
    free(xsdStr);
    snprintf(err, size, "Error reading XSD file: %s", xsdFilePath);
    return false;
  }

  ValidationError validationErrorCtx;
  xmlSetGenericErrorFunc(&validationErrorCtx, validationErrorCallback);

  xmlDocPtr xml = xmlReadMemory(xmlStr, strlen(xmlStr), "noname.xml", "utf-8", 0);
  if (xml == NULL)
  {
    snprintf(err, size, "Error processing xml content, check if your xml is valid: %s", validationErrorCtx.message);
    return false;
  }

  xmlSchemaParserCtxtPtr schemaParserCtxt = xmlSchemaNewMemParserCtxt(xsdStr, fileSize);
  if (!schemaParserCtxt)
  {
    snprintf(err, size, "Error creating XSD parser context");
    xmlFreeDoc(xml);
    return false;
  }

  xmlSchemaSetParserErrors(schemaParserCtxt, (xmlSchemaValidityErrorFunc)validationErrorCallback,
                           (xmlSchemaValidityWarningFunc)validationErrorCallback, &validationErrorCtx);

  xmlSchemaPtr schema = xmlSchemaParse(schemaParserCtxt);
  if (!schema)
  {
    snprintf(err, size, "Invalid XSD file: %s", validationErrorCtx.message);
    xmlFreeDoc(xml);
    xmlSchemaFreeParserCtxt(schemaParserCtxt);
    return false;
  }

  xmlSchemaValidCtxtPtr validCtxt = xmlSchemaNewValidCtxt(schema);
  if (!validCtxt)
  {
    snprintf(err, size, "Error creating validation context");
    xmlFreeDoc(xml);
    xmlSchemaFree(schema);
    xmlSchemaFreeParserCtxt(schemaParserCtxt);
    return false;
  }

  xmlSchemaSetValidErrors(validCtxt, (xmlSchemaValidityErrorFunc)validationErrorCallback,
                          (xmlSchemaValidityWarningFunc)validationErrorCallback, &validationErrorCtx);

  bool result = false;

  if (xmlSchemaValidateDoc(validCtxt, xml) == 0)
  {
    result = true;
  }
  else
  {
    snprintf(err, size, "Invalid xml schema: %s", validationErrorCtx.message);
  }

  xmlFreeDoc(xml);
  xmlSchemaFree(schema);
  xmlSchemaFreeValidCtxt(validCtxt);
  xmlSchemaFreeParserCtxt(schemaParserCtxt);

  free(xsdStr);

  return result;
}

void async_validate_xml(napi_env env, void *_data)
{
  struct AsyncWorkData *data = static_cast<struct AsyncWorkData *>(_data);
  char err[1024] = "";

  data->result = validate_xml(
      data->xmlStr, data->xsdPath,
      err, sizeof(err));

  data->error = strdup(err);
}

void complete_async_validate_xml(napi_env env, napi_status status, void *_data)
{
  AsyncWorkData *data = static_cast<struct AsyncWorkData *>(_data);

  napi_value result;
  napi_get_boolean(env, data->result, &result);

  if (data->result)
  {
    napi_resolve_deferred(env, data->deferred, result);
  }
  else
  {
    napi_value error;
    napi_create_string_utf8(env, data->error, NAPI_AUTO_LENGTH, &error);
    napi_reject_deferred(env, data->deferred, error);
  }

  napi_delete_async_work(env, data->work);
  free(data->error);
  delete data;
}

int extract_args(napi_env env, napi_callback_info info, char **xmlStr, char **xsdPath, char *err, size_t errSize)
{
  size_t argc = 2;
  napi_value args[2];
  napi_get_cb_info(env, info, &argc, args, NULL, NULL);

  if (argc < 2)
  {
    snprintf(
        err, errSize,
        "You must provide 2 arguments: `xml content` and `xsd path`");

    return 1;
  }

  size_t xmlLen, xsdLen;
  napi_get_value_string_utf8(env, args[0], NULL, 0, &xmlLen);
  napi_get_value_string_utf8(env, args[1], NULL, 0, &xsdLen);

  *xmlStr = (char *)malloc(xmlLen + 1);
  *xsdPath = (char *)malloc(xsdLen + 1);

  napi_get_value_string_utf8(env, args[0], *xmlStr, xmlLen + 1, NULL);
  napi_get_value_string_utf8(env, args[1], *xsdPath, xsdLen + 1, NULL);

  return 0;
}

napi_value AsyncValidateXml(napi_env env, napi_callback_info info)
{
  char *xmlStr, *xsdPath;

  napi_value promise;
  AsyncWorkData *data = new AsyncWorkData();

  napi_status status = napi_create_promise(env, &data->deferred, &promise);

  if (status != napi_ok)
  {
    napi_throw_error(env, NULL, "Error creating promise");
    delete data;
    return NULL;
  }

  char err[1024] = "";
  if (extract_args(env, info, &xmlStr, &xsdPath, err, sizeof(err)) != 0)
  {
    napi_value error;
    napi_create_string_utf8(env, err, sizeof(err), &error);
    napi_reject_deferred(env, data->deferred, error);
    delete data;
    return promise;
  }

  data->xmlStr = xmlStr;
  data->xsdPath = xsdPath;

  napi_value resource_name;
  napi_create_string_utf8(env, "AsyncValidateXml", -1, &resource_name);

  status = napi_create_async_work(
      env,
      NULL,
      resource_name,
      async_validate_xml,
      complete_async_validate_xml,
      data,
      &data->work);

  if (status != napi_ok)
  {
    napi_value err;
    napi_create_string_utf8(env, "Error creating AsyncWork.", NAPI_AUTO_LENGTH, &err);
    napi_reject_deferred(env, data->deferred, err);
    delete data;
    return promise;
  }

  if (data->work == NULL)
  {
    napi_value err;
    napi_create_string_utf8(env, "Async work is NULL", NAPI_AUTO_LENGTH, &err);
    napi_reject_deferred(env, data->deferred, err);
    delete data;
    return promise;
  }

  napi_queue_async_work(env, data->work);

  return promise;
}

napi_value ValidateXml(napi_env env, napi_callback_info info)
{
  char *xmlStr, *xsdPath;
  char err[1024] = "";

  if (extract_args(env, info, &xmlStr, &xsdPath, err, sizeof(err)) != 0)
  {
    napi_throw_error(env, NULL, err);
    return NULL;
  }

  bool valid = validate_xml(xmlStr, xsdPath, err, sizeof(err));

  free(xmlStr);
  free(xsdPath);

  if (!valid)
  {
    napi_throw_error(env, NULL, err);
    return NULL;
  }

  napi_value result;
  napi_get_boolean(env, valid, &result);
  return result;
}

napi_value Init(napi_env env, napi_value exports)
{
  napi_value fn;
  napi_create_function(env, nullptr, 0, AsyncValidateXml, nullptr, &fn);
  napi_set_named_property(env, exports, "validate", fn);

  napi_create_function(env, nullptr, 0, ValidateXml, nullptr, &fn);
  napi_set_named_property(env, exports, "validateSync", fn);

  return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
