import {Injectable} from '@angular/core';

import {GameMapTile} from '../../models/game-map/game-map';
import {Yield, YieldId} from '../../models/game-map/yield';
import {TerrainBaseId, TerrainUi} from '../../models/game-map/terrain';

import {TERRAIN_BASE_DB, TERRAIN_FEATURE_DB, TERRAIN_RESOURCE_DB, TERRAIN_IMPROVEMENT_DB} from '../../consts/game-map/terrain-db.const';

@Injectable({providedIn: 'root'})
export class GameMapHelperService {

  private normalizedCssClass(ui: TerrainUi): string {
    return`${ui.cssClassBase}-${(ui.cssVariation || 0) + 1}`;
  }

  public calcTileCssClasses(tile: GameMapTile): string[] {
    const cssClasses = [
      `m-x-${tile.coords.x}`,
      `m-y-${tile.coords.y}`,
    ];

    const base = TERRAIN_BASE_DB[tile.terrain.base];
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
        cssClasses.push(this.normalizedCssClass(base.ui));
        break;
      default:
        cssClasses.push(base.ui.cssClassBase)
    }

    const feature = TERRAIN_FEATURE_DB[tile.terrain.feature];
    if (feature) { cssClasses.push(this.normalizedCssClass(feature.ui)) }

    const resource = TERRAIN_RESOURCE_DB[tile.terrain.resource];
    if (resource) { cssClasses.push(resource.ui.cssClassBase) }

    const improvement = TERRAIN_IMPROVEMENT_DB[tile.terrain.improvement];
    if (improvement) { cssClasses.push(this.normalizedCssClass(improvement.ui)) }

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
