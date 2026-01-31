import type { KyInstance } from 'ky';

import { get } from '../client/http.js';
import {
  type DateRangeOptions,
  type DateTimeRangeOptions,
  type PaginatedIterator,
  paginateDateRange,
  paginateDateTimeRange,
} from '../client/pagination.js';

export abstract class DateRangeResource<T> {
  constructor(
    protected readonly client: KyInstance,
    protected readonly basePath: string
  ) {}

  list(options: DateRangeOptions = {}): PaginatedIterator<T> {
    return paginateDateRange<T>(this.client, this.basePath, options);
  }

  async get(id: string): Promise<T> {
    return get<T>(this.client, `${this.basePath}/${id}`);
  }
}

export abstract class DateTimeRangeResource<T> {
  constructor(
    protected readonly client: KyInstance,
    protected readonly basePath: string
  ) {}

  list(options: DateTimeRangeOptions = {}): PaginatedIterator<T> {
    return paginateDateTimeRange<T>(this.client, this.basePath, options);
  }
}

export abstract class SingleDocumentResource<T> {
  constructor(
    protected readonly client: KyInstance,
    protected readonly basePath: string
  ) {}

  async get(): Promise<T> {
    return get<T>(this.client, this.basePath);
  }
}
