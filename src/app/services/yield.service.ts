import {Injectable} from '@angular/core';

import {Tile} from '../models/map';
import {Yield, YieldId} from '../models/yield';

import {TERRAIN_BASE_SET, TERRAIN_FEATURE_SET, TERRAIN_RESOURCE_SET, TERRAIN_IMPROVEMENT_SET} from '../consts/terrain.const';

@Injectable({providedIn: 'root'})
export class YieldService {

  public calcTileYield(tile: Tile): Yield {
    const result = {
      [YieldId.FOOD]: 0,
      [YieldId.PRODUCTION]: 0,
      [YieldId.GOLD]: 0,
      [YieldId.SCIENCE]: 0,
      [YieldId.CULTURE]: 0,
      [YieldId.FAITH]: 0,
      [YieldId.POWER]: 0,
      [YieldId.TOURISM]: 0
    };

    const tileBaseYield = TERRAIN_BASE_SET[tile.terrain.base.id].yield;
    Object.keys(tileBaseYield).forEach(yieldId => {result[yieldId] += tileBaseYield[yieldId]});

    if (tile.terrain.feature.id) {
      const tileFeatureYield = TERRAIN_FEATURE_SET[tile.terrain.feature.id].yield;
      Object.keys(tileFeatureYield).forEach(yieldId => {result[yieldId] += tileFeatureYield[yieldId]});
    }

    if (tile.terrain.resourceId) {
      const tileResourceYield = TERRAIN_RESOURCE_SET[tile.terrain.resourceId].yield;
      Object.keys(tileResourceYield).forEach(yieldId => {result[yieldId] += tileResourceYield[yieldId]});
    }

    if (tile.terrain.improvementId) {
      const tileImprovementYield = TERRAIN_IMPROVEMENT_SET[tile.terrain.improvementId].yield;
      Object.keys(tileImprovementYield).forEach(yieldId => {result[yieldId] += tileImprovementYield[yieldId]});
    }

    return result;
  }

}
