import { Pipe, PipeTransform } from '@angular/core';

import { RainfallId } from '../models/map-generator';

const RAINFALL_NAMES = new Map<RainfallId, string>([
  [RainfallId.DRY, 'Dry'],
  [RainfallId.STANDARD, 'Standard'],
  [RainfallId.WET, 'Wet'],
]);

@Pipe({ standalone: false, name: 'rainfallName' })
export class RainfallNamePipe implements PipeTransform {
  transform(rainfallId: RainfallId): string {
    return RAINFALL_NAMES.get(Number(rainfallId)) ?? '';
  }
}
