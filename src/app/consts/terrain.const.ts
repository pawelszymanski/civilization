import {
  SuitableTerrain,
  TerrainBaseId,
  TerrainFeatureId,
  TerrainImprovementId,
  TerrainResourceId,
  TerrainResourceTypeId,
  TerrainUiCommon,
  TerrainUiVariantCount
} from '../models/terrain';
import {Yield, YieldId} from '../models/yield';


interface TerrainBase {
  id: TerrainBaseId;
  yield: Partial<Yield>;
  ui: TerrainUiCommon & TerrainUiVariantCount;
}

type TerrainBaseSet = {
  [key in TerrainBaseId]: TerrainBase;
}



interface TerrainFeature {
  id: TerrainFeatureId;
  suitableTerrain: SuitableTerrain[]
  yield: Partial<Yield>;
  ui: TerrainUiCommon & TerrainUiVariantCount;
}

// All but TerrainFeatureId.NONE
type TerrainFeatureSet = Omit<{[key in TerrainFeatureId]: TerrainFeature;}, TerrainFeatureId.NONE>;



interface TerrainResource {
  id: TerrainResourceId;
  type: TerrainResourceTypeId;
  suitableTerrain: SuitableTerrain[]
  yield: Partial<Yield>;
  ui: TerrainUiCommon;
}

// All but TerrainResourceId.NONE
type TerrainResourceSet = Omit<{[key in TerrainResourceId]: TerrainResource;}, TerrainResourceId.NONE>;



interface TerrainImprovement {
  id: TerrainImprovementId;
  suitableTerrain: SuitableTerrain[]
  yield: Partial<Yield>;
  ui: TerrainUiCommon;
}

// All but TerrainImprovementId.NONE
type TerrainImprovementSet = Omit<{[key in TerrainImprovementId]: TerrainImprovement;}, TerrainImprovementId.NONE>;



export const TERRAIN_BASE_SET: TerrainBaseSet = {
  [TerrainBaseId.GRASSLAND_FLAT]: {
    id: TerrainBaseId.GRASSLAND_FLAT,
    yield: { [YieldId.FOOD]: 2 },
    ui: {
      name: 'Grassland',
      class: 'm-base-grassland-flat',
      variantCount: 1,
    },
  },
  [TerrainBaseId.GRASSLAND_HILLS]: {
    id: TerrainBaseId.GRASSLAND_HILLS,
    yield: { [YieldId.FOOD]: 2, [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Grassland (Hills)',
      class: 'm-base-grassland-hills',
      variantCount: 3,
    },
  },
  [TerrainBaseId.GRASSLAND_MOUNTAIN]: {
    id: TerrainBaseId.GRASSLAND_MOUNTAIN,
    yield: {},
    ui: {
      name: 'Grassland (Mountain)',
      class: 'm-base-grassland-mountain',
      variantCount: 5,
    },
  },
  [TerrainBaseId.PLAINS_FLAT]: {
    id: TerrainBaseId.PLAINS_FLAT,
    yield: { [YieldId.FOOD]: 1, [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Plains',
      class: 'm-base-plains-flat',
      variantCount: 1,
    },
  },
  [TerrainBaseId.PLAINS_HILLS]: {
    id: TerrainBaseId.PLAINS_HILLS,
    yield: { [YieldId.FOOD]: 1, [YieldId.PRODUCTION]: 2 },
    ui: {
      name: 'Plains (Hills)',
      class: 'm-base-plains-hills',
      variantCount: 3,
    },
  },
  [TerrainBaseId.PLAINS_MOUNTAIN]: {
    id: TerrainBaseId.PLAINS_MOUNTAIN,
    yield: {},
    ui: {
      name: 'Plains (Mountain)',
      class: 'm-base-plains-mountain',
      variantCount: 5,
    },
  },
  [TerrainBaseId.DESERT_FLAT]: {
    id: TerrainBaseId.DESERT_FLAT,
    yield: {},
    ui: {
      name: 'Desert',
      class: 'm-base-desert-flat',
      variantCount: 1,
    },
  },
  [TerrainBaseId.DESERT_HILLS]: {
    id: TerrainBaseId.DESERT_HILLS,
    yield: { [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Desert (Hills)',
      class: 'm-base-desert-hills',
      variantCount: 3,
    },
  },
  [TerrainBaseId.DESERT_MOUNTAIN]: {
    id: TerrainBaseId.DESERT_MOUNTAIN,
    yield: {},
    ui: {
      name: 'Desert (Mountain)',
      class: 'm-base-desert-mountain',
      variantCount: 5,
    },
  },
  [TerrainBaseId.TUNDRA_FLAT]: {
    id: TerrainBaseId.TUNDRA_FLAT,
    yield: { [YieldId.FOOD]: 1 },
    ui: {
      name: 'Tundra',
      class: 'm-base-tundra-flat',
      variantCount: 1,
    },
  },
  [TerrainBaseId.TUNDRA_HILLS]: {
    id: TerrainBaseId.TUNDRA_HILLS,
    yield: { [YieldId.FOOD]: 1, [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Tundra (Hills)',
      class: 'm-base-tundra-hills',
      variantCount: 3,
    },
  },
  [TerrainBaseId.TUNDRA_MOUNTAIN]: {
    id: TerrainBaseId.TUNDRA_MOUNTAIN,
    yield: {},
    ui: {
      name: 'Tundra (Mountain)',
      class: 'm-base-tundra-mountain',
      variantCount: 5,
    },
  },
  [TerrainBaseId.SNOW_FLAT]: {
    id: TerrainBaseId.SNOW_FLAT,
    yield: {},
    ui: {
      name: 'Snow',
      class: 'm-base-snow-flat',
      variantCount: 1,
    },
  },
  [TerrainBaseId.SNOW_HILLS]: {
    id: TerrainBaseId.SNOW_HILLS,
    yield: { [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Snow (Hills)',
      class: 'm-base-snow-hills',
      variantCount: 3,
    },
  },
  [TerrainBaseId.SNOW_MOUNTAIN]: {
    id: TerrainBaseId.SNOW_MOUNTAIN,
    yield: {},
    ui: {
      name: 'Snow (Mountain)',
      class: 'm-base-snow-mountain',
      variantCount: 5,
    },
  },
  [TerrainBaseId.LAKE]: {
    id: TerrainBaseId.LAKE,
    yield: { [YieldId.FOOD]: 1, [YieldId.GOLD]: 1 },
    ui: {
      name: 'Lake',
      class: 'm-base-lake',
      variantCount: 1,
    },
  },
  [TerrainBaseId.COAST]: {
    id: TerrainBaseId.COAST,
    yield: { [YieldId.FOOD]: 1, [YieldId.GOLD]: 1 },
    ui: {
      name: 'Coast',
      class: 'm-base-coast',
      variantCount: 1,
    },
  },
  [TerrainBaseId.OCEAN]: {
    id: TerrainBaseId.OCEAN,
    yield: { [YieldId.FOOD]: 1 },
    ui: {
      name: 'Ocean',
      class: 'm-base-ocean',
      variantCount: 1,
    },
  }
}
export const TERRAIN_BASE_LIST: TerrainBase[] = Object.keys(TERRAIN_BASE_SET).map(key => TERRAIN_BASE_SET[key]);



// For features suitableTerrain might differ from the original game
export const TERRAIN_FEATURE_SET: TerrainFeatureSet = {
  [TerrainFeatureId.FLOODPLAINS]: {
    id: TerrainFeatureId.FLOODPLAINS,
    suitableTerrain: [
      { baseId: TerrainBaseId.GRASSLAND_FLAT },
      { baseId: TerrainBaseId.PLAINS_FLAT },
      { baseId: TerrainBaseId.DESERT_FLAT },
    ],
    yield: { [YieldId.FOOD]: 1 },
    ui: {
      name: 'Floodplains',
      class: 'm-feature-floodplains',
      variantCount: 1,
    },
  },
  [TerrainFeatureId.ICE]: {
    id: TerrainFeatureId.ICE,
    suitableTerrain: [
      { baseId: TerrainBaseId.COAST },
      { baseId: TerrainBaseId.OCEAN },
    ],
    yield: {},
    ui: {
      name: 'Ice',
      class: 'm-feature-ice',
      variantCount: 1,
    },
  },
  [TerrainFeatureId.MARSH]: {
    id: TerrainFeatureId.MARSH,
    suitableTerrain: [
      { baseId: TerrainBaseId.GRASSLAND_FLAT },
    ],
    yield: { [YieldId.FOOD]: 1 },
    ui: {
      name: 'Marsh',
      class: 'm-feature-marsh',
      variantCount: 1,
    },
  },
  [TerrainFeatureId.OASIS]: {
    id: TerrainFeatureId.OASIS,
    suitableTerrain: [
      { baseId: TerrainBaseId.DESERT_FLAT },
    ],
    yield: { [YieldId.FOOD]: 3, [YieldId.GOLD]: 1 },
    ui: {
      name: 'Oasis',
      class: 'm-feature-oasis',
      variantCount: 1,
    },
  },
  [TerrainFeatureId.RAINFOREST]: {
    id: TerrainFeatureId.RAINFOREST,
    suitableTerrain: [
      { baseId: TerrainBaseId.PLAINS_FLAT },
      { baseId: TerrainBaseId.PLAINS_HILLS },
    ],
    yield: { [YieldId.FOOD]: 1 },
    ui: {
      name: 'Rainforest',
      class: 'm-feature-rainforest',
      variantCount: 1,
    },
  },
  [TerrainFeatureId.REEF]: {
    id: TerrainFeatureId.REEF,
    suitableTerrain: [
      { baseId: TerrainBaseId.OCEAN },
    ],
    yield: { [YieldId.FOOD]: 1, [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Reef',
      class: 'm-feature-reef',
      variantCount: 1,
    },
  },
  [TerrainFeatureId.WOODS]: {
    id: TerrainFeatureId.WOODS,
    suitableTerrain: [
      { baseId: TerrainBaseId.GRASSLAND_FLAT },
      { baseId: TerrainBaseId.GRASSLAND_HILLS },
      { baseId: TerrainBaseId.PLAINS_FLAT },
      { baseId: TerrainBaseId.PLAINS_HILLS },
      { baseId: TerrainBaseId.TUNDRA_FLAT },
      { baseId: TerrainBaseId.TUNDRA_HILLS },
    ],
    yield: { [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Woods',
      class: 'm-feature-woods',
      variantCount: 1,
    },
  }
}
export const TERRAIN_FEATURE_LIST: TerrainFeature[] = Object.keys(TERRAIN_FEATURE_SET).map(key => TERRAIN_FEATURE_SET[key]);



export const TERRAIN_RESOURCE_SET: TerrainResourceSet = {
  [TerrainResourceId.BANANAS]: {
    id: TerrainResourceId.BANANAS,
    type: TerrainResourceTypeId.BONUS,
    suitableTerrain: [
      { featureId: TerrainFeatureId.RAINFOREST },
    ],
    yield: {  [YieldId.FOOD]: 1 },
    ui: {
      name: 'Bananas',
      class: 'm-resource-bananas',
    },
  },
  [TerrainResourceId.CATTLE]: {
    id: TerrainResourceId.CATTLE,
    type: TerrainResourceTypeId.BONUS,
    suitableTerrain: [
      { baseId: TerrainBaseId.GRASSLAND_FLAT, featureId: TerrainFeatureId.NONE },
    ],
    yield: { [YieldId.FOOD]: 1 },
    ui: {
      name: 'Cattle',
      class: 'm-resource-cattle',
    },
  },
  [TerrainResourceId.COPPER]: {
    id: TerrainResourceId.COPPER,
    type: TerrainResourceTypeId.BONUS,
    suitableTerrain: [
      { baseId: TerrainBaseId.GRASSLAND_HILLS, featureId: TerrainFeatureId.NONE },
      { baseId: TerrainBaseId.PLAINS_HILLS, featureId: TerrainFeatureId.NONE },
      { baseId: TerrainBaseId.DESERT_HILLS, featureId: TerrainFeatureId.NONE },
      { baseId: TerrainBaseId.TUNDRA_HILLS, featureId: TerrainFeatureId.NONE },
      { baseId: TerrainBaseId.SNOW_HILLS, featureId: TerrainFeatureId.NONE },
    ],
    yield: { [YieldId.GOLD]: 2 },
    ui: {
      name: 'Copper',
      class: 'm-resource-copper',
    },
  },
  [TerrainResourceId.CRABS]: {
    id: TerrainResourceId.CRABS,
    type: TerrainResourceTypeId.BONUS,
    suitableTerrain: [
      { baseId: TerrainBaseId.LAKE, featureId: TerrainFeatureId.NONE },
      { baseId: TerrainBaseId.COAST, featureId: TerrainFeatureId.NONE },
    ],
    yield: { [YieldId.GOLD]: 2 },
    ui: {
      name: 'Crabs',
      class: 'm-resource-crabs',
    },
  },
  [TerrainResourceId.DEER]: {
    id: TerrainResourceId.DEER,
    type: TerrainResourceTypeId.BONUS,
    suitableTerrain: [
      { baseId: TerrainBaseId.TUNDRA_FLAT, featureId: TerrainFeatureId.NONE },
      { featureId: TerrainFeatureId.WOODS },
    ],
    yield: { [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Deer',
      class: 'm-resource-deer',
    },
  },
  [TerrainResourceId.FISH]: {
    id: TerrainResourceId.FISH,
    type: TerrainResourceTypeId.BONUS,
    suitableTerrain: [
      { baseId: TerrainBaseId.LAKE },
      { baseId: TerrainBaseId.COAST },
    ],
    yield: {  [YieldId.FOOD]: 1 },
    ui: {
      name: 'Fish',
      class: 'm-resource-fish',
    },
  },
  [TerrainResourceId.RICE]: {
    id: TerrainResourceId.RICE,
    type: TerrainResourceTypeId.BONUS,
    suitableTerrain: [
      { baseId: TerrainBaseId.GRASSLAND_FLAT, featureId: TerrainFeatureId.NONE },
      { featureId: TerrainFeatureId.FLOODPLAINS },
      { featureId: TerrainFeatureId.MARSH },
    ],
    yield: {  [YieldId.FOOD]: 1 },
    ui: {
      name: 'Rice',
      class: 'm-resource-rice',
    },
  },
  [TerrainResourceId.SHEEP]: {
    id: TerrainResourceId.SHEEP,
    type: TerrainResourceTypeId.BONUS,
    suitableTerrain: [
      { baseId: TerrainBaseId.GRASSLAND_HILLS, featureId: TerrainFeatureId.NONE },
      { baseId: TerrainBaseId.PLAINS_HILLS, featureId: TerrainFeatureId.NONE },
      { baseId: TerrainBaseId.DESERT_HILLS, featureId: TerrainFeatureId.NONE },
      { baseId: TerrainBaseId.TUNDRA_HILLS, featureId: TerrainFeatureId.NONE },
    ],
    yield: {  [YieldId.FOOD]: 1 },
    ui: {
      name: 'Sheep',
      class: 'm-resource-sheep',
    },
  },
  [TerrainResourceId.STONE]: {
    id: TerrainResourceId.STONE,
    type: TerrainResourceTypeId.BONUS,
    suitableTerrain: [
      { baseId: TerrainBaseId.GRASSLAND_FLAT, featureId: TerrainFeatureId.NONE },
      { baseId: TerrainBaseId.GRASSLAND_HILLS, featureId: TerrainFeatureId.NONE },
    ],
    yield: { [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Stone',
      class: 'm-resource-stone',
    },
  },
  [TerrainResourceId.WHEAT]: {
    id: TerrainResourceId.WHEAT,
    type: TerrainResourceTypeId.BONUS,
    suitableTerrain: [
      { baseId: TerrainBaseId.PLAINS_FLAT, featureId: TerrainFeatureId.NONE },
      { baseId: TerrainBaseId.PLAINS_FLAT, featureId: TerrainFeatureId.FLOODPLAINS },
      { baseId: TerrainBaseId.DESERT_FLAT, featureId: TerrainFeatureId.FLOODPLAINS },
    ],
    yield: { [YieldId.FOOD]: 1 },
    ui: {
      name: 'Wheat',
      class: 'm-resource-wheat',
    },
  },
  [TerrainResourceId.ALUMINUM]: {
    id: TerrainResourceId.ALUMINUM,
    type: TerrainResourceTypeId.STRATEGIC,
    suitableTerrain: [
      { baseId: TerrainBaseId.PLAINS_HILLS },
      { baseId: TerrainBaseId.DESERT_HILLS },
    ],
    yield: { [YieldId.SCIENCE]: 1 },
    ui: {
      name: 'Aluminum',
      class: 'm-resource-aluminum',
    },
  },
  [TerrainResourceId.COAL]: {
    id: TerrainResourceId.COAL,
    type: TerrainResourceTypeId.STRATEGIC,
    suitableTerrain: [
      { baseId: TerrainBaseId.GRASSLAND_HILLS },
      { baseId: TerrainBaseId.PLAINS_HILLS },
    ],
    yield: { [YieldId.PRODUCTION]: 2 },
    ui: {
      name: 'Coal',
      class: 'm-resource-coal',
    },
  },
  [TerrainResourceId.HORSES]: {
    id: TerrainResourceId.HORSES,
    type: TerrainResourceTypeId.STRATEGIC,
    suitableTerrain: [
      { baseId: TerrainBaseId.GRASSLAND_FLAT, featureId: TerrainFeatureId.NONE },
      { baseId: TerrainBaseId.PLAINS_FLAT, featureId: TerrainFeatureId.NONE },
    ],
    yield: { [YieldId.FOOD]: 1, [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Horses',
      class: 'm-resource-horses',
    },
  },
  [TerrainResourceId.IRON]: {
    id: TerrainResourceId.IRON,
    type: TerrainResourceTypeId.STRATEGIC,
    suitableTerrain: [
      { baseId: TerrainBaseId.GRASSLAND_HILLS },
      { baseId: TerrainBaseId.PLAINS_HILLS },
      { baseId: TerrainBaseId.DESERT_HILLS },
      { baseId: TerrainBaseId.TUNDRA_HILLS },
    ],
    yield: { [YieldId.SCIENCE]: 1 },
    ui: {
      name: 'Iron',
      class: 'm-resource-iron',
    },
  },
  [TerrainResourceId.NITER]: {
    id: TerrainResourceId.NITER,
    type: TerrainResourceTypeId.STRATEGIC,
    suitableTerrain: [
      { baseId: TerrainBaseId.GRASSLAND_FLAT },
      { baseId: TerrainBaseId.PLAINS_FLAT },
      { baseId: TerrainBaseId.DESERT_FLAT },
      { baseId: TerrainBaseId.TUNDRA_FLAT },
    ],
    yield: { [YieldId.FOOD]: 1, [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Niter',
      class: 'm-resource-niter',
    },
  },
  [TerrainResourceId.OIL]: {
    id: TerrainResourceId.OIL,
    type: TerrainResourceTypeId.STRATEGIC,
    suitableTerrain: [
      { baseId: TerrainBaseId.GRASSLAND_FLAT },
      { baseId: TerrainBaseId.GRASSLAND_HILLS },
      { baseId: TerrainBaseId.PLAINS_FLAT },
      { baseId: TerrainBaseId.PLAINS_HILLS },
      { baseId: TerrainBaseId.DESERT_FLAT },
      { baseId: TerrainBaseId.DESERT_HILLS },
      { baseId: TerrainBaseId.TUNDRA_FLAT },
      { baseId: TerrainBaseId.TUNDRA_HILLS },
      { baseId: TerrainBaseId.SNOW_FLAT },
      { baseId: TerrainBaseId.SNOW_HILLS },
      { baseId: TerrainBaseId.COAST },
    ],
    yield: { [YieldId.PRODUCTION]: 3 },
    ui: {
      name: 'Oil',
      class: 'm-resource-oil',
    },
  },
  [TerrainResourceId.URANIUM]: {
    id: TerrainResourceId.URANIUM,
    type: TerrainResourceTypeId.STRATEGIC,
    suitableTerrain: [
      { baseId: TerrainBaseId.GRASSLAND_FLAT },
      { baseId: TerrainBaseId.GRASSLAND_HILLS },
      { baseId: TerrainBaseId.PLAINS_FLAT },
      { baseId: TerrainBaseId.PLAINS_HILLS },
      { baseId: TerrainBaseId.DESERT_FLAT },
      { baseId: TerrainBaseId.DESERT_HILLS },
      { baseId: TerrainBaseId.TUNDRA_FLAT },
      { baseId: TerrainBaseId.TUNDRA_HILLS },
      { baseId: TerrainBaseId.SNOW_FLAT },
      { baseId: TerrainBaseId.SNOW_HILLS },
    ],
    yield: { [YieldId.PRODUCTION]: 2 },
    ui: {
      name: 'Uranium',
      class: 'm-resource-uranium',
    },
  },
  [TerrainResourceId.AMBER]: {
    id: TerrainResourceId.AMBER,
    type: TerrainResourceTypeId.LUXURY,
    suitableTerrain: [
      { baseId: TerrainBaseId.LAKE },
      { baseId: TerrainBaseId.COAST },
      { featureId: TerrainFeatureId.RAINFOREST },
      { featureId: TerrainFeatureId.WOODS },
    ],
    yield: { [YieldId.CULTURE]: 1 },
    ui: {
      name: 'Amber',
      class: 'm-resource-amber',
    },
  },
  [TerrainResourceId.CITRUS]: {
    id: TerrainResourceId.CITRUS,
    type: TerrainResourceTypeId.LUXURY,
    suitableTerrain: [
      { baseId: TerrainBaseId.GRASSLAND_FLAT, featureId: TerrainFeatureId.NONE },
      { baseId: TerrainBaseId.PLAINS_FLAT, featureId: TerrainFeatureId.NONE },
    ],
    yield: { [YieldId.FOOD]: 2 },
    ui: {
      name: 'Citrus',
      class: 'm-resource-citrus',
    },
  },
  [TerrainResourceId.COCOA]: {
    id: TerrainResourceId.COCOA,
    type: TerrainResourceTypeId.LUXURY,
    suitableTerrain: [
      { featureId: TerrainFeatureId.RAINFOREST },
    ],
    yield: { [YieldId.GOLD]: 3 },
    ui: {
      name: 'Cocoa',
      class: 'm-resource-cocoa',
    },
  },
  [TerrainResourceId.COFFEE]: {
    id: TerrainResourceId.COFFEE,
    type: TerrainResourceTypeId.LUXURY,
    suitableTerrain: [
      { baseId: TerrainBaseId.GRASSLAND_FLAT, featureId: TerrainFeatureId.NONE },
      { featureId: TerrainFeatureId.RAINFOREST },
    ],
    yield: { [YieldId.CULTURE]: 1 },
    ui: {
      name: 'Coffee',
      class: 'm-resource-coffee',
    },
  },
  [TerrainResourceId.COTTON]: {
    id: TerrainResourceId.COTTON,
    type: TerrainResourceTypeId.LUXURY,
    suitableTerrain: [
      { baseId: TerrainBaseId.GRASSLAND_FLAT, featureId: TerrainFeatureId.NONE },
      { baseId: TerrainBaseId.PLAINS_FLAT, featureId: TerrainFeatureId.NONE },
      { featureId: TerrainFeatureId.FLOODPLAINS },
    ],
    yield: { [YieldId.GOLD]: 3 },
    ui: {
      name: 'Cotton',
      class: 'm-resource-cotton',
    },
  },
  [TerrainResourceId.DIAMONDS]: {
    id: TerrainResourceId.DIAMONDS,
    type: TerrainResourceTypeId.LUXURY,
    suitableTerrain: [
      { baseId: TerrainBaseId.GRASSLAND_HILLS },
      { baseId: TerrainBaseId.PLAINS_HILLS },
      { baseId: TerrainBaseId.DESERT_HILLS },
      { baseId: TerrainBaseId.TUNDRA_HILLS },
      { featureId: TerrainFeatureId.RAINFOREST },
    ],
    yield: { [YieldId.GOLD]: 3 },
    ui: {
      name: 'Diamonds',
      class: 'm-resource-diamonds',
    },
  },
  [TerrainResourceId.DYES]: {
    id: TerrainResourceId.DYES,
    type: TerrainResourceTypeId.LUXURY,
    suitableTerrain: [
      { featureId: TerrainFeatureId.RAINFOREST },
      { featureId: TerrainFeatureId.WOODS },
    ],
    yield: { [YieldId.FAITH]: 1 },
    ui: {
      name: 'Dyes',
      class: 'm-resource-dyes',
    },
  },
  [TerrainResourceId.FURS]: {
    id: TerrainResourceId.FURS,
    type: TerrainResourceTypeId.LUXURY,
    suitableTerrain: [
      { baseId: TerrainBaseId.TUNDRA_FLAT },
      { baseId: TerrainBaseId.TUNDRA_HILLS },
      { featureId: TerrainFeatureId.WOODS },
    ],
    yield: { [YieldId.FOOD]: 1, [YieldId.GOLD]: 1 },
    ui: {
      name: 'Furs',
      class: 'm-resource-furs',
    },
  },
  [TerrainResourceId.GYPSUM]: {
    id: TerrainResourceId.GYPSUM,
    type: TerrainResourceTypeId.LUXURY,
    suitableTerrain: [
      { baseId: TerrainBaseId.PLAINS_FLAT },
      { baseId: TerrainBaseId.PLAINS_HILLS },
      { baseId: TerrainBaseId.DESERT_HILLS },
      { baseId: TerrainBaseId.TUNDRA_HILLS },
    ],
    yield: { [YieldId.PRODUCTION]: 1, [YieldId.GOLD]: 1 },
    ui: {
      name: 'Gypsum',
      class: 'm-resource-gypsum',
    },
  },
  [TerrainResourceId.INCENSE]: {
    id: TerrainResourceId.INCENSE,
    type: TerrainResourceTypeId.LUXURY,
    suitableTerrain: [
      { baseId: TerrainBaseId.PLAINS_FLAT },
      { baseId: TerrainBaseId.DESERT_FLAT, featureId: TerrainFeatureId.NONE },
    ],
    yield: { [YieldId.FAITH]: 1 },
    ui: {
      name: 'Incense',
      class: 'm-resource-incense',
    },
  },
  [TerrainResourceId.IVORY]: {
    id: TerrainResourceId.IVORY,
    type: TerrainResourceTypeId.LUXURY,
    suitableTerrain: [
      { baseId: TerrainBaseId.PLAINS_FLAT, featureId: TerrainFeatureId.NONE },
      { baseId: TerrainBaseId.PLAINS_HILLS, featureId: TerrainFeatureId.NONE },
      { baseId: TerrainBaseId.DESERT_FLAT, featureId: TerrainFeatureId.NONE },
      { featureId: TerrainFeatureId.RAINFOREST },
      { featureId: TerrainFeatureId.WOODS },
    ],
    yield: { [YieldId.PRODUCTION]: 1, [YieldId.GOLD]: 1 },
    ui: {
      name: 'Ivory',
      class: 'm-resource-ivory',
    },
  },
  [TerrainResourceId.JADE]: {
    id: TerrainResourceId.JADE,
    type: TerrainResourceTypeId.LUXURY,
    suitableTerrain: [
      { baseId: TerrainBaseId.GRASSLAND_FLAT, featureId: TerrainFeatureId.NONE },
      { baseId: TerrainBaseId.PLAINS_FLAT, featureId: TerrainFeatureId.NONE },
      { baseId: TerrainBaseId.TUNDRA_FLAT, featureId: TerrainFeatureId.NONE },
    ],
    yield: { [YieldId.CULTURE]: 1 },
    ui: {
      name: 'Jade',
      class: 'm-resource-jade',
    },
  },
  [TerrainResourceId.MARBLE]: {
    id: TerrainResourceId.MARBLE,
    type: TerrainResourceTypeId.LUXURY,
    suitableTerrain: [
      { baseId: TerrainBaseId.GRASSLAND_FLAT, featureId: TerrainFeatureId.NONE },
      { baseId: TerrainBaseId.GRASSLAND_HILLS, featureId: TerrainFeatureId.NONE },
      { baseId: TerrainBaseId.PLAINS_HILLS, featureId: TerrainFeatureId.NONE },
    ],
    yield: { [YieldId.CULTURE]: 1 },
    ui: {
      name: 'marble',
      class: 'm-resource-marble',
    },
  },
  [TerrainResourceId.MERCURY]: {
    id: TerrainResourceId.MERCURY,
    type: TerrainResourceTypeId.LUXURY,
    suitableTerrain: [
      { baseId: TerrainBaseId.PLAINS_FLAT, featureId: TerrainFeatureId.NONE },
    ],
    yield: { [YieldId.SCIENCE]: 1 },
    ui: {
      name: 'Mercury',
      class: 'm-resource-mercury',
    },
  },
  [TerrainResourceId.OLIVES]: {
    id: TerrainResourceId.OLIVES,
    type: TerrainResourceTypeId.LUXURY,
    suitableTerrain: [
      { baseId: TerrainBaseId.GRASSLAND_FLAT, featureId: TerrainFeatureId.NONE },
    ],
    yield: { [YieldId.PRODUCTION]: 1, [YieldId.GOLD]: 1 },
    ui: {
      name: 'Olives',
      class: 'm-resource-olives',
    },
  },
  [TerrainResourceId.PEARLS]: {
    id: TerrainResourceId.PEARLS,
    type: TerrainResourceTypeId.LUXURY,
    suitableTerrain: [
      { baseId: TerrainBaseId.LAKE },
      { baseId: TerrainBaseId.COAST },
    ],
    yield: { [YieldId.FAITH]: 1 },
    ui: {
      name: 'Pearls',
      class: 'm-resource-pearls',
    },
  },
  [TerrainResourceId.SALT]: {
    id: TerrainResourceId.SALT,
    type: TerrainResourceTypeId.LUXURY,
    suitableTerrain: [
      { baseId: TerrainBaseId.PLAINS_FLAT, featureId: TerrainFeatureId.NONE },
      { baseId: TerrainBaseId.DESERT_FLAT, featureId: TerrainFeatureId.NONE },
      { baseId: TerrainBaseId.TUNDRA_FLAT, featureId: TerrainFeatureId.NONE },
    ],
    yield: { [YieldId.FOOD]: 1, [YieldId.GOLD]: 1 },
    ui: {
      name: 'Salt',
      class: 'm-resource-salt',
    },
  },
  [TerrainResourceId.SILK]: {
    id: TerrainResourceId.SILK,
    type: TerrainResourceTypeId.LUXURY,
    suitableTerrain: [
      { baseId: TerrainBaseId.GRASSLAND_FLAT, featureId: TerrainFeatureId.WOODS },
      { baseId: TerrainBaseId.GRASSLAND_HILLS, featureId: TerrainFeatureId.WOODS },
      { baseId: TerrainBaseId.PLAINS_FLAT, featureId: TerrainFeatureId.WOODS },
      { baseId: TerrainBaseId.PLAINS_HILLS, featureId: TerrainFeatureId.WOODS },
      { baseId: TerrainBaseId.TUNDRA_FLAT, featureId: TerrainFeatureId.WOODS },
      { baseId: TerrainBaseId.TUNDRA_HILLS, featureId: TerrainFeatureId.WOODS },
    ],
    yield: { [YieldId.CULTURE]: 1 },
    ui: {
      name: 'Silk',
      class: 'm-resource-silk',
    },
  },
  [TerrainResourceId.SILVER]: {
    id: TerrainResourceId.SILVER,
    type: TerrainResourceTypeId.LUXURY,
    suitableTerrain: [
      { baseId: TerrainBaseId.DESERT_FLAT, featureId: TerrainFeatureId.NONE },
      { baseId: TerrainBaseId.DESERT_HILLS },
      { baseId: TerrainBaseId.TUNDRA_FLAT },
      { baseId: TerrainBaseId.TUNDRA_HILLS },
    ],
    yield: { [YieldId.GOLD]: 3 },
    ui: {
      name: 'Silver',
      class: 'm-resource-silver',
    },
  },
  [TerrainResourceId.SPICES]: {
    id: TerrainResourceId.SPICES,
    type: TerrainResourceTypeId.LUXURY,
    suitableTerrain: [
      { featureId: TerrainFeatureId.RAINFOREST },
      { featureId: TerrainFeatureId.WOODS },
    ],
    yield: { [YieldId.FOOD]: 2 },
    ui: {
      name:'Spices',
      class: 'm-resource-spices',
    },
  },
  [TerrainResourceId.SUGAR]: {
    id: TerrainResourceId.SUGAR,
    type: TerrainResourceTypeId.LUXURY,
    suitableTerrain: [
      { featureId: TerrainFeatureId.FLOODPLAINS },
      { featureId: TerrainFeatureId.MARSH },
    ],
    yield: { [YieldId.FOOD]: 2 },
    ui: {
      name: 'Sugar',
      class: 'm-resource-sugar',
    },
  },
  [TerrainResourceId.TEA]: {
    id: TerrainResourceId.TEA,
    type: TerrainResourceTypeId.LUXURY,
    suitableTerrain: [
      { baseId: TerrainBaseId.GRASSLAND_FLAT, featureId: TerrainFeatureId.NONE },
      { baseId: TerrainBaseId.PLAINS_FLAT, featureId: TerrainFeatureId.NONE },
      { featureId: TerrainFeatureId.RAINFOREST },
      { featureId: TerrainFeatureId.WOODS },
    ],
    yield: { [YieldId.SCIENCE]: 1 },
    ui: {
      name: 'Tea',
      class: 'm-resource-tea',
    },
  },
  [TerrainResourceId.TOBACCO]: {
    id: TerrainResourceId.TOBACCO,
    type: TerrainResourceTypeId.LUXURY,
    suitableTerrain: [
      { baseId: TerrainBaseId.GRASSLAND_FLAT, featureId: TerrainFeatureId.NONE },
    ],
    yield: { [YieldId.FAITH]: 1 },
    ui: {
      name: 'Tobacco',
      class: 'm-resource-tobacco',
    },
  },
  [TerrainResourceId.TRUFFLES]: {
    id: TerrainResourceId.TRUFFLES,
    type: TerrainResourceTypeId.LUXURY,
    suitableTerrain: [
      { featureId: TerrainFeatureId.MARSH },
      { featureId: TerrainFeatureId.RAINFOREST },
      { featureId: TerrainFeatureId.WOODS },
    ],
    yield: { [YieldId.GOLD]: 3 },
    ui: {
      name: 'Truffles',
      class: 'm-resource-truffles',
    },
  },
  [TerrainResourceId.WHALES]: {
    id: TerrainResourceId.WHALES,
    type: TerrainResourceTypeId.LUXURY,
    suitableTerrain: [
      { baseId: TerrainBaseId.COAST },
      { baseId: TerrainBaseId.OCEAN },
    ],
    yield: { [YieldId.FOOD]: 1, [YieldId.GOLD]: 1 },
    ui: {
      name: 'Whales',
      class: 'm-resource-whales',
    },
  },
  [TerrainResourceId.WINE]: {
    id: TerrainResourceId.WINE,
    type: TerrainResourceTypeId.LUXURY,
    suitableTerrain: [
      { baseId: TerrainBaseId.GRASSLAND_FLAT, featureId: TerrainFeatureId.NONE },
      { baseId: TerrainBaseId.GRASSLAND_HILLS, featureId: TerrainFeatureId.NONE },
      { baseId: TerrainBaseId.PLAINS_FLAT, featureId: TerrainFeatureId.NONE },
      { baseId: TerrainBaseId.PLAINS_HILLS, featureId: TerrainFeatureId.NONE },
    ],
    yield: { [YieldId.FOOD]: 1, [YieldId.GOLD]: 1 },
    ui: {
      name: 'Wine',
      class: 'm-resource-wine',
    },
  }
}
export const TERRAIN_RESOURCE_LIST: TerrainResource[] = Object.keys(TERRAIN_RESOURCE_SET).map(key => TERRAIN_RESOURCE_SET[key]);



export const TERRAIN_IMPROVEMENT_SET: TerrainImprovementSet = {
  // -1 Appeal
  [TerrainImprovementId.AIRSTRIP]: {
    id: TerrainImprovementId.AIRSTRIP,
    suitableTerrain: [],
    yield: {},
    ui: {
      name: 'Airstrip',
      class: 'm-improvement-airstrip',
    },
  },
  // +0.5 Housing, +1 Food (Mercantilism), +1 Production (Mercantilism), +1 Gold (Synthetic Materials)
  [TerrainImprovementId.CAMP]: {
    id: TerrainImprovementId.CAMP,
    suitableTerrain: [],
    yield: { [YieldId.GOLD]: 2 },
    ui: {
      name: 'Camp',
      class: 'm-improvement-camp',
    },
  },
  // +0.5 Housing, +1 Food per 2 adjacent Farms (Feudalism until Replaceable Parts), +1 Food per adjacent Farm (Replaceable Parts)
  [TerrainImprovementId.FARM]: {
    id: TerrainImprovementId.FARM,
    suitableTerrain: [],
    yield: { [YieldId.FOOD]: 1 },
    ui: {
      name: 'Farm',
      class: 'm-improvement-farm',
    },
  },
  // +0.5 Housing, +2 Gold (Cartography), +1 Food (Plastics)
  [TerrainImprovementId.FISHING_BOATS]: {
    id: TerrainImprovementId.FISHING_BOATS,
    suitableTerrain: [],
    yield: { [YieldId.FOOD]: 1 },
    ui: {
      name: 'Fishing Boats',
      class: 'm-improvement-fishing-boats',
    },
  },
  [TerrainImprovementId.FORT]: {
    id: TerrainImprovementId.FORT,
    suitableTerrain: [],
    yield: {},
    ui: {
      name: 'Fort',
      class: 'm-improvement-fort',
    },
  },
  // +1 Production (Steel), +1 Production (Cybernetics)
  [TerrainImprovementId.LUMBER_MILL]: {
    id: TerrainImprovementId.LUMBER_MILL,
    suitableTerrain: [],
    yield: { [YieldId.PRODUCTION]: 2 },
    ui: {
      name: 'Lumber Mill',
      class: 'm-improvement-lumber-mill',
    },
  },
  // -1 Appeal, +1 Production (Apprenticeship), +1 Production (Industrialization), +1 Production (Smart materials),
  [TerrainImprovementId.MINE]: {
    id: TerrainImprovementId.MINE,
    suitableTerrain: [],
    yield: { [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Mine',
      class: 'm-improvement-mine',
    },
  },
  [TerrainImprovementId.MISSILE_SILO]: {
    id: TerrainImprovementId.MISSILE_SILO,
    suitableTerrain: [],
    yield: {},
    ui: {
      name: 'Missile Silo',
      class: 'm-improvement-missile-silo',
    },
  },
  [TerrainImprovementId.MOUNTAIN_TUNNEL]: {
    id: TerrainImprovementId.MOUNTAIN_TUNNEL,
    suitableTerrain: [],
    yield: {},
    ui: {
      name: 'Mountain Tunnel',
      class: 'm-improvement-mountain-tunnel',
    },
  },
  // -1 Appeal
  [TerrainImprovementId.OFFSHORE_OIL_RIG]: {
    id: TerrainImprovementId.OFFSHORE_OIL_RIG,
    suitableTerrain: [],
    yield: { [YieldId.PRODUCTION]: 2 },
    ui: {
      name: 'Offshore Oil Rig',
      class: 'm-improvement-offshore-oil-rig',
    },
  },
  [TerrainImprovementId.OFFSHORE_WIND_FARM]: {
    id: TerrainImprovementId.OFFSHORE_WIND_FARM,
    suitableTerrain: [],
    yield: { [YieldId.PRODUCTION]: 1, [YieldId.GOLD]: 1, [YieldId.POWER]: 2 },
    ui: {
      name: 'Offshore Wind Farm',
      class: 'm-improvement-offshore-wind-farm',
    },
  },
  // -1 Appeal
  [TerrainImprovementId.OIL_WELL]: {
    id: TerrainImprovementId.OIL_WELL,
    suitableTerrain: [],
    yield: { [YieldId.PRODUCTION]: 2 },
    ui: {
      name: 'Oil Well',
      class: 'm-improvement-oil-well',
    },
  },
  // +0.5 Housing, +1 Food (Exploration), +1 Production (Robotics)
  [TerrainImprovementId.PASTURE]: {
    id: TerrainImprovementId.PASTURE,
    suitableTerrain: [],
    yield: { [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Pasture',
      class: 'm-improvement-pasture',
    },
  },
  // +0.5 Housing, +1 Food (Scientific Theory), +2 Gold (Globalization)
  [TerrainImprovementId.PLANTATION]: {
    id: TerrainImprovementId.PLANTATION,
    suitableTerrain: [],
    yield: { [YieldId.GOLD]: 2 },
    ui: {
      name: 'Plantation',
      class: 'm-improvement-plantation',
    },
  },
  // -1 Appeal, +1 Production (Gunpowder), +1 Production (Rocketry), +1 Production (Predictive systems)
  [TerrainImprovementId.QUARRY]: {
    id: TerrainImprovementId.QUARRY,
    suitableTerrain: [],
    yield: { [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Quarry',
      class: 'm-improvement-quarry',
    },
  },
  // Appeal x1 to gold, Appeal x 2 to tourism
  [TerrainImprovementId.SEASIDE_RESORT]: {
    id: TerrainImprovementId.SEASIDE_RESORT,
    suitableTerrain: [],
    yield: {},
    ui: {
      name: 'Seaside Resort',
      class: 'm-improvement-seaside-resort',
    },
  },
  // +1 Production from each adjacent Fishing Boat, Fishing Boats receive +1 Production from each adjacent Seastead, +1 Culture and Tourism for each adjacent Reef, +2 Housing.
  [TerrainImprovementId.SEASTEAD]: {
    id: TerrainImprovementId.SEASTEAD,
    suitableTerrain: [],
    yield: { [YieldId.FOOD]: 1 },
    ui: {
      name: 'Seastead',
      class: 'm-improvement-seastead',
    },
  },
  // +1 Amenities, Provides Tourism equal to the tile's Appeal
  [TerrainImprovementId.SKI_RESORT]: {
    id: TerrainImprovementId.SKI_RESORT,
    suitableTerrain: [],
    yield: {},
    ui: {
      name: 'Ski Resort',
      class: 'm-improvement-ski-resort',
    },
  },
  [TerrainImprovementId.SOLAR_FARM]: {
    id: TerrainImprovementId.SOLAR_FARM,
    suitableTerrain: [],
    yield: { [YieldId.PRODUCTION]: 1, [YieldId.GOLD]: 1, [YieldId.POWER]: 2 },
    ui: {
      name: 'Solar Farm',
      class: 'm-improvement-solar-farm',
    },
  },
  [TerrainImprovementId.WIND_FARM]: {
    id: TerrainImprovementId.WIND_FARM,
    suitableTerrain: [],
    yield: { [YieldId.PRODUCTION]: 1, [YieldId.GOLD]: 1, [YieldId.POWER]: 2 },
    ui: {
      name: 'Wind Farm',
      class: 'm-improvement-wind-farm',
    },
  }
}
export const TERRAIN_IMPROVEMENT_LIST: TerrainImprovement[] = Object.keys(TERRAIN_IMPROVEMENT_SET).map(key => TERRAIN_IMPROVEMENT_SET[key]);
