import {
  DEFAULT_BASE_URL,
  DEFAULT_RETRIES,
  DEFAULT_TIMEOUT_MS,
  SDK_NAME,
  SDK_VERSION,
} from './version.js';
import {
  HadidyError,
  NetworkError,
  RateLimitError,
  TimeoutError,
  mapStatusToError,
} from './errors.js';
import { validateApiKey } from './validation.js';

export interface RequestOptions {
  method?: string | undefined;
  path: string;
  query?: Record<string, string | number | boolean | undefined | null> | undefined;
  body?: unknown;
  formData?: FormData | undefined;
  headers?: Record<string, string> | undefined;
  signal?: AbortSignal | undefined;
  retries?: number | undefined;
}

export interface HttpClientOptions {
  apiKey: string;
  baseUrl?: string;
  /** Request timeout in milliseconds. Default: 30 000. */
  timeoutMs?: number;
  retries?: number;
  fetch?: typeof globalThis.fetch;
}

export class HttpClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly retries: number;
  private readonly fetchFn: typeof globalThis.fetch;

  constructor(opts: HttpClientOptions) {
    validateApiKey(opts.apiKey);
    this.apiKey = opts.apiKey;
    this.baseUrl = (opts.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, '');
    this.timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.retries = opts.retries ?? DEFAULT_RETRIES;
    this.fetchFn = opts.fetch ?? globalThis.fetch;
  }

  async request<T>(opts: RequestOptions): Promise<T> {
    const url = this.buildUrl(opts.path, opts.query);
    const headers = this.buildHeaders(opts.headers);
    const maxAttempts = 1 + (opts.retries ?? this.retries);

    let lastError: HadidyError = new HadidyError({
      message: 'Unknown error',
      code: 'unknown',
    });

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      if (attempt > 0) {
        await this.sleep(this.backoffMs(attempt));
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

      const signal = opts.signal
        ? AbortSignal.any([opts.signal, controller.signal])
        : controller.signal;

      try {
        const init: RequestInit = {
          method: opts.method ?? (opts.body || opts.formData ? 'POST' : 'GET'),
          headers,
          signal,
        };

        if (opts.formData) {
          init.body = opts.formData;
          (headers as Record<string, string>)['Content-Type'] && delete (headers as Record<string, string>)['Content-Type'];
        } else if (opts.body !== undefined) {
          init.body = JSON.stringify(opts.body);
        }

        const response = await this.fetchFn(url, init);
        clearTimeout(timeoutId);

        const requestId = response.headers.get('x-request-id') ?? undefined;

        if (response.ok) {
          if (response.status === 204 || response.headers.get('content-length') === '0') {
            return undefined as T;
          }
          return (await response.json()) as T;
        }

        let errorBody: { detail?: string; message?: string; errors?: Record<string, string[]> } = {};
        try {
          errorBody = (await response.json()) as typeof errorBody;
        } catch {
        }

        const err = mapStatusToError(response.status, errorBody, requestId);

        if (this.shouldRetry(response.status, attempt, maxAttempts)) {
          if (response.status === 429) {
            const retryAfter = response.headers.get('retry-after');
            if (retryAfter) {
              await this.sleep(parseInt(retryAfter, 10) * 1000);
            }
          }
          lastError = err;
          continue;
        }

        throw err;
      } catch (err) {
        clearTimeout(timeoutId);

        if (err instanceof HadidyError) {
          if (this.shouldRetry(err.status ?? 0, attempt, maxAttempts)) {
            lastError = err;
            continue;
          }
          throw err;
        }

        if (err instanceof Error && err.name === 'AbortError') {
          if (opts.signal?.aborted) throw err;
          throw new TimeoutError(this.timeoutMs);
        }

        const networkErr = new NetworkError(
          `Network request failed: ${err instanceof Error ? err.message : String(err)}`,
          err instanceof Error ? err : undefined,
        );

        if (attempt < maxAttempts - 1) {
          lastError = networkErr;
          continue;
        }

        throw networkErr;
      }
    }

    throw lastError;
  }

  async get<T>(path: string, query?: RequestOptions['query']): Promise<T> {
    return this.request<T>({ method: 'GET', path, query });
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>({ method: 'POST', path, body });
  }

  async postForm<T>(path: string, formData: FormData): Promise<T> {
    return this.request<T>({ method: 'POST', path, formData });
  }

  async put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>({ method: 'PUT', path, body });
  }

  async patch<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>({ method: 'PATCH', path, body });
  }

  async delete<T>(path: string): Promise<T> {
    return this.request<T>({ method: 'DELETE', path });
  }

  private buildUrl(path: string, query?: RequestOptions['query']): string {
    const url = new URL(`${this.baseUrl}${path}`);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      }
    }
    return url.toString();
  }

  private buildHeaders(extra?: Record<string, string>): Record<string, string> {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'User-Agent': `${SDK_NAME}/${SDK_VERSION}`,
      ...extra,
    };
  }

  private shouldRetry(status: number, attempt: number, maxAttempts: number): boolean {
    if (attempt >= maxAttempts - 1) return false;
    return status === 429 || status >= 500;
  }

  private backoffMs(attempt: number): number {
    return Math.min(1000 * 2 ** (attempt - 1), 8000);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
