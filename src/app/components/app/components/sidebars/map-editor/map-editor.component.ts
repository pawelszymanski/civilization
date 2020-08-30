import {Component, ViewEncapsulation} from '@angular/core';

import {TerrainBaseId, TerrainFeatureId, TerrainResourceId, TerrainImprovementId} from '../../../../../models/game-map/terrain';

import {TERRAIN_BASE_LIST, TERRAIN_FEATURE_LIST, TERRAIN_RESOURCE_LIST, TERRAIN_IMPROVEMENT_LIST} from '../../../../../consts/game-map/terrain-db.const';

enum MapEditorModeId {
  TERRAIN_BASE,
  TERRAIN_FEATURE,
  TERRAIN_RESOURCE,
  TERRAIN_IMPROVEMENT,
}

@Component({
  selector: '.map-editor-component',
  templateUrl: './map-editor.component.html',
  styleUrls: ['./map-editor.component.scss', './../sidebar.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MapEditorComponent {

  MapEditorModeId = MapEditorModeId;
  mode = MapEditorModeId.TERRAIN_BASE;

  TERRAIN_BASE_LIST = TERRAIN_BASE_LIST;
  TERRAIN_FEATURE_LIST = TERRAIN_FEATURE_LIST;
  TERRAIN_RESOURCE_LIST = TERRAIN_RESOURCE_LIST;
  TERRAIN_IMPROVEMENT_LIST = TERRAIN_IMPROVEMENT_LIST;

  TerrainBaseId = TerrainBaseId;
  TerrainFeatureId = TerrainFeatureId;
  TerrainResourceId = TerrainResourceId;
  TerrainImprovementId = TerrainImprovementId;

  setMode(mode: MapEditorModeId) {
    this.mode = mode;
  }

}
