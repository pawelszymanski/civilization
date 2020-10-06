import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import {TerrainBaseId, TerrainFeatureId, TerrainResourceId, TerrainImprovementId} from '../models/terrain';
import {Map, Tile} from '../models/map';

import {TERRAIN_BASE_SET, TERRAIN_FEATURE_SET} from '../consts/terrain.const';
import {DEFAULT_MAP} from '../consts/map.const';

import {GeneratorService} from '../services/generator.service';
import {TileYieldService} from '../services/tile-yield.service';
import {TileTerrainService} from '../services/tile-terrain.service';

@Injectable()
export class MapStore {

  private _map: BehaviorSubject<Map> = new BehaviorSubject(DEFAULT_MAP);

  public readonly map: Observable<Map> = this._map.asObservable();

  constructor(
    private generatorService: GeneratorService,
    private tileYieldService: TileYieldService,
    private tileTerrainService: TileTerrainService,
  ) {}

  public next(map: Map) {
    this._map.next(map);
  }

  private tileIndex(tile: Tile): number {
    return tile.grid.x * this._map.value.height + tile.grid.y;
  }

  private deepCopyTiles(tiles: Tile[]): Tile[] {
    return tiles.map(tile => JSON.parse(JSON.stringify(tile)));
  }

  private updateTiles(tiles: Tile[]) {
    const map = this._map.getValue();
    for (let tile of tiles) {
      const tileIndex = this.tileIndex(tile);
      map.tiles[tileIndex] = tile;
    }
    this.next(map);
  }

  public setTilesTerrainBase(tiles: Tile[], terrainBaseId: TerrainBaseId) {
    const newTiles = this.deepCopyTiles(tiles);
    newTiles.forEach(newTile => {
      const variantCount = TERRAIN_BASE_SET[terrainBaseId].ui.variantCount;  // There is no TerrainBaseId.NONE, it's always some terrain that is listed in TERRAIN_BASE_SET
      const variant = this.generatorService.randomPositiveInteger(variantCount);
      newTile.terrain.base = {id: terrainBaseId, uiVariant: variant};
      this.tileYieldService.updateTileYield(newTile);
    });
    this.updateTiles(newTiles);
  }

  public setTilesTerrainFeature(tiles: Tile[], terrainFeatureId: TerrainFeatureId) {
    const newTiles = this.deepCopyTiles(tiles);
    newTiles.forEach(newTile => {
      if (terrainFeatureId === TerrainFeatureId.NONE) {  // Check for TerrainFeatureId.NONE since it has to have uiVariant set manually (not listed in the TERRAIN_FEATURE_SET)
        newTile.terrain.feature = {id: TerrainFeatureId.NONE, uiVariant: null};
      } else {
        if (this.tileTerrainService.canFeatureBePutOnTile(terrainFeatureId, newTile)) {
          const variantCount = TERRAIN_FEATURE_SET[terrainFeatureId].ui.variantCount;
          const variant = this.generatorService.randomPositiveInteger(variantCount);
          newTile.terrain.feature = {id: terrainFeatureId, uiVariant: variant};
        }
      }
      this.tileYieldService.updateTileYield(newTile);
    });
    this.updateTiles(newTiles);
  }

  public setTilesTerrainResource(tiles: Tile[], terrainResourceId: TerrainResourceId) {
    const newTiles = this.deepCopyTiles(tiles);
    newTiles.forEach(newTile => {
      if (this.tileTerrainService.canResourceBePutOnTile(terrainResourceId, newTile)) {
        newTile.terrain.resourceId = terrainResourceId;  // Resources do not have any ui variants
        this.tileYieldService.updateTileYield(newTile);
      }
    });
    this.updateTiles(newTiles);
  }

  public setTilesTerrainImprovement(tiles: Tile[], terrainImprovementId: TerrainImprovementId) {
    const newTiles = this.deepCopyTiles(tiles);
    newTiles.forEach(newTile => {
      if (this.tileTerrainService.canImprovementBePutOnTile(terrainImprovementId, newTile)) {
        newTile.terrain.improvementId = terrainImprovementId;  // Improvements do not have any ui variants
        this.tileYieldService.updateTileYield(newTile);
      }
    });
    this.updateTiles(newTiles);
  }

}
