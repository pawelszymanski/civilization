import {Injectable} from '@angular/core';

import {GameMapTile} from '../../models/game-map/game-map';
import {Yield, YieldId} from '../../models/game-map/yield';

import {TERRAIN_BASE_DB, TERRAIN_FEATURE_DB, TERRAIN_RESOURCE_DB, TERRAIN_IMPROVEMENT_DB} from '../../consts/game-map/terrain-db.const';

@Injectable({providedIn: 'root'})
export class GameMapHelperService {

  public calcTileCssClasses(tile: GameMapTile): string[] {
    return [
      TERRAIN_BASE_DB[tile.terrain.base].cssClass,
      TERRAIN_FEATURE_DB[tile.terrain.feature].cssClass,
      TERRAIN_RESOURCE_DB[tile.terrain.resource].cssClass,
      TERRAIN_IMPROVEMENT_DB[tile.terrain.resource].cssClass,
      `m-x-${tile.coords.x}`,
      `m-y-${tile.coords.y}`
    ];
  }

  public calcTileYield(tile: GameMapTile): Yield {
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

    const tileBaseYield = TERRAIN_BASE_DB[tile.terrain.base].yield;
    Object.keys(tileBaseYield).forEach(yieldId => {result[yieldId] += tileBaseYield[yieldId]});

    if (tile.terrain.feature) {
      const tileFeatureYield = TERRAIN_FEATURE_DB[tile.terrain.feature].yield;
      Object.keys(tileFeatureYield).forEach(yieldId => {result[yieldId] += tileFeatureYield[yieldId]});
    }

    if (tile.terrain.resource) {
      const tileResourceYield = TERRAIN_RESOURCE_DB[tile.terrain.resource].yield;
      Object.keys(tileResourceYield).forEach(yieldId => {result[yieldId] += tileResourceYield[yieldId]});
    }

    if (tile.terrain.improvement) {
      const tileImprovementYield = TERRAIN_IMPROVEMENT_DB[tile.terrain.improvement].yield;
      Object.keys(tileImprovementYield).forEach(yieldId => {result[yieldId] += tileImprovementYield[yieldId]});
    }

    return result;
  }

}
