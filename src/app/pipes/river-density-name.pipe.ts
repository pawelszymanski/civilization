import { Pipe, PipeTransform } from '@angular/core';

import { RiverDensityId } from '../models/map-generator';

const RIVER_DENSITY_NAMES = new Map<RiverDensityId, string>([
  [RiverDensityId.NONE, 'None'],
  [RiverDensityId.MINIMAL, 'Minimal'],
  [RiverDensityId.STANDARD, 'Standard'],
  [RiverDensityId.ABUNDANT, 'Abundant'],
]);

@Pipe({ standalone: false, name: 'riverDensityName' })
export class RiverDensityNamePipe implements PipeTransform {
  transform(riverDensityId: RiverDensityId): string {
    return RIVER_DENSITY_NAMES.get(Number(riverDensityId)) ?? '';
  }
}
