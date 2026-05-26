import { Pipe, PipeTransform } from '@angular/core';

import { WorldAgeId } from '../models/map-generator';

const WORLD_AGE_NAMES = new Map<WorldAgeId, string>([
  [WorldAgeId.NEW, 'New'],
  [WorldAgeId.STANDARD, 'Standard'],
  [WorldAgeId.OLD, 'Old'],
]);

@Pipe({ standalone: false, name: 'worldAgeName' })
export class WorldAgeNamePipe implements PipeTransform {
  transform(worldAgeId: WorldAgeId): string {
    return WORLD_AGE_NAMES.get(Number(worldAgeId)) ?? '';
  }
}
