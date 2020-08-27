import {TerrainBaseId, TerrainFeatureId, TerrainResourceId, TerrainImprovementId} from '../../models/game-map/terrain';
import {Yield, YieldId} from '../../models/game-map/yield';

export const TERRAIN_BASE_YIELD: Record<TerrainBaseId, Partial<Yield>> = {
  [TerrainBaseId.GRASSLAND]: { [YieldId.FOOD]: 2 },
  [TerrainBaseId.GRASSLAND_HILLS]: { [YieldId.FOOD]: 2, [YieldId.PRODUCTION]: 1 },
  [TerrainBaseId.GRASSLAND_MOUNTAIN]: {},
  [TerrainBaseId.PLAINS]: { [YieldId.FOOD]: 1, [YieldId.PRODUCTION]: 1 },
  [TerrainBaseId.PLAINS_HILLS]: { [YieldId.FOOD]: 1, [YieldId.PRODUCTION]: 2 },
  [TerrainBaseId.PLAINS_MOUNTAIN]: {},
  [TerrainBaseId.DESERT]: {},
  [TerrainBaseId.DESERT_HILLS]: { [YieldId.PRODUCTION]: 1 },
  [TerrainBaseId.DESERT_MOUNTAIN]: {},
  [TerrainBaseId.TUNDRA]: { [YieldId.FOOD]: 1},
  [TerrainBaseId.TUNDRA_HILLS]: { [YieldId.FOOD]: 1, [YieldId.PRODUCTION]: 1 },
  [TerrainBaseId.TUNDRA_MOUNTAIN]: {},
  [TerrainBaseId.SNOW]: {},
  [TerrainBaseId.SNOW_HILLS]: { [YieldId.PRODUCTION]: 1 },
  [TerrainBaseId.SNOW_MOUNTAIN]: {},
  [TerrainBaseId.COAST]: { [YieldId.FOOD]: 1, [YieldId.GOLD]: 1 },
  [TerrainBaseId.LAKE]: { [YieldId.FOOD]: 1, [YieldId.GOLD]: 1 },
  [TerrainBaseId.OCEAN]: { [YieldId.FOOD]: 1 }
}

export const TERRAIN_FEATURE_YIELD: Record<TerrainFeatureId, Partial<Yield>> = {
  [TerrainFeatureId.NONE]: {},
  [TerrainFeatureId.FLOODPLAINS]: { [YieldId.FOOD]: 1 },
  [TerrainFeatureId.ICE]: {},
  [TerrainFeatureId.MARSH]: { [YieldId.FOOD]: 1 },
  [TerrainFeatureId.OASIS]: { [YieldId.FOOD]: 3, [YieldId.GOLD]: 1 },
  [TerrainFeatureId.RAINFOREST]: { [YieldId.FOOD]: 1 },
  [TerrainFeatureId.WOODS]: { [YieldId.PRODUCTION]: 1 },
  [TerrainFeatureId.REEF]: { [YieldId.FOOD]: 1, [YieldId.PRODUCTION]: 1 }
}

export const TERRAIN_RESOURCE_YIELD: Record<TerrainResourceId, Partial<Yield>> = {
  [TerrainResourceId.NONE]: {},
  [TerrainResourceId.BANANAS]: { [YieldId.FOOD]: 1 },
  [TerrainResourceId.CATTLE]: { [YieldId.FOOD]: 1 },
  [TerrainResourceId.COPPER]: { [YieldId.GOLD]: 2 },
  [TerrainResourceId.CRABS]: { [YieldId.GOLD]: 2 },
  [TerrainResourceId.DEER]: { [YieldId.PRODUCTION]: 1 },
  [TerrainResourceId.FISH]: { [YieldId.FOOD]: 1 },
  [TerrainResourceId.RICE]: { [YieldId.FOOD]: 1 },
  [TerrainResourceId.SHEEP]: { [YieldId.FOOD]: 1 },
  [TerrainResourceId.STONE]: { [YieldId.PRODUCTION]: 1 },
  [TerrainResourceId.WHEAT]: { [YieldId.FOOD]: 1 },
  [TerrainResourceId.ALUMINUM]: { [YieldId.SCIENCE]: 1 },
  [TerrainResourceId.COAL]: { [YieldId.PRODUCTION]: 2 },
  [TerrainResourceId.HORSES]: { [YieldId.FOOD]: 1, [YieldId.PRODUCTION]: 1 },
  [TerrainResourceId.IRON]: { [YieldId.SCIENCE]: 1 },
  [TerrainResourceId.NITER]: { [YieldId.FOOD]: 1, [YieldId.PRODUCTION]: 1 },
  [TerrainResourceId.OIL]: { [YieldId.PRODUCTION]: 3 },
  [TerrainResourceId.URANIUM]: { [YieldId.PRODUCTION]: 2 },
  [TerrainResourceId.CITRUS]: { [YieldId.FOOD]: 2 },
  [TerrainResourceId.COCOA]: { [YieldId.GOLD]: 3 },
  [TerrainResourceId.COFFEE]: { [YieldId.CULTURE]: 1 },
  [TerrainResourceId.COTTON]: { [YieldId.GOLD]: 3 },
  [TerrainResourceId.DIAMONDS]: { [YieldId.GOLD]: 3 },
  [TerrainResourceId.DYES]: { [YieldId.FAITH]: 1 },
  [TerrainResourceId.FURS]: { [YieldId.FOOD]: 1, [YieldId.GOLD]: 1 },
  [TerrainResourceId.GYPSUM]: { [YieldId.PRODUCTION]: 1, [YieldId.GOLD]: 1 },
  [TerrainResourceId.INCENSE]: { [YieldId.FAITH]: 1 },
  [TerrainResourceId.IVORY]: { [YieldId.PRODUCTION]: 1, [YieldId.GOLD]: 1 },
  [TerrainResourceId.JADE]: { [YieldId.CULTURE]: 1 },
  [TerrainResourceId.MARBLE]: { [YieldId.CULTURE]: 1 },
  [TerrainResourceId.MERCURY]: { [YieldId.SCIENCE]: 1 },
  [TerrainResourceId.PEARLS]: { [YieldId.FAITH]: 1 },
  [TerrainResourceId.SALT]: { [YieldId.FOOD]: 1, [YieldId.GOLD]: 1 },
  [TerrainResourceId.SILK]: { [YieldId.CULTURE]: 1 },
  [TerrainResourceId.SILVER]: { [YieldId.GOLD]: 3 },
  [TerrainResourceId.SPICES]: { [YieldId.FOOD]: 2 },
  [TerrainResourceId.SUGAR]: { [YieldId.FOOD]: 2 },
  [TerrainResourceId.TEA]: { [YieldId.SCIENCE]: 1 },
  [TerrainResourceId.TOBACCO]: { [YieldId.FAITH]: 1 },
  [TerrainResourceId.TRUFFLES]: { [YieldId.GOLD]: 3 },
  [TerrainResourceId.WHALES]: { [YieldId.FOOD]: 1, [YieldId.GOLD]: 1 },
  [TerrainResourceId.WINE]: { [YieldId.FOOD]: 1, [YieldId.GOLD]: 1 }
}

export const TERRAIN_IMPROVEMENT_YIELD: Record<TerrainImprovementId, Partial<Yield>> = {
  [TerrainImprovementId.NONE]: {},
  [TerrainImprovementId.FARM]: { [YieldId.FOOD]: 1 }, // +0.5 Housing, +1 Food per 2 adjacent Farms (Feudalism until Replaceable Parts), +1 Food per adjacent Farm (Replaceable Parts)
  [TerrainImprovementId.CAMP]: { [YieldId.GOLD]: 1 }, // +0.5 Housing, +1 Production (Mercantilism), +1 Gold (Synthetic Materials)
  [TerrainImprovementId.PASTURE]: { [YieldId.FOOD]: 1 }, // +0.5 Housing, +1 Food (Exploration), +1 Production (Robotics)
  [TerrainImprovementId.MINE]: { [YieldId.PRODUCTION]: 1 }, // +1 Production (Apprenticeship), +1 Production (Industrialization)
  [TerrainImprovementId.QUARRY]: { [YieldId.PRODUCTION]: 1 }, // +1 Gold (Banking), +1 Production (Rocketry)
  [TerrainImprovementId.PLANTATION]: { [YieldId.GOLD]: 1 }, // +0.5 Housing, +1 Food (Scientific Theory), +1 Gold (Globalization)
  [TerrainImprovementId.LUMBER_MILL]: { [YieldId.PRODUCTION]: 1 }, // +1 Production (Steel), +1 Production if adjacent to a River
  [TerrainImprovementId.FISHING_BOATS]: { [YieldId.FOOD]: 1 }, // +0.5 Housing, +1 Gold (Cartography), +1 Food (Plastics)
  [TerrainImprovementId.SEASIDE_RESORT]: { [YieldId.TOURISM]: 2 }, // +1 Gold per Appeal
  [TerrainImprovementId.OIL_WELL]: { [YieldId.PRODUCTION]: 2 },
  [TerrainImprovementId.OFFSHORE_PLATFORM]: { [YieldId.PRODUCTION]: 2 }
}
