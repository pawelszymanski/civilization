import {TerrainImprovementId} from '../../models/game-map/terrain';

export const TERRAIN_IMPROVEMENT_ID_TO_CSS_CLASS_MAP = {
  [TerrainImprovementId.NONE]: 'm-resource-none',
  [TerrainImprovementId.FARM]: 'm-resource-farm',
  [TerrainImprovementId.CAMP]: 'm-resource-camp',
  [TerrainImprovementId.PASTURE]: 'm-resource-pasture',
  [TerrainImprovementId.MINE]: 'm-resource-mine',
  [TerrainImprovementId.QUARRY]: 'm-resource-quarry',
  [TerrainImprovementId.PLANTATION]: 'm-resource-plantation',
  [TerrainImprovementId.LUMBER_MILL]: 'm-resource-lumber-mill',
  [TerrainImprovementId.FISHING_BOATS]: 'm-resource-fishing-boats',
  [TerrainImprovementId.SEASIDE_RESORT]: 'm-resource-resort',
  [TerrainImprovementId.OIL_WELL]: 'm-resource-oil-well',
  [TerrainImprovementId.OFFSHORE_PLATFORM]: 'm-resource-offshore-platform',
}
