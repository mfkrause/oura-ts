import type { DailyCardiovascularAge } from '../types.js';

import { DateRangeResource } from './base-resource.js';

export class DailyCardiovascularAgeResource extends DateRangeResource<DailyCardiovascularAge> {
  constructor(client: ConstructorParameters<typeof DateRangeResource>[0]) {
    super(client, 'usercollection/daily_cardiovascular_age');
  }
}
