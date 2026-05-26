import { Component, DestroyRef, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TerrainBaseId, TerrainFeatureId, TerrainResourceId, TerrainImprovementId } from '../../../models/terrain';
import { WorldBuilderBrushSizeId, WorldBuilderToolId } from '../../../models/world-builder';
import { WorldBuilderUi } from '../../../models/world-builder';

import { TERRAIN_BASE_LIST, TERRAIN_FEATURE_LIST, TERRAIN_RESOURCE_LIST, TERRAIN_IMPROVEMENT_LIST } from '../../../consts/terrain.const';

import { WorldBuilderUiStore } from '../../../stores/world-builder-ui.store';
import { WorldBuilderHoveredTilesStore } from '../../../stores/world-builder-hovered-tiles.store';

@Component({
  standalone: false,
  selector: '.world-builder-component',
  templateUrl: './world-builder.component.html',
  styleUrls: ['./world-builder.component.scss'],
  encapsulation: ViewEncapsulation.None,
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

  constructor(
    private destroyRef: DestroyRef,
    private worldBuilderUiStore: WorldBuilderUiStore,
    private worldBuilderHoveredTilesStore: WorldBuilderHoveredTilesStore
  ) {}

  ngOnInit(): void {
    this.subscribeToData();
  }

  ngOnDestroy(): void {
    this.clearSelectedTiles();
  }

  subscribeToData(): void {
    this.worldBuilderUiStore.worldBuilderUi
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(worldBuilderUi => (this.worldBuilderUi = worldBuilderUi));
  }

  clearSelectedTiles(): void {
    this.worldBuilderHoveredTilesStore.next([]);
  }

  onBrushSizeClick(brushSize: WorldBuilderBrushSizeId): void {
    this.worldBuilderUiStore.setBrushSize(brushSize);
  }

  onToolClick(tool: WorldBuilderToolId): void {
    this.worldBuilderUiStore.setTool(tool);
  }

  onTerrainBaseClick(terrainBase: TerrainBaseId): void {
    this.worldBuilderUiStore.setTerrainBase(terrainBase);
  }

  onTerrainFeatureClick(terrainFeature: TerrainFeatureId): void {
    this.worldBuilderUiStore.setTerrainFeature(terrainFeature);
  }

  onTerrainResourceClick(terrainResource: TerrainResourceId): void {
    this.worldBuilderUiStore.setTerrainResource(terrainResource);
  }

  onTerrainImprovementClick(terrainImprovement: TerrainImprovementId): void {
    this.worldBuilderUiStore.setTerrainImprovement(terrainImprovement);
  }
}
