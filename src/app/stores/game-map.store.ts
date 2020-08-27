import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import {GameMap, GameMapTile} from '../models/game-map/game-map';

import {GameMapGeneratorService} from '../services/game-map/game-map-generator.service';
import {YieldCalculatorService} from '../services/game-map/yield-calculator.service';

@Injectable()
export class GameMapStore {

  private _gameMap: BehaviorSubject<GameMap> = new BehaviorSubject(undefined);

  public readonly gameMap: Observable<GameMap> = this._gameMap.asObservable();

  constructor(
    private gameMapGeneratorService: GameMapGeneratorService,
    private yieldCalculatorService: YieldCalculatorService
  ) {}

  public next(gameMap: GameMap) {
    this._gameMap.next(gameMap);
  }

  // public updateTile(coords: Coords, terrain: Terrain) {
  public updateTile(tile: GameMapTile) {
    const gameMap = this._gameMap.value;
    tile.cssClass = this.gameMapGeneratorService.getTerrainCssClass(tile);
    tile.yield = this.yieldCalculatorService.calculateTileYield(tile);
    gameMap.rows[tile.coords.y].tiles[tile.coords.x] = tile;
    this._gameMap.next(gameMap);
  }

}
