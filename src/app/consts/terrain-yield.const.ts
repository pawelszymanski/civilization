import {TerrainBaseId, TerrainFeatureId} from '../models/terrain';
import {Yield, YieldId} from '../models/yield';

export const TERRAIN_BASE_YIELD: Record<TerrainBaseId, Partial<Yield>> = {
  [TerrainBaseId.GRASSLAND_HILLS]: { [YieldId.FOOD]: 2, [YieldId.PRODUCTION]: 1 },
  [TerrainBaseId.GRASSLAND]: { [YieldId.FOOD]: 2 },
  [TerrainBaseId.PLAINS]: { [YieldId.FOOD]: 1, [YieldId.PRODUCTION]: 1 },
  [TerrainBaseId.PLAINS_HILLS]: { [YieldId.FOOD]: 1, [YieldId.PRODUCTION]: 2 },
  [TerrainBaseId.DESERT]: {},
  [TerrainBaseId.DESERT_HILLS]: { [YieldId.PRODUCTION]: 1 },
  [TerrainBaseId.TUNDRA]: { [YieldId.FOOD]: 1},
  [TerrainBaseId.TUNDRA_HILLS]: { [YieldId.FOOD]: 1, [YieldId.PRODUCTION]: 1 },
  [TerrainBaseId.SNOW]: {},
  [TerrainBaseId.SNOW_HILLS]: { [YieldId.PRODUCTION]: 1 },
  [TerrainBaseId.LAKE]: { [YieldId.FOOD]: 1, [YieldId.GOLD]: 1 },
  [TerrainBaseId.COAST]: { [YieldId.FOOD]: 1, [YieldId.GOLD]: 1 },
  [TerrainBaseId.OCEAN]: { [YieldId.FOOD]: 1 },
  [TerrainBaseId.MOUNTAIN]: {}
}

export const TERRAIN_FEATURE_YIELD: Record<TerrainFeatureId, Partial<Yield>> = {
  [TerrainFeatureId.NONE]: {},
  [TerrainFeatureId.WOODS]: { [YieldId.PRODUCTION]: 1 },
  [TerrainFeatureId.RAINFOREST]: { [YieldId.FOOD]: 1 },
  [TerrainFeatureId.MARSH]: { [YieldId.FOOD]: 1 },
  [TerrainFeatureId.FLOODPLAINS]: { [YieldId.FOOD]: 1 },
  [TerrainFeatureId.OASIS]: { [YieldId.FOOD]: 3, [YieldId.GOLD]: 1 },
  [TerrainFeatureId.REEF]: { [YieldId.FOOD]: 1, [YieldId.PRODUCTION]: 1 },
  [TerrainFeatureId.ICE]: {}
}
