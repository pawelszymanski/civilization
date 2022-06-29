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

import {TileYieldService} from './tile-yield.service';

@Injectable({providedIn: 'root'})
export class MapGeneratorService {

  constructor(
    private tileYieldService: TileYieldService
  ) {}

  private createEmptyOceanTile(grid: Coords): Tile {
    const tile = {
      grid,
      terrain: {
        base: {id: TerrainBaseId.OCEAN, variation: 1},
        feature: {id: TerrainFeatureId.NONE, variation: null},
        resourceId: TerrainResourceId.NONE,
        improvementId: TerrainImprovementId.NONE,
      }
    } as unknown as Tile;

    this.tileYieldService.updateTileYield(tile);

    return tile;
  }

  public generateNewGameMap(mapGeneratorSettings: MapGeneratorSettings): Map {
    const width = mapGeneratorSettings.width;
    const height = mapGeneratorSettings.height;

    const map = {
      tiles: [],
      width,
      height
    };

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        map.tiles.push(this.createEmptyOceanTile({x, y}));
      }
    }

    return map;
  }

}
