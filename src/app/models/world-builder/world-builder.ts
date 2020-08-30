import {WorldBuilderToolId} from './world-builder-tool.enum';
import {TerrainBaseId, TerrainFeatureId, TerrainResourceId, TerrainImprovementId} from '../game-map/terrain';

export enum WorldBuilderBrushSize {
  SMALL = 1,
  MEDIUM = 3,
  LARGE = 5
}

export interface WorldBuilderUi {
  tool: WorldBuilderToolId;
  brushSize: WorldBuilderBrushSize;
  terrainBase: TerrainBaseId;
  terrainFeature: TerrainFeatureId;
  terrainResource: TerrainResourceId;
  terrainImprovement: TerrainImprovementId;
}
