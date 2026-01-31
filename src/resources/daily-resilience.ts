import type { DailyResilience } from '../types.js';
import { DateRangeResource } from './base-resource.js';

export class DailyResilienceResource extends DateRangeResource<DailyResilience> {
  constructor(client: ConstructorParameters<typeof DateRangeResource>[0]) {
    super(client, 'usercollection/daily_resilience');
  }
}
