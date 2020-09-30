import {Injectable} from '@angular/core';

import {Tile} from '../models/map';
import {WorldBuilderToolId, WorldBuilderUi} from '../models/world-builder';
import {TerrainBaseId, TerrainFeatureId, TerrainImprovementId, TerrainResourceId} from '../models/terrain';

import {TileTerrainService} from './tile-terrain.service';

import {MapStore} from '../stores/map.store';
import {WorldBuilderUiStore} from '../stores/world-builder-ui.store';
import {WorldBuilderHoveredTilesStore} from '../stores/world-builder-hovered-tiles.store';

@Injectable({providedIn: 'root'})
export class WorldBuilderService {

  worldBuilderUi: WorldBuilderUi;
  wbHoveredTiles: Tile[] = [];

  constructor(
    private tileTerrainService: TileTerrainService,
    private mapStore: MapStore,
    private worldBuilderUiStore: WorldBuilderUiStore,
    private worldBuilderHoveredTilesStore: WorldBuilderHoveredTilesStore,
  ) {
    this.subscribeToData();
  }

  private subscribeToData(): void {
    this.worldBuilderUiStore.worldBuilderUi.subscribe(worldBuilderUi => this.worldBuilderUi = worldBuilderUi)
    this.worldBuilderHoveredTilesStore.wbHoveredTiles.subscribe(wbHoveredTiles => this.wbHoveredTiles = wbHoveredTiles);
  }

  public handleTileClick(tile: Tile): void {
    switch (this.worldBuilderUi.tool) {
      case WorldBuilderToolId.TERRAIN_BASE:
        const baseId = this.worldBuilderUi.terrainBase;
        for (let hoveredTile of this.wbHoveredTiles) {
          this.mapStore.setTileTerrainBase(hoveredTile, baseId);
        }
        break;
      case WorldBuilderToolId.TERRAIN_FEATURE:
        const featureId = this.worldBuilderUi.terrainFeature;
        for (let hoveredTile of this.wbHoveredTiles) {
          if (this.tileTerrainService.canFeatureBePutOnTile(featureId, hoveredTile)) {
            this.mapStore.setTileTerrainFeature(hoveredTile, featureId);
          }
        }
        break;
      case WorldBuilderToolId.TERRAIN_RESOURCE:
        const resourceId = this.worldBuilderUi.terrainResource;
        for (let hoveredTile of this.wbHoveredTiles) {
          if (this.tileTerrainService.canResourceBePutOnTile(resourceId, hoveredTile)) {
            this.mapStore.setTileTerrainResource(hoveredTile, resourceId);
          }
        }
        break;
      case WorldBuilderToolId.TERRAIN_IMPROVEMENT:
        const improvementId = this.worldBuilderUi.terrainImprovement;
        for (let hoveredTile of this.wbHoveredTiles) {
          if (this.tileTerrainService.canImprovementBePutOnTile(improvementId, hoveredTile)) {
            this.mapStore.setTileTerrainImprovement(hoveredTile, improvementId);
          }
        }
        break;
    }
  }

  public handleTileContextmenu(tile: Tile): void {
    switch (this.worldBuilderUi.tool) {
      case WorldBuilderToolId.TERRAIN_BASE:
        for (let hoveredTile of this.wbHoveredTiles) {
          this.mapStore.setTileTerrainBase(hoveredTile, TerrainBaseId.OCEAN);
        }
        break;
      case WorldBuilderToolId.TERRAIN_FEATURE:
        for (let hoveredTile of this.wbHoveredTiles) {
          this.mapStore.setTileTerrainFeature(hoveredTile, TerrainFeatureId.NONE);
        }
        break;
      case WorldBuilderToolId.TERRAIN_RESOURCE:
        for (let hoveredTile of this.wbHoveredTiles) {
          this.mapStore.setTileTerrainResource(hoveredTile, TerrainResourceId.NONE);
        }
        break;
      case WorldBuilderToolId.TERRAIN_IMPROVEMENT:
        for (let hoveredTile of this.wbHoveredTiles) {
          this.mapStore.setTileTerrainImprovement(hoveredTile, TerrainImprovementId.NONE);
        }
        break;
    }

  }

}
