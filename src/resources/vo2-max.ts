import type { VO2Max } from '../types.js';

import { DateRangeResource } from './base-resource.js';

export class VO2MaxResource extends DateRangeResource<VO2Max> {
  constructor(client: ConstructorParameters<typeof DateRangeResource>[0]) {
    super(client, 'usercollection/vo2_max');
  }
}
