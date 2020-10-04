import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Subscription} from 'rxjs';

import {
  TerrainBaseId,
  TerrainFeatureId,
  TerrainResourceId,
  TerrainImprovementId
} from '../../../models/terrain';
import {WorldBuilderBrushSizeId, WorldBuilderToolId} from '../../../models/world-builder';
import {WorldBuilderUi} from '../../../models/world-builder';

import {TERRAIN_BASE_LIST, TERRAIN_FEATURE_LIST, TERRAIN_RESOURCE_LIST, TERRAIN_IMPROVEMENT_LIST} from '../../../consts/terrain.const';

import {WorldBuilderUiStore} from '../../../stores/world-builder-ui.store';
import {WorldBuilderHoveredTilesStore} from '../../../stores/world-builder-hovered-tiles.store';

@Component({
  selector: '.world-builder-component',
  templateUrl: './world-builder.component.html',
  styleUrls: ['./world-builder.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WorldBuilderComponent implements OnInit, OnDestroy {

  TERRAIN_BASE_LIST = TERRAIN_BASE_LIST;
  TERRAIN_FEATURE_LIST = TERRAIN_FEATURE_LIST;
  TERRAIN_RESOURCE_LIST = TERRAIN_RESOURCE_LIST;
  TERRAIN_IMPROVEMENT_LIST = TERRAIN_IMPROVEMENT_LIST;

  TerrainFeatureId = TerrainFeatureId;
  TerrainResourceId = TerrainResourceId;
  TerrainImprovementId = TerrainImprovementId;

  WorldBuilderToolId = WorldBuilderToolId;
  WorldBuilderBrushSizeId = WorldBuilderBrushSizeId;

  worldBuilderUi: WorldBuilderUi;

  subscriptions: Subscription[] = [];

  constructor(
    private worldBuilderUiStore: WorldBuilderUiStore,
    private worldBuilderHoveredTilesStore: WorldBuilderHoveredTilesStore,
  ) {}

  ngOnInit() {
    this.subscribeToData();
  }

  ngOnDestroy() {
    this.unsubscribeFromData();
    this.clearSelectedTiles();
  }

  subscribeToData() {
    this.subscriptions.push(
      this.worldBuilderUiStore.worldBuilderUi.subscribe(worldBuilderUi => this.worldBuilderUi = worldBuilderUi)
    );
  }

  unsubscribeFromData() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  clearSelectedTiles() {
    this.worldBuilderHoveredTilesStore.next([]);
  }

  onBrushSizeClick(brushSize: WorldBuilderBrushSizeId) {
    this.worldBuilderUiStore.setBrushSize(brushSize);
  }

  onToolClick(tool: WorldBuilderToolId) {
    this.worldBuilderUiStore.setTool(tool);
  }

  onTerrainBaseClick(terrainBase: TerrainBaseId) {
    this.worldBuilderUiStore.setTerrainBase(terrainBase);
  }

  onTerrainFeatureClick(terrainFeature: TerrainFeatureId) {
    this.worldBuilderUiStore.setTerrainFeature(terrainFeature);
  }

  onTerrainResourceClick(terrainResource: TerrainResourceId) {
    this.worldBuilderUiStore.setTerrainResource(terrainResource);
  }

  onTerrainImprovementClick(terrainImprovement: TerrainImprovementId) {
    this.worldBuilderUiStore.setTerrainImprovement(terrainImprovement);
  }

}
