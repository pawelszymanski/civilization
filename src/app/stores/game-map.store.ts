import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import {GameMap, GameMapTile} from '../models/game-map/game-map';
import {Step} from '../models/utils/step';

import {TERRAIN_BASE_ID_LENGTH, TERRAIN_FEATURE_ID_LENGTH, TERRAIN_RESOURCE_ID_LENGTH, TERRAIN_IMPROVEMENT_ID_LENGTH} from '../models/game-map/terrain';

import {GameMapGeneratorService} from '../services/game-map-generator.service';
import {YieldCalculatorService} from '../services/yield-calculator.service';
import {GeneratorService} from '../services/generator.service';

@Injectable()
export class GameMapStore {

  private _gameMap: BehaviorSubject<GameMap> = new BehaviorSubject(undefined);

  public readonly gameMap: Observable<GameMap> = this._gameMap.asObservable();

  constructor(
    private gameMapGeneratorService: GameMapGeneratorService,
    private yieldCalculatorService: YieldCalculatorService,
    private generatorService: GeneratorService
  ) {}

  public next(gameMap: GameMap) {
    this._gameMap.next(gameMap);
  }

  public randomizeTileTerrain(tile: GameMapTile) {
    tile.terrain.base = this.generatorService.randomPositiveInteger(TERRAIN_BASE_ID_LENGTH) - 1;
    tile.terrain.feature = this.generatorService.randomPositiveInteger(TERRAIN_FEATURE_ID_LENGTH) - 1;
    tile.terrain.resource = this.generatorService.randomPositiveInteger(TERRAIN_RESOURCE_ID_LENGTH) - 1;
    tile.terrain.improvement = this.generatorService.randomPositiveInteger(TERRAIN_IMPROVEMENT_ID_LENGTH) - 1;
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
