export enum TerrainBaseId {
  GRASSLAND_FLAT,
  GRASSLAND_HILLS,
  GRASSLAND_MOUNTAIN,
  PLAINS_FLAT,
  PLAINS_HILLS,
  PLAINS_MOUNTAIN,
  DESERT_FLAT,
  DESERT_HILLS,
  DESERT_MOUNTAIN,
  TUNDRA_FLAT,
  TUNDRA_HILLS,
  TUNDRA_MOUNTAIN,
  SNOW_FLAT,
  SNOW_HILLS,
  SNOW_MOUNTAIN,
  LAKE,
  COAST,
  OCEAN
}

export enum TerrainFeatureId {
  NONE,
  FLOODPLAINS,
  ICE,
  MARSH,
  OASIS,
  RAINFOREST,
  REEF,
  WOODS
}

export enum TerrainResourceId {
  NONE,
  // ---
  BANANAS,
  CATTLE,
  COPPER,
  CRABS,
  DEER,
  FISH,
  RICE,
  SHEEP,
  STONE,
  WHEAT,
  // ---
  ALUMINUM,
  COAL,
  HORSES,
  IRON,
  NITER,
  OIL,
  URANIUM,
  // ---
  AMBER,
  CITRUS,
  COCOA,
  COFFEE,
  COTTON,
  DIAMONDS,
  DYES,
  FURS,
  GYPSUM,
  INCENSE,
  IVORY,
  JADE,
  MARBLE,
  MERCURY,
  OLIVES,
  PEARLS,
  SALT,
  SILK,
  SILVER,
  SPICES,
  SUGAR,
  TEA,
  TOBACCO,
  TRUFFLES,
  WHALES,
  WINE
}

export enum OffMapResourceId {
  CINNAMON,
  CLOVES,
  COSMETICS,
  JEANS,
  PERFUME,
  TOYS
}

export enum TerrainImprovementId {
  NONE,
  AIRSTRIP,
  CAMP,
  FARM,
  FISHING_BOATS,
  FORT,
  LUMBER_MILL,
  MINE,
  MISSILE_SILO,
  MOUNTAIN_TUNNEL,
  OFFSHORE_OIL_RIG,
  OFFSHORE_WIND_FARM,
  OIL_WELL,
  PASTURE,
  PLANTATION,
  QUARRY,
  SEASIDE_RESORT,
  SEASTEAD,
  SKI_RESORT,
  SOLAR_FARM,
  WIND_FARM
}

export enum TerrainResourceTypeId {
  BONUS,
  STRATEGIC,
  LUXURY
}

export interface TerrainUi {
  name: string;
  cssClass: string;
}

export interface TerrainUiWithVariations extends TerrainUi {
  cssVariations: number;
}

export interface TerrainBaseWithVariation {
  id: TerrainBaseId;
  variation: number;
}

export interface TerrainFeatureWithVariation {
  id: TerrainFeatureId;
  variation: number;
}

export interface Terrain {
  base: TerrainBaseWithVariation;
  feature: TerrainFeatureWithVariation;
  resourceId: TerrainResourceId;
  improvementId: TerrainImprovementId;
}
