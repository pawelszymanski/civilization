import {Injectable} from '@angular/core';

import {Tile} from '../models/map';
import {WorldBuilderToolId, WorldBuilderUi} from '../models/world-builder';
import {TerrainBaseId, TerrainFeatureId, TerrainImprovementId, TerrainResourceId} from '../models/terrain';

import {TileTerrainService} from './tile-terrain.service';

import {WorldBuilderUiStore} from '../stores/world-builder-ui.store';
import {MapStore} from '../stores/map.store';

@Injectable({providedIn: 'root'})
export class WorldBuilderService {

  worldBuilderUi: WorldBuilderUi;

  constructor(
    private tileTerrainService: TileTerrainService,
    private mapStore: MapStore,
    private worldBuilderUiStore: WorldBuilderUiStore,
  ) {
    this.subscribeToData();
  }

  private subscribeToData(): void {
    this.worldBuilderUiStore.worldBuilderUi.subscribe(worldBuilderUi => this.worldBuilderUi = worldBuilderUi)
  }

  public handleTileClick(tile: Tile): void {
    switch (this.worldBuilderUi.tool) {
      case WorldBuilderToolId.TERRAIN_BASE:
        const baseId = this.worldBuilderUi.terrainBase;
        this.mapStore.setTileTerrainBase(tile, baseId);
        break;
      case WorldBuilderToolId.TERRAIN_FEATURE:
        const featureId = this.worldBuilderUi.terrainFeature;
        if (this.tileTerrainService.canFeatureBePutOnTile(featureId, tile)) {
          this.mapStore.setTileTerrainFeature(tile, featureId);
        }
        break;
      case WorldBuilderToolId.TERRAIN_RESOURCE:
        const resourceId = this.worldBuilderUi.terrainResource;
        if (this.tileTerrainService.canResourceBePutOnTile(resourceId, tile)) {
          this.mapStore.setTileTerrainResource(tile, resourceId);
        }
        break;
      case WorldBuilderToolId.TERRAIN_IMPROVEMENT:
        const improvementId = this.worldBuilderUi.terrainImprovement;
        if (this.tileTerrainService.canImprovementBePutOnTile(improvementId, tile)) {
          this.mapStore.setTileTerrainImprovement(tile, improvementId);
        }
        break;
    }
  }

  public handleTileContextmenu(tile: Tile): void {
    switch (this.worldBuilderUi.tool) {
      case WorldBuilderToolId.TERRAIN_BASE:
        this.mapStore.setTileTerrainBase(tile, TerrainBaseId.OCEAN);
        break;
      case WorldBuilderToolId.TERRAIN_FEATURE:
        this.mapStore.setTileTerrainFeature(tile, TerrainFeatureId.NONE);
        break;
      case WorldBuilderToolId.TERRAIN_RESOURCE:
        this.mapStore.setTileTerrainResource(tile, TerrainResourceId.NONE);
        break;
      case WorldBuilderToolId.TERRAIN_IMPROVEMENT:
        this.mapStore.setTileTerrainImprovement(tile, TerrainImprovementId.NONE);
        break;
    }

  }

}
