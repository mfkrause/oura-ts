import type { RestModePeriod } from '../types.js';
import { DateRangeResource } from './base-resource.js';

export class RestModePeriodResource extends DateRangeResource<RestModePeriod> {
  constructor(client: ConstructorParameters<typeof DateRangeResource>[0]) {
    super(client, 'usercollection/rest_mode_period');
  }
}
