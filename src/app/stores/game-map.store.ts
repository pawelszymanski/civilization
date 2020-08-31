import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import {TerrainBaseId, TerrainFeatureId, TerrainResourceId, TerrainImprovementId} from '../models/game-map/terrain';
import {Coords} from '../models/utils/coords';
import {GameMap, GameMapTile} from '../models/game-map/game-map';

import {GameMapHelperService} from '../services/game-map/game-map-helper.service';

@Injectable()
export class GameMapStore {

  private _gameMap: BehaviorSubject<GameMap> = new BehaviorSubject(undefined);

  public readonly gameMap: Observable<GameMap> = this._gameMap.asObservable();

  constructor(
    private gameMapHelperService: GameMapHelperService,
  ) {}

  private updateTileCssClasses(tile: GameMapTile) {
    tile.cssClasses = this.gameMapHelperService.calcTileCssClasses(tile);
  }

  private updateTileYield(tile: GameMapTile) {
    tile.yield = this.gameMapHelperService.calcTileYield(tile);
  }

  public setTileTerrainBase(coords: Coords, terrainBase: TerrainBaseId) {
    const gameMap = this._gameMap.value;
    const tile = gameMap.rows[coords.y].tiles[coords.x];
    tile.terrain.base = terrainBase;
    this.updateTileCssClasses(tile);
    this.updateTileYield(tile);
    this.next(gameMap);
  }

  public setTileTerrainFeature(coords: Coords, terrainFeature: TerrainFeatureId) {
    const gameMap = this._gameMap.value;
    const tile = gameMap.rows[coords.y].tiles[coords.x];
    tile.terrain.feature = terrainFeature;
    this.updateTileCssClasses(tile);
    this.updateTileYield(tile);
    this.next(gameMap);
  }

  public setTileTerrainResource(coords: Coords, terrainResource: TerrainResourceId) {
    const gameMap = this._gameMap.value;
    const tile = gameMap.rows[coords.y].tiles[coords.x];
    tile.terrain.resource = terrainResource;
    this.updateTileCssClasses(tile);
    this.updateTileYield(tile);
    this.next(gameMap);
  }

  public setTileTerrainImprovement(coords: Coords, terrainImprovement: TerrainImprovementId) {
    const gameMap = this._gameMap.value;
    const tile = gameMap.rows[coords.y].tiles[coords.x];
    tile.terrain.improvement = terrainImprovement;
    this.updateTileCssClasses(tile);
    this.updateTileYield(tile);
    this.next(gameMap);
  }

  public next(gameMap: GameMap) {
    // TODO: for during development, remove later
    // gameMap.rows.forEach(row => row.tiles.forEach(tile => this.updateTileCssClassesAndYield(tile)))
    this._gameMap.next(gameMap);
  }

}
