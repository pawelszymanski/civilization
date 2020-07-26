import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import {Step} from '../models/step';
import {GameMap, GameMapTile} from '../models/game-map';
import {TERRAIN_BASE_ID_LENGTH, TERRAIN_FEATURE_ID_LENGTH, TERRAIN_RESOURCE_ID_LENGTH, TERRAIN_IMPROVEMENT_ID_LENGTH} from '../models/terrain';

import {GameMapGeneratorService} from '../services/game-map-generator.service';
import {YieldCalculatorService} from '../services/yield-calculator.service';

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

  public cycleTileTerrainBase(tile: GameMapTile, step: Step) {
    tile.terrain.base = (tile.terrain.base + step + TERRAIN_BASE_ID_LENGTH) % TERRAIN_BASE_ID_LENGTH;
    this.updateTile(tile);
  }

  public cycleTileTerrainFeature(tile: GameMapTile, step: Step) {
    tile.terrain.feature = (tile.terrain.feature + step + TERRAIN_FEATURE_ID_LENGTH) % TERRAIN_FEATURE_ID_LENGTH;
    this.updateTile(tile);
  }

  public cycleTileTerrainResource(tile: GameMapTile, step: Step) {
    tile.terrain.resource = (tile.terrain.resource + step + TERRAIN_RESOURCE_ID_LENGTH) % TERRAIN_RESOURCE_ID_LENGTH;
    this.updateTile(tile);
  }

  public cycleTileTerrainImprovement(tile: GameMapTile, step: Step) {
    tile.terrain.improvement = (tile.terrain.improvement + step + TERRAIN_IMPROVEMENT_ID_LENGTH) % TERRAIN_IMPROVEMENT_ID_LENGTH;
    this.updateTile(tile);
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
