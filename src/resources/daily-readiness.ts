import type { DailyReadiness } from '../types.js';

import { DateRangeResource } from './base-resource.js';

export class DailyReadinessResource extends DateRangeResource<DailyReadiness> {
  constructor(client: ConstructorParameters<typeof DateRangeResource>[0]) {
    super(client, 'usercollection/daily_readiness');
  }
}
