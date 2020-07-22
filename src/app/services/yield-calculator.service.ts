import {Injectable} from '@angular/core';

import {BoardTile} from '../models/board';
import {Yield, YieldId} from '../models/yield';

import {TERRAIN_BASE_YIELD, TERRAIN_FEATURE_YIELD} from '../consts/terrain-yield.const';

@Injectable({providedIn: 'root'})
export class YieldCalculatorService {

  public calculateTileYield(tile: BoardTile): Yield {
    const result = {
      [YieldId.FOOD]: 0,
      [YieldId.PRODUCTION]: 0,
      [YieldId.GOLD]: 0,
      [YieldId.SCIENCE]: 0,
      [YieldId.CULTURE]: 0,
      [YieldId.RELIGION]: 0,
      [YieldId.POWER]: 0,
      [YieldId.TOURISM]: 0
    };

    const tileBaseYield = TERRAIN_BASE_YIELD[tile.terrain.base];
    Object.keys(tileBaseYield).forEach(yieldId => {result[yieldId] += tileBaseYield[yieldId]});

    const tileFeatureYield = TERRAIN_FEATURE_YIELD[tile.terrain.feature];
    Object.keys(tileFeatureYield).forEach(yieldId => {result[yieldId] += tileFeatureYield[yieldId]});

    return result;
  }

}
