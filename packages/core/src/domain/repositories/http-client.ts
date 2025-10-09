export type HeaderValue = string | string[] | number | boolean | null;
export type HttpClientHeaders = Record<string, HeaderValue>;

export type ResponseType = 'arraybuffer' | 'json';

export interface RequestConfig {
  headers?: HttpClientHeaders;
  responseType?: ResponseType;
}

export interface HttpResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: HttpClientHeaders;
}

export interface HttpClient {
  get<T = unknown, R = HttpResponse<T>>(
    url: string,
    config?: RequestConfig,
  ): Promise<R>;
}
