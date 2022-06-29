import {Injectable} from '@angular/core';

import {Tile} from '../models/map';
import {WorldBuilderToolId, WorldBuilderUi} from '../models/world-builder';
import {TerrainBaseId, TerrainFeatureId, TerrainImprovementId, TerrainResourceId} from '../models/terrain';

import {MapStore} from '../stores/map.store';
import {WorldBuilderUiStore} from '../stores/world-builder-ui.store';
import {WorldBuilderHoveredTilesStore} from '../stores/world-builder-hovered-tiles.store';

@Injectable({providedIn: 'root'})
export class WorldBuilderService {

  worldBuilderUi: WorldBuilderUi;
  wbHoveredTiles: Tile[] = [];

  constructor(
    private mapStore: MapStore,
    private worldBuilderUiStore: WorldBuilderUiStore,
    private worldBuilderHoveredTilesStore: WorldBuilderHoveredTilesStore,
  ) {
    this.subscribeToData();
  }

  private subscribeToData(): void {
    this.worldBuilderUiStore.worldBuilderUi.subscribe(worldBuilderUi => this.worldBuilderUi = worldBuilderUi);
    this.worldBuilderHoveredTilesStore.wbHoveredTiles.subscribe(wbHoveredTiles => this.wbHoveredTiles = wbHoveredTiles);
  }

  public handleTileClick(): void {
    switch (this.worldBuilderUi.tool) {
      case WorldBuilderToolId.TERRAIN_BASE:
        const baseId = this.worldBuilderUi.terrainBase;
        this.mapStore.setTilesTerrainBase(this.wbHoveredTiles, baseId);
        break;
      case WorldBuilderToolId.TERRAIN_FEATURE:
        const featureId = this.worldBuilderUi.terrainFeature;
        this.mapStore.setTilesTerrainFeature(this.wbHoveredTiles, featureId);
        break;
      case WorldBuilderToolId.TERRAIN_RESOURCE:
        const resourceId = this.worldBuilderUi.terrainResource;
        this.mapStore.setTilesTerrainResource(this.wbHoveredTiles, resourceId);
        break;
      case WorldBuilderToolId.TERRAIN_IMPROVEMENT:
        const improvementId = this.worldBuilderUi.terrainImprovement;
        this.mapStore.setTilesTerrainImprovement(this.wbHoveredTiles, improvementId);
        break;
    }
  }

  public handleTileContextmenu(): void {
    switch (this.worldBuilderUi.tool) {
      case WorldBuilderToolId.TERRAIN_BASE:
        this.mapStore.setTilesTerrainBase(this.wbHoveredTiles, TerrainBaseId.OCEAN);
        break;
      case WorldBuilderToolId.TERRAIN_FEATURE:
        this.mapStore.setTilesTerrainFeature(this.wbHoveredTiles, TerrainFeatureId.NONE);
        break;
      case WorldBuilderToolId.TERRAIN_RESOURCE:
        this.mapStore.setTilesTerrainResource(this.wbHoveredTiles, TerrainResourceId.NONE);
        break;
      case WorldBuilderToolId.TERRAIN_IMPROVEMENT:
        this.mapStore.setTilesTerrainImprovement(this.wbHoveredTiles, TerrainImprovementId.NONE);
        break;
    }

  }

}
