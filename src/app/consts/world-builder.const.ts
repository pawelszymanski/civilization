import {TerrainBaseId, TerrainFeatureId, TerrainImprovementId, TerrainResourceId} from '../models/terrain';
import {WorldBuilderBrushSizeId, WorldBuilderUi, WorldBuilderToolId} from '../models/world-builder';

export const DEFAULT_WORLD_BUILDER_UI: WorldBuilderUi = {
  tool: WorldBuilderToolId.TERRAIN_BASE,
  brushSize: WorldBuilderBrushSizeId.SMALL,
  terrainBase: TerrainBaseId.GRASSLAND_FLAT,
  terrainFeature: TerrainFeatureId.NONE,
  terrainResource: TerrainResourceId.NONE,
  terrainImprovement: TerrainImprovementId.NONE
}
