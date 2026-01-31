import ky, { type KyInstance, type Options as KyOptions } from 'ky';

import {
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
  OuraError,
  RateLimitError,
  ValidationError,
} from '../errors.js';

const BASE_URL = 'https://api.ouraring.com';
const SANDBOX_BASE_URL = 'https://api.ouraring.com';

export interface HttpClientOptions {
  accessToken: string;
  sandbox?: boolean;
}

export interface WebhookClientOptions {
  clientId: string;
  clientSecret: string;
}

export type DateRangeParams = {
  start_date?: string;
  end_date?: string;
  next_token?: string;
};

export type DateTimeRangeParams = {
  start_datetime?: string;
  end_datetime?: string;
  next_token?: string;
};

async function handleError(error: unknown): Promise<never> {
  if (error instanceof ky.HTTPError) {
    const response = error.response;
    const body = await response.json().catch(() => undefined);

    switch (response.status) {
      case 401: {
        throw new AuthenticationError('Invalid or expired access token', body);
      }
      case 403: {
        throw new ForbiddenError(undefined, body);
      }
      case 404: {
        throw new NotFoundError(undefined, body);
      }
      case 422: {
        throw new ValidationError('Request validation failed', body);
      }
      case 429: {
        const retryAfter = response.headers.get('retry-after');
        throw new RateLimitError('Rate limit exceeded', retryAfter ? Number.parseInt(retryAfter, 10) : undefined, body);
      }
      default: {
        throw new OuraError(`HTTP ${response.status}: ${response.statusText}`, response.status, body);
      }
    }
  }
  throw error;
}

export function createHttpClient(options: HttpClientOptions): KyInstance {
  const baseUrl = options.sandbox ? `${SANDBOX_BASE_URL}/v2/sandbox` : `${BASE_URL}/v2`;

  return ky.create({
    prefixUrl: baseUrl,
    headers: {
      Authorization: `Bearer ${options.accessToken}`,
    },
    hooks: {
      beforeError: [
        async (error) => {
          await handleError(error);
          return error;
        },
      ],
    },
  });
}

export function createWebhookClient(options: WebhookClientOptions): KyInstance {
  return ky.create({
    prefixUrl: `${BASE_URL}/v2`,
    headers: {
      'x-client-id': options.clientId,
      'x-client-secret': options.clientSecret,
    },
    hooks: {
      beforeError: [
        async (error) => {
          await handleError(error);
          return error;
        },
      ],
    },
  });
}

export async function get<T>(client: KyInstance, path: string, options?: KyOptions): Promise<T> {
  return client.get(path, options).json<T>();
}

export async function post<T>(client: KyInstance, path: string, body?: unknown): Promise<T> {
  return client.post(path, { json: body }).json<T>();
}

export async function put<T>(client: KyInstance, path: string, body?: unknown): Promise<T> {
  return client.put(path, { json: body }).json<T>();
}

export async function del(client: KyInstance, path: string): Promise<void> {
  await client.delete(path);
}
