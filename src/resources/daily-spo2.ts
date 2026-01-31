import type { DailySpO2 } from '../types.js';

import { DateRangeResource } from './base-resource.js';

export class DailySpO2Resource extends DateRangeResource<DailySpO2> {
  constructor(client: ConstructorParameters<typeof DateRangeResource>[0]) {
    super(client, 'usercollection/daily_spo2');
  }
}
