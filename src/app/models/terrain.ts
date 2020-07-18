export enum TerrainBaseId {
  GRASSLAND,
  PLAINS,
  DESERT,
  TUNDRA,
  SNOW,
  LAKE,
  COAST,
  OCEAN,
  ICE
}

export enum TerrainElevationId {
  FLAT,
  HILL,
  MOUNTAIN
}

export enum TerrainFeatureId {
  NONE,
  WOODS,
  RAINFOREST,
  MARSH,
  FLOODPLAINS,
  OASIS,
  REEF
}

export enum TerrainResourceId {
  NONE,
  // ...HORSES, IRON....
}

export interface Terrain {
  base: TerrainBaseId;
  elevation: TerrainElevationId;
  feature: TerrainFeatureId;
  resource: TerrainResourceId;
}
