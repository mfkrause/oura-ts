import type { RingConfiguration } from '../types.js';
import { DateRangeResource } from './base-resource.js';

export class RingConfigurationResource extends DateRangeResource<RingConfiguration> {
  constructor(client: ConstructorParameters<typeof DateRangeResource>[0]) {
    super(client, 'usercollection/ring_configuration');
  }
}
