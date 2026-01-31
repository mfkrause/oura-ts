import type { KyInstance } from 'ky';

import { get } from './http.js';

export interface PaginatedResponse<T> {
  data: T[];
  next_token: string | null;
}

export interface PaginatedIterator<T> extends AsyncIterable<T> {
  all(): Promise<T[]>;
}

export interface DateRangeOptions {
  startDate?: string;
  endDate?: string;
}

export interface DateTimeRangeOptions {
  startDatetime?: string;
  endDatetime?: string;
}

type FetchPage<T> = (nextToken?: string) => Promise<PaginatedResponse<T>>;

function createPaginatedIterator<T>(fetchPage: FetchPage<T>): PaginatedIterator<T> {
  const iterator: PaginatedIterator<T> = {
    async *[Symbol.asyncIterator]() {
      let nextToken: string | undefined;

      do {
        const response = await fetchPage(nextToken);
        for (const item of response.data) {
          yield item;
        }
        nextToken = response.next_token ?? undefined;
      } while (nextToken);
    },

    async all(): Promise<T[]> {
      const items: T[] = [];
      for await (const item of iterator) {
        items.push(item);
      }
      return items;
    },
  };

  return iterator;
}

export function paginateDateRange<T>(
  client: KyInstance,
  path: string,
  options: DateRangeOptions = {}
): PaginatedIterator<T> {
  return createPaginatedIterator(async (nextToken) => {
    const searchParams: Record<string, string> = {};

    if (options.startDate) {
      searchParams['start_date'] = options.startDate;
    }
    if (options.endDate) {
      searchParams['end_date'] = options.endDate;
    }
    if (nextToken) {
      searchParams['next_token'] = nextToken;
    }

    return get<PaginatedResponse<T>>(client, path, { searchParams });
  });
}

export function paginateDateTimeRange<T>(
  client: KyInstance,
  path: string,
  options: DateTimeRangeOptions = {}
): PaginatedIterator<T> {
  return createPaginatedIterator(async (nextToken) => {
    const searchParams: Record<string, string> = {};

    if (options.startDatetime) {
      searchParams['start_datetime'] = options.startDatetime;
    }
    if (options.endDatetime) {
      searchParams['end_datetime'] = options.endDatetime;
    }
    if (nextToken) {
      searchParams['next_token'] = nextToken;
    }

    return get<PaginatedResponse<T>>(client, path, { searchParams });
  });
}
