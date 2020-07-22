export enum TerrainBaseId {
  GRASSLAND,
  GRASSLAND_HILLS,
  PLAINS,
  PLAINS_HILLS,
  DESERT,
  DESERT_HILLS,
  TUNDRA,
  TUNDRA_HILLS,
  SNOW,
  SNOW_HILLS,
  LAKE,
  COAST,
  OCEAN,
  MOUNTAIN
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
  // ...HORSES, IRON....
}

export interface Terrain {
  base: TerrainBaseId;
  feature: TerrainFeatureId;
  resource?: TerrainResourceId;
}
