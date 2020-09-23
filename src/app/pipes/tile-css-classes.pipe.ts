import {Pipe, PipeTransform} from '@angular/core';

import {Tile} from '../models/map';
import {TerrainBaseId} from '../models/terrain';

import {
  TERRAIN_BASE_SET,
  TERRAIN_FEATURE_SET,
  TERRAIN_IMPROVEMENT_SET,
  TERRAIN_RESOURCE_SET
} from '../consts/terrain.const';

@Pipe({name: 'tileCssClasses'})
export class TileCssClassesPipe implements PipeTransform {

  transform(tile: Tile): string[] {
    console.info('css classes pipe');

    const result = [
      `m-x-${tile.coords.x}`,
      `m-y-${tile.coords.y}`,
    ];

    if (tile.coords.y % 2 === 1) {
      result.push('m-indent');
    }

    const base = TERRAIN_BASE_SET[tile.terrain.base.id];
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
        const cssClass = TERRAIN_BASE_SET[tile.terrain.base.id].ui.class;
        const variation = tile.terrain.base.uiVariant;
        result.push(cssClass + '-' + variation);
        break;
      default:
        result.push(base.ui.class)
    }

    if (tile.terrain.feature.id) {
      const cssClass = TERRAIN_FEATURE_SET[tile.terrain.feature.id].ui.class;
      const variation = tile.terrain.feature.uiVariant;
      result.push(cssClass + '-' + variation);
    }

    if (tile.terrain.resourceId) {
      result.push(TERRAIN_RESOURCE_SET[tile.terrain.resourceId].ui.class)
    }

    if (tile.terrain.improvementId) {
      result.push(TERRAIN_IMPROVEMENT_SET[tile.terrain.improvementId].ui.class)
    }

    return result;
  }

}
