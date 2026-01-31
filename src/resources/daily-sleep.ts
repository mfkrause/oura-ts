import type { DailySleep } from '../types.js';
import { DateRangeResource } from './base-resource.js';

export class DailySleepResource extends DateRangeResource<DailySleep> {
  constructor(client: ConstructorParameters<typeof DateRangeResource>[0]) {
    super(client, 'usercollection/daily_sleep');
  }
}
