import {Injectable} from '@angular/core';

import {GameMapTile} from '../../models/game-map/game-map';
import {Yield, YieldId} from '../../models/game-map/yield';

import {TERRAIN_BASE_YIELD, TERRAIN_FEATURE_YIELD, TERRAIN_RESOURCE_YIELD, TERRAIN_IMPROVEMENT_YIELD} from '../../consts/game-map/terrain-yield.const';
import {TERRAIN_BASE_ID_TO_CSS_CLASS_MAP} from '../../consts/game-map/terrain-base-id-to-css-class-map.const';
import {TERRAIN_FEATURE_ID_TO_CSS_CLASS_MAP} from '../../consts/game-map/terrain-feature-id-to-css-class-map.const';
import {TERRAIN_RESOURCE_ID_TO_CSS_CLASS_MAP} from '../../consts/game-map/terrain-resource-id-to-css-class-map.const';
import {TERRAIN_IMPROVEMENT_ID_TO_CSS_CLASS_MAP} from '../../consts/game-map/terrain-improvement-id-to-css-class-map.const';

@Injectable({providedIn: 'root'})
export class GameMapHelperService {

  public calcTileCssClasses(tile: GameMapTile): string[] {
    return [
      TERRAIN_BASE_ID_TO_CSS_CLASS_MAP[tile.terrain.base],
      TERRAIN_FEATURE_ID_TO_CSS_CLASS_MAP[tile.terrain.feature],
      TERRAIN_RESOURCE_ID_TO_CSS_CLASS_MAP[tile.terrain.resource],
      TERRAIN_IMPROVEMENT_ID_TO_CSS_CLASS_MAP[tile.terrain.resource],
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

    const tileBaseYield = TERRAIN_BASE_YIELD[tile.terrain.base];
    Object.keys(tileBaseYield).forEach(yieldId => {result[yieldId] += tileBaseYield[yieldId]});

    if (tile.terrain.feature) {
      const tileFeatureYield = TERRAIN_FEATURE_YIELD[tile.terrain.feature];
      Object.keys(tileFeatureYield).forEach(yieldId => {result[yieldId] += tileFeatureYield[yieldId]});
    }

    if (tile.terrain.resource) {
      const tileResourceYield = TERRAIN_RESOURCE_YIELD[tile.terrain.resource];
      Object.keys(tileResourceYield).forEach(yieldId => {result[yieldId] += tileResourceYield[yieldId]});
    }

    if (tile.terrain.improvement) {
      const tileImprovementYield = TERRAIN_IMPROVEMENT_YIELD[tile.terrain.improvement];
      Object.keys(tileImprovementYield).forEach(yieldId => {result[yieldId] += tileImprovementYield[yieldId]});
    }

    return result;
  }

}
