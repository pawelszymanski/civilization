export enum TerrainBaseId {
  GRASSLAND,
  GRASSLAND_HILLS,
  GRASSLAND_MOUNTAIN,
  PLAINS,
  PLAINS_HILLS,
  PLAINS_MOUNTAIN,
  DESERT,
  DESERT_HILLS,
  DESERT_MOUNTAIN,
  TUNDRA,
  TUNDRA_HILLS,
  TUNDRA_MOUNTAIN,
  SNOW,
  SNOW_HILLS,
  SNOW_MOUNTAIN,
  LAKE,
  COAST,
  OCEAN
}

export enum TerrainFeatureId {
  NONE,
  WOODS,
  RAINFOREST,
  MARSH,
  FLOODPLAINS,
  OASIS,
  REEF,
  ICE
}

export enum TerrainResourceId {
  NONE,
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
  ALUMINUM,
  COAL,
  HORSES,
  IRON,
  NITER,
  OIL,
  URANIUM,
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
  // CINNAMON,
  // CLOVES,
  // COSMETICS,
  // JEANS,
  // PERFUME,
  // TOYS,
}

export enum TerrainImprovementId {
  NONE,
  FARM,
  CAMP,
  PASTURE,
  MINE,
  QUARRY,
  PLANTATION,
  LUMBER_MILL,
  FISHING_BOATS,
  SEASIDE_RESORT,
  OIL_WELL,
  OFFSHORE_PLATFORM
  // FORT,
  // ROADS,
  // AIRSTRIP,
  // MISSILE_SILO,
}

export interface Terrain {
  base: TerrainBaseId;
  feature: TerrainFeatureId;
  resource: TerrainResourceId;
  improvement: TerrainImprovementId;
}
