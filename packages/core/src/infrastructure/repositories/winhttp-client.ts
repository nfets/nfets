import os from 'node:os';
import { addon } from '@nfets/core/shared/addon';

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import type { ReadCertificateResponse } from '@nfets/core/domain';
import { ASN1 } from '@nfets/core/application';

interface WinHttpClientAdapter {
  request(
    subject: string,
    method: string,
    url: string,
    options: {
      headers?: string;
      body?: Buffer;
      timeout?: number;
    },
  ): Promise<{
    statusCode: number;
    headers: string;
    body: Buffer;
  }>;
}

export class WinHttpClient {
  public interceptors = {
    request: {
      use: () => 0,
      eject: () => void 0,
      clear: () => void 0,
    },
    response: {
      use: () => 0,
      eject: () => void 0,
      clear: () => void 0,
    },
  } as AxiosInstance['interceptors'];

  public defaults = { headers: {} } as AxiosInstance['defaults'];

  public constructor(private readonly certificate: ReadCertificateResponse) {}

  private parseRequestHeaders(headers?: Record<string, unknown>): string {
    if (!headers) return '';
    return Object.entries(headers)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(
        ([key, value]) =>
          `${key}: ${Array.isArray(value) ? value.join(', ') : String(value)}`,
      )
      .join(os.EOL);
  }

  private parseRequestBody(data?: unknown): Buffer {
    if (!data) return Buffer.from('');
    if (Buffer.isBuffer(data)) return data;
    if (typeof data === 'string') return Buffer.from(data, 'utf8');
    if (Array.isArray(data)) return Buffer.concat(data);
    return Buffer.from(JSON.stringify(data), 'utf8');
  }

  private parseResponseHeaders(headers?: string): Record<string, string> {
    if (!headers) return {};
    return headers.split('\r\n').reduce<Record<string, string>>((acc, line) => {
      if (!line.trim() || line.startsWith('HTTP/')) return acc;
      const [key, value] = line.split(':').map((s) => s.trim());
      acc[key] = value;
      return acc;
    }, {});
  }

  private parseResponseBody(body?: string | Buffer): string {
    if (!body) return '';
    if (Buffer.isBuffer(body)) return body.toString('utf8');
    return body;
  }

  public async request<T = unknown, R = AxiosResponse<T>, D = unknown>(
    config: AxiosRequestConfig<D>,
  ): Promise<R> {
    const url = config.url ?? '';
    const method = (config.method ?? 'GET').toUpperCase();

    const winHttpClient = addon<WinHttpClientAdapter>('winhttp_ssl_client');
    const { CN } = new ASN1().extractCertificateInfo(
      this.certificate.certificate,
    );

    const response = await winHttpClient.request(CN ?? '', method, url, {
      headers: this.parseRequestHeaders(config.headers),
      body: this.parseRequestBody(config.data),
      timeout: config.timeout,
    });

    const axiosResponse: AxiosResponse = {
      status: response.statusCode,
      data: this.parseResponseBody(response.body),
      statusText: this.getStatusText(response.statusCode),
      headers: this.parseResponseHeaders(response.headers),
      config: config as InternalAxiosRequestConfig<D>,
      request: {},
    };

    return axiosResponse as R;
  }

  public get<T = unknown, R = AxiosResponse<T>, D = unknown>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Promise<R> {
    return this.request({ ...config, method: 'GET', url });
  }

  public post<T = unknown, R = AxiosResponse<T>, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R> {
    return this.request({ ...config, method: 'POST', url, data });
  }

  public put<T = unknown, R = AxiosResponse<T>, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R> {
    return this.request({ ...config, method: 'PUT', url, data });
  }

  public patch<T = unknown, R = AxiosResponse<T>, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R> {
    return this.request({ ...config, method: 'PATCH', url, data });
  }

  public delete<T = unknown, R = AxiosResponse<T>, D = unknown>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Promise<R> {
    return this.request({ ...config, method: 'DELETE', url });
  }

  public head<T = unknown, R = AxiosResponse<T>, D = unknown>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Promise<R> {
    return this.request({ ...config, method: 'HEAD', url });
  }

  public options<T = unknown, R = AxiosResponse<T>, D = unknown>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Promise<R> {
    return this.request({ ...config, method: 'OPTIONS', url });
  }

  public getUri(config?: AxiosRequestConfig): string {
    if (!config?.url) return '';
    try {
      const url = new URL(config.url);
      return url.toString();
    } catch {
      return config.url;
    }
  }

  public static create(certificate: ReadCertificateResponse): AxiosInstance {
    const instance = new WinHttpClient(certificate);
    const request = instance.request.bind(instance);
    Object.setPrototypeOf(request, WinHttpClient.prototype);
    Object.assign(request, instance);
    return request as AxiosInstance;
  }

  private getStatusText(statusCode: number): string {
    const statusTexts: Record<number, string> = {
      200: 'OK',
      201: 'Created',
      202: 'Accepted',
      204: 'No Content',
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      500: 'Internal Server Error',
      502: 'Bad Gateway',
      503: 'Service Unavailable',
    };

    return statusTexts[statusCode] ?? 'Unknown';
  }
}
