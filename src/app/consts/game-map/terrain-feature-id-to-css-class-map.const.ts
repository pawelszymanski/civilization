import {TerrainFeatureId} from '../../models/game-map/terrain';

export const TERRAIN_FEATURE_ID_TO_CSS_CLASS_MAP = {
  [TerrainFeatureId.NONE]: 'm-feature-none',
  [TerrainFeatureId.WOODS]: 'm-feature-woods',
  [TerrainFeatureId.RAINFOREST]: 'm-feature-rainforest',
  [TerrainFeatureId.MARSH]: 'm-feature-marsh',
  [TerrainFeatureId.FLOODPLAINS]: 'm-feature-floodplains',
  [TerrainFeatureId.OASIS]: 'm-feature-oasis',
  [TerrainFeatureId.REEF]: 'm-feature-reef',
  [TerrainFeatureId.ICE]: 'm-feature-ice'
}
