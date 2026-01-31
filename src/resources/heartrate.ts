import type { HeartRate } from '../types.js';
import { DateTimeRangeResource } from './base-resource.js';

export class HeartRateResource extends DateTimeRangeResource<HeartRate> {
  constructor(client: ConstructorParameters<typeof DateTimeRangeResource>[0]) {
    super(client, 'usercollection/heartrate');
  }
}
