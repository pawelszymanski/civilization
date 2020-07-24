import {Injectable} from '@angular/core';

import {Board, BoardRow, BoardTile} from '../models/board';
import {TerrainBaseId, TerrainFeatureId, TerrainResourceId} from '../models/terrain';
import {BoardGeneratorSettings} from '../models/board-generator-settings';

import {YieldCalculatorService} from './yield-calculator.service';

@Injectable({providedIn: 'root'})
export class BoardGeneratorService {

  constructor(
    private yieldCalculatorService: YieldCalculatorService
  ) {}

  public getTerrainCssClass(tile: BoardTile): string {
    return 'm-terrain-' + TerrainBaseId[tile.terrain.base].toLowerCase()
  }

  private createBoardTile(x: number, y: number): BoardTile {
    const tile = {
      coords: {
        x,
        y
      },
      terrain: {
        base: TerrainBaseId.OCEAN,
        feature: TerrainFeatureId.NONE,
        resource: TerrainResourceId.NONE
      }
    } as BoardTile;
    tile.cssClass = this.getTerrainCssClass(tile);
    tile.yield = this.yieldCalculatorService.calculateTileYield(tile);
    return tile;
  }

  private createBoardRow(rowId: number, width: number): BoardRow {
    return {tiles: [...Array(width).keys()].map(x => this.createBoardTile(x, rowId))}
  }

  private createBoard(params: BoardGeneratorSettings): Board {
    return {rows: [...Array(params.height).keys()].map(y => this.createBoardRow(y, params.width))}
  }

  public generateNewBoard(params: BoardGeneratorSettings): Board {
    const map = this.createBoard(params);
    return map;
  }

}
