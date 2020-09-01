import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import {TerrainBaseId, TerrainFeatureId, TerrainResourceId, TerrainImprovementId} from '../models/game-map/terrain';
import {Coords} from '../models/utils/coords';
import {GameMap, GameMapTile} from '../models/game-map/game-map';

import {TERRAIN_BASE_DB, TERRAIN_FEATURE_DB} from '../consts/game-map/terrain-db.const';

import {GameMapHelperService} from '../services/game-map/game-map-helper.service';
import {GeneratorService} from '../services/utils/generator.service';

@Injectable()
export class GameMapStore {

  private _gameMap: BehaviorSubject<GameMap> = new BehaviorSubject(undefined);

  public readonly gameMap: Observable<GameMap> = this._gameMap.asObservable();

  constructor(
    private gameMapHelperService: GameMapHelperService,
    private generatorService: GeneratorService
  ) {}

  private updateTileCssClasses(tile: GameMapTile) {
    tile.cssClasses = this.gameMapHelperService.calcTileCssClasses(tile);
  }

  private updateTileYield(tile: GameMapTile) {
    tile.yield = this.gameMapHelperService.calcTileYield(tile);
  }

  private updateTileAndNext(tile: GameMapTile, gameMap: GameMap) {
    this.updateTileCssClasses(tile);
    this.updateTileYield(tile);
    this.next(gameMap);
  }

  public setTileTerrainBase(coords: Coords, terrainBaseId: TerrainBaseId) {
    const gameMap = this._gameMap.value;
    const tile = gameMap.columns[coords.x].tiles[coords.y];
    const variations = TERRAIN_BASE_DB[terrainBaseId].ui.cssVariations;
    tile.terrain.base = {id: terrainBaseId, variation: this.generatorService.randomPositiveInteger(variations)};
    this.updateTileAndNext(tile, gameMap);
  }

  public setTileTerrainFeature(coords: Coords, terrainFeatureId: TerrainFeatureId) {
    const gameMap = this._gameMap.value;
    const tile = gameMap.columns[coords.x].tiles[coords.y];
    const variations = terrainFeatureId ? this.generatorService.randomPositiveInteger(TERRAIN_FEATURE_DB[terrainFeatureId].ui.cssVariations) : null;
    tile.terrain.feature = {id: terrainFeatureId, variation: variations};
    this.updateTileAndNext(tile, gameMap);
  }

  public setTileTerrainResource(coords: Coords, terrainResourceId: TerrainResourceId) {
    const gameMap = this._gameMap.value;
    const tile = gameMap.columns[coords.x].tiles[coords.y];
    tile.terrain.resourceId = terrainResourceId;
    this.updateTileAndNext(tile, gameMap);
  }

  public setTileTerrainImprovement(coords: Coords, terrainImprovementId: TerrainImprovementId) {
    const gameMap = this._gameMap.value;
    const tile = gameMap.columns[coords.x].tiles[coords.y];
    tile.terrain.improvementId = terrainImprovementId;
    this.updateTileAndNext(tile, gameMap);
  }

  public next(gameMap: GameMap) {
    // TODO: for during development, remove later
    // gameMap.columns.forEach(column => column.tiles.forEach(tile => this.updateTileCssClassesAndYield(tile)))
    this._gameMap.next(gameMap);
  }

}
