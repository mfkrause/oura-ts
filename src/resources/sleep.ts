import type { Sleep } from '../types.js';

import { DateRangeResource } from './base-resource.js';

export class SleepResource extends DateRangeResource<Sleep> {
  constructor(client: ConstructorParameters<typeof DateRangeResource>[0]) {
    super(client, 'usercollection/sleep');
  }
}
