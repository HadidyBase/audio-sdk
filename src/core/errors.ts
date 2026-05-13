export type ErrorCode =
  | 'authentication_error'
  | 'forbidden'
  | 'not_found'
  | 'validation_error'
  | 'rate_limit_exceeded'
  | 'server_error'
  | 'network_error'
  | 'timeout'
  | 'unknown';

export interface HadidyErrorOptions {
  message: string;
  code: ErrorCode;
  status?: number;
  requestId?: string;
  details?: Record<string, unknown>;
}

export class HadidyError extends Error {
  readonly code: ErrorCode;
  readonly status: number | undefined;
  readonly requestId: string | undefined;
  readonly details: Record<string, unknown> | undefined;

  constructor(opts: HadidyErrorOptions) {
    super(opts.message);
    this.name = 'HadidyError';
    this.code = opts.code;
    this.status = opts.status;
    this.requestId = opts.requestId;
    this.details = opts.details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class AuthenticationError extends HadidyError {
  constructor(message: string, requestId?: string) {
    super({ message, code: 'authentication_error', status: 401, requestId });
    this.name = 'AuthenticationError';
  }
}

export class ForbiddenError extends HadidyError {
  constructor(message: string, requestId?: string, details?: Record<string, unknown>) {
    super({ message, code: 'forbidden', status: 403, requestId, details });
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends HadidyError {
  constructor(message: string, requestId?: string) {
    super({ message, code: 'not_found', status: 404, requestId });
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends HadidyError {
  readonly fields: Record<string, string[]>;

  constructor(message: string, fields: Record<string, string[]> = {}, requestId?: string) {
    super({ message, code: 'validation_error', status: 422, requestId, details: { fields } });
    this.name = 'ValidationError';
    this.fields = fields;
  }
}

export class RateLimitError extends HadidyError {
  readonly retryAfter: number | undefined;

  constructor(message: string, retryAfter?: number, requestId?: string) {
    super({ message, code: 'rate_limit_exceeded', status: 429, requestId });
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

export class ServerError extends HadidyError {
  constructor(message: string, status = 500, requestId?: string) {
    super({ message, code: 'server_error', status, requestId });
    this.name = 'ServerError';
  }
}

export class NetworkError extends HadidyError {
  constructor(message: string, cause?: Error) {
    super({ message, code: 'network_error', details: cause ? { cause: cause.message } : undefined });
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends HadidyError {
  constructor(timeoutMs: number) {
    super({ message: `Request timed out after ${timeoutMs}ms`, code: 'timeout' });
    this.name = 'TimeoutError';
  }
}

export function mapStatusToError(
  status: number,
  body: { detail?: string; message?: string; errors?: Record<string, string[]> },
  requestId?: string,
): HadidyError {
  const msg = body.detail ?? body.message ?? 'An unexpected error occurred';

  switch (status) {
    case 401:
      return new AuthenticationError(msg, requestId);
    case 403:
      return new ForbiddenError(msg, requestId);
    case 404:
      return new NotFoundError(msg, requestId);
    case 422:
      return new ValidationError(msg, body.errors ?? {}, requestId);
    case 429:
      return new RateLimitError(msg, undefined, requestId);
    default:
      if (status >= 500) return new ServerError(msg, status, requestId);
      return new HadidyError({ message: msg, code: 'unknown', status, requestId });
  }
}
