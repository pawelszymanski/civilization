import { Pipe, PipeTransform } from '@angular/core';

import { TemperatureId } from '../models/map-generator';

const TEMPERATURE_NAMES = new Map<TemperatureId, string>([
  [TemperatureId.HOT, 'Hot'],
  [TemperatureId.STANDARD, 'Standard'],
  [TemperatureId.COLD, 'Cold'],
]);

@Pipe({ standalone: false, name: 'temperatureName' })
export class TemperatureNamePipe implements PipeTransform {
  transform(temperatureId: TemperatureId): string {
    return TEMPERATURE_NAMES.get(Number(temperatureId)) ?? '';
  }
}
