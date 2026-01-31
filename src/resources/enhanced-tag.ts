import type { EnhancedTag } from '../types.js';

import { DateRangeResource } from './base-resource.js';

export class EnhancedTagResource extends DateRangeResource<EnhancedTag> {
  constructor(client: ConstructorParameters<typeof DateRangeResource>[0]) {
    super(client, 'usercollection/enhanced_tag');
  }
}
