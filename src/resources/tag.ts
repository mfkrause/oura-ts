import type { Tag } from '../types.js';
import { DateRangeResource } from './base-resource.js';

export class TagResource extends DateRangeResource<Tag> {
  constructor(client: ConstructorParameters<typeof DateRangeResource>[0]) {
    super(client, 'usercollection/tag');
  }
}
