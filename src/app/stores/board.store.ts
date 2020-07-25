import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import {Step} from '../models/step';
import {Board, BoardTile} from '../models/board';
import {TERRAIN_BASE_ID_LENGTH, TERRAIN_FEATURE_ID_LENGTH, TERRAIN_RESOURCE_ID_LENGTH, TERRAIN_IMPROVEMENT_ID_LENGTH} from '../models/terrain';

import {BoardGeneratorService} from '../services/board-generator.service';
import {YieldCalculatorService} from '../services/yield-calculator.service';

@Injectable()
export class BoardStore {

  private _board: BehaviorSubject<Board> = new BehaviorSubject(undefined);

  public readonly board: Observable<Board> = this._board.asObservable();

  constructor(
    private boardGeneratorService: BoardGeneratorService,
    private yieldCalculatorService: YieldCalculatorService
  ) {}

  public setBoard(board: Board) {
    this._board.next(board);
  }

  public cycleTileTerrainBase(tile: BoardTile, step: Step) {
    tile.terrain.base = (tile.terrain.base + step + TERRAIN_BASE_ID_LENGTH) % TERRAIN_BASE_ID_LENGTH;
    this.updateTile(tile);
  }

  public cycleTileTerrainFeature(tile: BoardTile, step: Step) {
    tile.terrain.feature = (tile.terrain.feature + step + TERRAIN_FEATURE_ID_LENGTH) % TERRAIN_FEATURE_ID_LENGTH;
    this.updateTile(tile);
  }

  public cycleTileTerrainResource(tile: BoardTile, step: Step) {
    tile.terrain.resource = (tile.terrain.resource + step + TERRAIN_RESOURCE_ID_LENGTH) % TERRAIN_RESOURCE_ID_LENGTH;
    this.updateTile(tile);
  }

  public cycleTileTerrainImprovement(tile: BoardTile, step: Step) {
    tile.terrain.improvement = (tile.terrain.improvement + step + TERRAIN_IMPROVEMENT_ID_LENGTH) % TERRAIN_IMPROVEMENT_ID_LENGTH;
    this.updateTile(tile);
  }

  // public updateTile(coords: Coords, terrain: Terrain) {
  public updateTile(tile: BoardTile) {
    const board = this._board.value;
    tile.cssClass = this.boardGeneratorService.getTerrainCssClass(tile);
    tile.yield = this.yieldCalculatorService.calculateTileYield(tile);
    board.rows[tile.coords.y].tiles[tile.coords.x] = tile;
    this._board.next(board);
  }

}
