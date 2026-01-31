import type { SleepTime } from '../types.js';

import { DateRangeResource } from './base-resource.js';

export class SleepTimeResource extends DateRangeResource<SleepTime> {
  constructor(client: ConstructorParameters<typeof DateRangeResource>[0]) {
    super(client, 'usercollection/sleep_time');
  }
}
