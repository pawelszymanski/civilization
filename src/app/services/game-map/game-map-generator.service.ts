import {Injectable} from '@angular/core';

import {TerrainBaseId, TerrainFeatureId, TerrainImprovementId, TerrainResourceId} from '../../models/game-map/terrain';

import {GameMap, GameMapRow, GameMapTile} from '../../models/game-map/game-map';
import {MapGeneratorSettings} from '../../models/map-generator/map-generator-settings';

import {YieldCalculatorService} from './yield-calculator.service';

@Injectable({providedIn: 'root'})
export class GameMapGeneratorService {

  constructor(
    private yieldCalculatorService: YieldCalculatorService
  ) {}

  public getTerrainCssClass(tile: GameMapTile): string {
    return 'm-terrain-' + TerrainBaseId[tile.terrain.base]
      .toLowerCase()
      .replace('_', '-');
  }

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
    tile.cssClass = this.getTerrainCssClass(tile);
    tile.yield = this.yieldCalculatorService.calculateTileYield(tile);
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
