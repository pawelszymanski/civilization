import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import {TerrainBaseId, TerrainFeatureId, TerrainResourceId, TerrainImprovementId} from '../models/terrain';
import {Map, Tile} from '../models/map';

import {TERRAIN_BASE_SET, TERRAIN_FEATURE_SET} from '../consts/terrain.const';

import {GeneratorService} from '../services/generator.service';
import {TileYieldService} from '../services/tile-yield.service';

@Injectable()
export class MapStore {

  private _map: BehaviorSubject<Map> = new BehaviorSubject(undefined);

  public readonly map: Observable<Map> = this._map.asObservable();

  constructor(
    private tileYieldService: TileYieldService,
    private generatorService: GeneratorService
  ) {}

  public next(map: Map) {
    this._map.next(map);
  }

  private tileIndex(coords): number {
    return coords.x * this._map.value.height + coords.y;
  }

  private cloneTile(tile: Tile): Tile {
    return JSON.parse(JSON.stringify(tile));
  }

  private updateTileYield(tile: Tile) {
    this.tileYieldService.updateTileYield(tile);
  }

  private replaceTile(tile: Tile, newTile: Tile) {
    const map = this._map.getValue();
    const tileIndex = this.tileIndex(tile.coords);
    map.tiles[tileIndex] = newTile;
    this.next(map); // TODO seems its not needed here
  }

  public setTileTerrainBase(tile: Tile, terrainBaseId: TerrainBaseId) {
    const newTile = this.cloneTile(tile);
    const variantCount = TERRAIN_BASE_SET[terrainBaseId].ui.variantCount;
    const variant = this.generatorService.randomPositiveInteger(variantCount);
    newTile.terrain.base = {id: terrainBaseId, uiVariant: variant};
    this.updateTileYield(newTile);
    this.replaceTile(tile, newTile);
  }

  public setTileTerrainFeature(tile: Tile, terrainFeatureId: TerrainFeatureId) {
    const newTile = this.cloneTile(tile);
    if (terrainFeatureId === TerrainFeatureId.NONE) {
      newTile.terrain.feature = {id: terrainFeatureId, uiVariant: null};
    } else {
      const variantCount = TERRAIN_FEATURE_SET[terrainFeatureId].ui.variantCount;
      const variant = this.generatorService.randomPositiveInteger(variantCount);
      newTile.terrain.feature = {id: terrainFeatureId, uiVariant: variant};
    }
    this.updateTileYield(newTile);
    this.replaceTile(tile, newTile);
  }

  public setTileTerrainResource(tile: Tile, terrainResourceId: TerrainResourceId) {
    const newTile = this.cloneTile(tile);
    newTile.terrain.resourceId = terrainResourceId;
    this.updateTileYield(newTile);
    this.replaceTile(tile, newTile);
  }

  public setTileTerrainImprovement(tile: Tile, terrainImprovementId: TerrainImprovementId) {
    const newTile = this.cloneTile(tile);
    newTile.terrain.improvementId = terrainImprovementId;
    this.updateTileYield(newTile);
    this.replaceTile(tile, newTile);
  }

}
