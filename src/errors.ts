export class OuraError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly body?: unknown
  ) {
    super(message);
    this.name = 'OuraError';
  }
}

export class AuthenticationError extends OuraError {
  constructor(message = 'Authentication failed', body?: unknown) {
    super(message, 401, body);
    this.name = 'AuthenticationError';
  }
}

export class ForbiddenError extends OuraError {
  constructor(message = 'Access forbidden. User subscription may have expired.', body?: unknown) {
    super(message, 403, body);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends OuraError {
  constructor(message = 'Resource not found', body?: unknown) {
    super(message, 404, body);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends OuraError {
  constructor(message = 'Validation failed', body?: unknown) {
    super(message, 422, body);
    this.name = 'ValidationError';
  }
}

export class RateLimitError extends OuraError {
  public readonly retryAfter?: number;

  constructor(message = 'Rate limit exceeded', retryAfter?: number, body?: unknown) {
    super(message, 429, body);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}
