import {Component, ViewEncapsulation} from '@angular/core';

import {
  TerrainBaseId,
  TerrainFeatureId,
  TerrainResourceId,
  TerrainImprovementId
} from '../../../models/game-map/terrain';
import {WorldBuilderToolId} from '../../../models/world-builder/world-builder-tool.enum';
import {WorldBuilderUi} from '../../../models/world-builder/world-builder';

import {TERRAIN_BASE_LIST, TERRAIN_FEATURE_LIST, TERRAIN_RESOURCE_LIST, TERRAIN_IMPROVEMENT_LIST} from '../../../consts/game-map/terrain-db.const';

import {WorldBuilderUiStore} from '../../../stores/world-builder-ui.store';

@Component({
  selector: '.world-builder-component',
  templateUrl: './world-builder.component.html',
  styleUrls: ['./world-builder.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WorldBuilderComponent {

  TERRAIN_BASE_LIST = TERRAIN_BASE_LIST;
  TERRAIN_FEATURE_LIST = TERRAIN_FEATURE_LIST;
  TERRAIN_RESOURCE_LIST = TERRAIN_RESOURCE_LIST;
  TERRAIN_IMPROVEMENT_LIST = TERRAIN_IMPROVEMENT_LIST;

  TerrainFeatureId = TerrainFeatureId;
  TerrainResourceId = TerrainResourceId;
  TerrainImprovementId = TerrainImprovementId;

  WorldBuilderToolId = WorldBuilderToolId;

  worldBuilderUi: WorldBuilderUi;

  constructor(
    private worldBuilderUiStore: WorldBuilderUiStore
  ) {}

  ngOnInit() {
    this.subscribeToData();
  }

  subscribeToData() {
    this.worldBuilderUiStore.worldBuilderUi.subscribe(worldBuilderUi => this.worldBuilderUi = worldBuilderUi);
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
