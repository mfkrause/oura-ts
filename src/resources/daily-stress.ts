import type { DailyStress } from '../types.js';

import { DateRangeResource } from './base-resource.js';

export class DailyStressResource extends DateRangeResource<DailyStress> {
  constructor(client: ConstructorParameters<typeof DateRangeResource>[0]) {
    super(client, 'usercollection/daily_stress');
  }
}
