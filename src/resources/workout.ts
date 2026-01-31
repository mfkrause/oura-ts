import type { Workout } from '../types.js';
import { DateRangeResource } from './base-resource.js';

export class WorkoutResource extends DateRangeResource<Workout> {
  constructor(client: ConstructorParameters<typeof DateRangeResource>[0]) {
    super(client, 'usercollection/workout');
  }
}
