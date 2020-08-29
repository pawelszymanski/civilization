import {Injectable} from '@angular/core';

import {TerrainBaseId, TerrainFeatureId, TerrainImprovementId, TerrainResourceId} from '../../models/game-map/terrain';

import {GameMap, GameMapRow, GameMapTile} from '../../models/game-map/game-map';
import {MapGeneratorSettings} from '../../models/map-generator/map-generator-settings';

import {GameMapHelperService} from './game-map-helper.service';

@Injectable({providedIn: 'root'})
export class GameMapGeneratorService {

  constructor(
    private gameMapHelperService: GameMapHelperService
  ) {}

  private createGameMapTile(x: number, y: number): GameMapTile {
    const tile = {
      coords: {
        x,
        y
      },
      terrain: {
        base: TerrainBaseId.OCEAN,
        feature: TerrainFeatureId.NONE,
        resource: TerrainResourceId.NONE,
        improvement: TerrainImprovementId.NONE
      }
    } as GameMapTile;

    tile.cssClasses = this.gameMapHelperService.calcTileCssClasses(tile);
    tile.yield = this.gameMapHelperService.calcTileYield(tile);

    return tile;
  }

  private createGameMapRow(rowId: number, width: number): GameMapRow {
    return {tiles: [...Array(width).keys()].map(x => this.createGameMapTile(x, rowId))}
  }

  private createGameMap(params: MapGeneratorSettings): GameMap {
    return {rows: [...Array(params.height).keys()].map(y => this.createGameMapRow(y, params.width))}
  }

  public generateNewGameMap(params: MapGeneratorSettings): GameMap {
    const gameMap = this.createGameMap(params);
    return gameMap;
  }

}
