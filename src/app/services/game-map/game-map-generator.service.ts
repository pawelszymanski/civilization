import {Injectable} from '@angular/core';

import {
  TerrainBaseId,
  TerrainFeatureId,
  TerrainImprovementId,
  TerrainResourceId
} from '../../models/game-map/terrain';

import {Coords} from '../../models/utils/coords';
import {GameMap, Tile} from '../../models/game-map/game-map';
import {MapGeneratorSettings} from '../../models/map-generator/map-generator-settings';

import {YieldHelperService} from './yield-helper.service';

@Injectable({providedIn: 'root'})
export class GameMapGeneratorService {

  constructor(
    private yieldHelperService: YieldHelperService
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

    tile.yield = this.yieldHelperService.calcTileYield(tile);

    return tile;
  }

  public generateNewGameMap(mapGeneratorSettings: MapGeneratorSettings): GameMap {
    const width = mapGeneratorSettings.width;
    const height = mapGeneratorSettings.height;

    const gameMap = {
      tiles: [],
      width,
      height
    }

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        gameMap.tiles.push(this.createEmptyOceanTile({x, y}))
      }
    }

    return gameMap;
  }

}
