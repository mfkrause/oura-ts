import type { PersonalInfo } from '../types.js';

import { SingleDocumentResource } from './base-resource.js';

export class PersonalInfoResource extends SingleDocumentResource<PersonalInfo> {
  constructor(client: ConstructorParameters<typeof SingleDocumentResource>[0]) {
    super(client, 'usercollection/personal_info');
  }
}
