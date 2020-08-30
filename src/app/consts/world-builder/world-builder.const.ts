import {WorldBuilderBrushSize, WorldBuilderUi} from '../../models/world-builder/world-builder';
import {WorldBuilderToolId} from '../../models/world-builder/world-builder-tool.enum';
import {TerrainBaseId, TerrainFeatureId, TerrainImprovementId, TerrainResourceId} from '../../models/game-map/terrain';

export const DEFAULT_WORLD_BUILDER_UI: WorldBuilderUi = {
  tool: WorldBuilderToolId.TERRAIN_BASE,
  brushSize: WorldBuilderBrushSize.SMALL,
  terrainBase: TerrainBaseId.GRASSLAND_FLAT,
  terrainFeature: TerrainFeatureId.NONE,
  terrainResource: TerrainResourceId.NONE,
  terrainImprovement: TerrainImprovementId.NONE
}
