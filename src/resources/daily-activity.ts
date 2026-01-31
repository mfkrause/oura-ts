import type { DailyActivity } from '../types.js';
import { DateRangeResource } from './base-resource.js';

export class DailyActivityResource extends DateRangeResource<DailyActivity> {
  constructor(client: ConstructorParameters<typeof DateRangeResource>[0]) {
    super(client, 'usercollection/daily_activity');
  }
}
