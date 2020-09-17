import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import {TerrainBaseId, TerrainFeatureId, TerrainResourceId, TerrainImprovementId} from '../models/terrain';
import {Coords} from '../models/utils';
import {Map, Tile} from '../models/map';

import {TERRAIN_BASE_SET, TERRAIN_FEATURE_SET} from '../consts/terrain.const';

import {YieldService} from '../services/yield.service';
import {GeneratorService} from '../services/generator.service';

@Injectable()
export class MapStore {

  private _map: BehaviorSubject<Map> = new BehaviorSubject(undefined);

  public readonly map: Observable<Map> = this._map.asObservable();

  constructor(
    private yieldService: YieldService,
    private generatorService: GeneratorService
  ) {}

  private updateTileYield(tile: Tile) {
    tile.yield = this.yieldService.calcTileYield(tile);
  }

  private updateTileAndNext(tile: Tile, map: Map) {
    this.updateTileYield(tile);
    this.next(map);
  }

  public setTileTerrainBase(coords: Coords, terrainBaseId: TerrainBaseId) {
    const map = this._map.value;
    const tile = map.tiles.find(t => t.coords.x === coords.x && t.coords.y === coords.y);
    const variations = TERRAIN_BASE_SET[terrainBaseId].ui.cssVariations;
    tile.terrain.base = {id: terrainBaseId, variation: this.generatorService.randomPositiveInteger(variations)};
    this.updateTileAndNext(tile, map);
  }

  public setTileTerrainFeature(coords: Coords, terrainFeatureId: TerrainFeatureId) {
    const map = this._map.value;
    const tile = map.tiles.find(t => t.coords.x === coords.x && t.coords.y === coords.y);
    const variations = terrainFeatureId ? this.generatorService.randomPositiveInteger(TERRAIN_FEATURE_SET[terrainFeatureId].ui.cssVariations) : null;
    tile.terrain.feature = {id: terrainFeatureId, variation: variations};
    this.updateTileAndNext(tile, map);
  }

  public setTileTerrainResource(coords: Coords, terrainResourceId: TerrainResourceId) {
    const map = this._map.value;
    const tile = map.tiles.find(t => t.coords.x === coords.x && t.coords.y === coords.y);
    tile.terrain.resourceId = terrainResourceId;
    this.updateTileAndNext(tile, map);
  }

  public setTileTerrainImprovement(coords: Coords, terrainImprovementId: TerrainImprovementId) {
    const map = this._map.value;
    const tile = map.tiles.find(t => t.coords.x === coords.x && t.coords.y === coords.y);
    tile.terrain.improvementId = terrainImprovementId;
    this.updateTileAndNext(tile, map);
  }

  public next(map: Map) {
    // TODO: for during development, remove later
    // map.columns.forEach(column => column.tiles.forEach(tile => this.updateTileCssClassesAndYield(tile)))
    this._map.next(map);
  }

}
