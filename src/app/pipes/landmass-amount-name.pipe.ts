import { Pipe, PipeTransform } from '@angular/core';

import { LandmassAmountId } from '../models/map-generator';

const LANDMASS_AMOUNT_NAMES = new Map<LandmassAmountId, string>([
  [LandmassAmountId.LEAST, 'Least'],
  [LandmassAmountId.LESS, 'Less'],
  [LandmassAmountId.STANDARD, 'Standard'],
  [LandmassAmountId.MORE, 'More'],
  [LandmassAmountId.MOST, 'Most'],
]);

@Pipe({ standalone: false, name: 'landmassAmountName' })
export class LandmassAmountNamePipe implements PipeTransform {
  transform(landmassAmountId: LandmassAmountId): string {
    return LANDMASS_AMOUNT_NAMES.get(Number(landmassAmountId)) ?? '';
  }
}
