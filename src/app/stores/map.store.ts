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

  private tileIndex(coords): number {
    return coords.x * this._map.value.height + coords.y;
  }

  private duplicateTileOfCoords(coords: Coords): Tile {
    return JSON.parse(JSON.stringify(this._map.value.tiles[this.tileIndex(coords)]));
  }

  private updateTileOfCoords(coords: Coords, tile: Tile) {
    const map = this._map.getValue();
    const tileIndex = this.tileIndex(coords);
    tile.yield = this.yieldService.calcTileYield(tile);
    map.tiles[tileIndex] = tile;
    this.next(map); // TODO seems its not needed here
  }

  public setTileTerrainBase(coords: Coords, terrainBaseId: TerrainBaseId) {
    const tile = this.duplicateTileOfCoords(coords);
    const variantCount = TERRAIN_BASE_SET[terrainBaseId].ui.variants;
    const variant = this.generatorService.randomPositiveInteger(variantCount);
    tile.terrain.base = {id: terrainBaseId, uiVariant: variant};
    this.updateTileOfCoords(coords, tile);
  }

  public setTileTerrainFeature(coords: Coords, terrainFeatureId: TerrainFeatureId) {
    const tile = this.duplicateTileOfCoords(coords);
    if (terrainFeatureId === TerrainFeatureId.NONE) {
      tile.terrain.feature = {id: terrainFeatureId, uiVariant: null};
    } else {
      const variantCount = TERRAIN_FEATURE_SET[terrainFeatureId].ui.variants;
      const variant = this.generatorService.randomPositiveInteger(variantCount);
      tile.terrain.feature = {id: terrainFeatureId, uiVariant: variant};
    }
    this.updateTileOfCoords(coords, tile);
  }

  public setTileTerrainResource(coords: Coords, terrainResourceId: TerrainResourceId) {
    const tile = this.duplicateTileOfCoords(coords);
    tile.terrain.resourceId = terrainResourceId;
    this.updateTileOfCoords(coords, tile);
  }

  public setTileTerrainImprovement(coords: Coords, terrainImprovementId: TerrainImprovementId) {
    const tile = this.duplicateTileOfCoords(coords);
    tile.terrain.improvementId = terrainImprovementId;
    this.updateTileOfCoords(coords, tile);
  }

  public next(map: Map) {
    this._map.next(map);
  }

}
