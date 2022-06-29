import {TerrainBaseId, TerrainFeatureId, TerrainResourceId, TerrainImprovementId} from './terrain';

export enum WorldBuilderToolId {
  TERRAIN_BASE,
  TERRAIN_FEATURE,
  TERRAIN_RESOURCE,
  TERRAIN_IMPROVEMENT,
}

export enum WorldBuilderBrushSizeId {
  SMALL,
  MEDIUM,
  LARGE
}

export interface WorldBuilderUi {
  tool: WorldBuilderToolId;
  brushSize: WorldBuilderBrushSizeId;
  terrainBase: TerrainBaseId;
  terrainFeature: TerrainFeatureId;
  terrainResource: TerrainResourceId;
  terrainImprovement: TerrainImprovementId;
}
