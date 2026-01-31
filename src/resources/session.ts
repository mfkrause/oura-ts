import type { Session } from '../types.js';
import { DateRangeResource } from './base-resource.js';

export class SessionResource extends DateRangeResource<Session> {
  constructor(client: ConstructorParameters<typeof DateRangeResource>[0]) {
    super(client, 'usercollection/session');
  }
}
