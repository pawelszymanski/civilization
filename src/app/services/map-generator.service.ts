import {Injectable} from '@angular/core';

import {
  TerrainBaseId,
  TerrainFeatureId,
  TerrainImprovementId,
  TerrainResourceId
} from '../models/terrain';
import {Coords} from '../models/utils';
import {Map, Tile} from '../models/map';
import {MapGeneratorSettings} from '../models/map-generator';

import {YieldService} from './yield.service';

@Injectable({providedIn: 'root'})
export class MapGeneratorService {

  constructor(
    private yieldService: YieldService
  ) {}

  private createEmptyOceanTile(coords: Coords): Tile {
    const tile = {
      coords,
      terrain: {
        base: {id: TerrainBaseId.OCEAN, variation: 1},
        feature: {id: TerrainFeatureId.NONE, variation: null},
        resourceId: TerrainResourceId.NONE,
        improvementId: TerrainImprovementId.NONE,
      }
    } as unknown as Tile;

    tile.yield = this.yieldService.calcTileYield(tile);

    return tile;
  }

  public generateNewGameMap(mapGeneratorSettings: MapGeneratorSettings): Map {
    const width = mapGeneratorSettings.width;
    const height = mapGeneratorSettings.height;

    const map = {
      tiles: [],
      width,
      height
    }

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        map.tiles.push(this.createEmptyOceanTile({x, y}))
      }
    }

    return map;
  }

}
