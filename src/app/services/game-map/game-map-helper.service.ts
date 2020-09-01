import {Injectable} from '@angular/core';

import {GameMapTile} from '../../models/game-map/game-map';
import {Yield, YieldId} from '../../models/game-map/yield';
import {TerrainBaseId} from '../../models/game-map/terrain';

import {TERRAIN_BASE_DB, TERRAIN_FEATURE_DB, TERRAIN_RESOURCE_DB, TERRAIN_IMPROVEMENT_DB} from '../../consts/game-map/terrain-db.const';

@Injectable({providedIn: 'root'})
export class GameMapHelperService {

  public calcTileCssClasses(tile: GameMapTile): string[] {
    const cssClasses = [
      `m-x-${tile.coords.x}`,
      `m-y-${tile.coords.y}`,
    ];

    const base = TERRAIN_BASE_DB[tile.terrain.base.id];
    switch (base.id) {
      case TerrainBaseId.DESERT_HILLS:
      case TerrainBaseId.DESERT_MOUNTAIN:
      case TerrainBaseId.PLAINS_HILLS:
      case TerrainBaseId.PLAINS_MOUNTAIN:
      case TerrainBaseId.GRASSLAND_HILLS:
      case TerrainBaseId.GRASSLAND_MOUNTAIN:
      case TerrainBaseId.TUNDRA_HILLS:
      case TerrainBaseId.TUNDRA_MOUNTAIN:
      case TerrainBaseId.SNOW_HILLS:
      case TerrainBaseId.SNOW_MOUNTAIN:
        const cssClass = TERRAIN_BASE_DB[tile.terrain.base.id].ui.cssClass;
        const variation = tile.terrain.base.variation;
        cssClasses.push(cssClass + '-' + variation);
        break;
      default:
        cssClasses.push(base.ui.cssClass)
    }

    if (tile.terrain.feature.id) {
      const cssClass = TERRAIN_FEATURE_DB[tile.terrain.feature.id].ui.cssClass;
      const variation = tile.terrain.feature.variation;
      cssClasses.push(cssClass + '-' + variation);
    }

    if (tile.terrain.resourceId) {
      cssClasses.push(TERRAIN_RESOURCE_DB[tile.terrain.resourceId].ui.cssClass)
    }

    if (tile.terrain.improvementId) {
      cssClasses.push(TERRAIN_IMPROVEMENT_DB[tile.terrain.improvementId].ui.cssClass)
    }

    return cssClasses;
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

    const tileBaseYield = TERRAIN_BASE_DB[tile.terrain.base.id].yield;
    Object.keys(tileBaseYield).forEach(yieldId => {result[yieldId] += tileBaseYield[yieldId]});

    if (tile.terrain.feature.id) {
      const tileFeatureYield = TERRAIN_FEATURE_DB[tile.terrain.feature.id].yield;
      Object.keys(tileFeatureYield).forEach(yieldId => {result[yieldId] += tileFeatureYield[yieldId]});
    }

    if (tile.terrain.resourceId) {
      const tileResourceYield = TERRAIN_RESOURCE_DB[tile.terrain.resourceId].yield;
      Object.keys(tileResourceYield).forEach(yieldId => {result[yieldId] += tileResourceYield[yieldId]});
    }

    if (tile.terrain.improvementId) {
      const tileImprovementYield = TERRAIN_IMPROVEMENT_DB[tile.terrain.improvementId].yield;
      Object.keys(tileImprovementYield).forEach(yieldId => {result[yieldId] += tileImprovementYield[yieldId]});
    }

    return result;
  }

}
