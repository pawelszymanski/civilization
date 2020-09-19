import {
  TerrainBaseId,
  TerrainFeatureId,
  TerrainResourceId,
  TerrainImprovementId,
  TerrainResourceTypeId,
  TerrainUiCommon,
  TerrainUiColor,
  TerrainUiVariants
} from '../models/terrain';
import {Yield, YieldId} from '../models/yield';



interface TerrainBase {
  id: TerrainBaseId;
  yield: Partial<Yield>;
  ui: TerrainUiCommon & TerrainUiColor & TerrainUiVariants;
}

type TerrainBaseSet = {
  [key in TerrainBaseId]: TerrainBase;
}



interface TerrainFeature {
  id: TerrainFeatureId;
  yield: Partial<Yield>;
  ui: TerrainUiCommon & TerrainUiVariants;
}

// All but TerrainFeatureId.NONE
type TerrainFeatureSet = Omit<{[key in TerrainFeatureId]: TerrainFeature;}, TerrainFeatureId.NONE>;



interface TerrainResource {
  id: TerrainResourceId;
  type: TerrainResourceTypeId;
  yield: Partial<Yield>;
  ui: TerrainUiCommon;
}

// All but TerrainResourceId.NONE
type TerrainResourceSet = Omit<{[key in TerrainResourceId]: TerrainResource;}, TerrainResourceId.NONE>;



interface TerrainImprovement {
  id: TerrainImprovementId;
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
      color: '#708735',
      variants: 1,
    },
  },
  [TerrainBaseId.GRASSLAND_HILLS]: {
    id: TerrainBaseId.GRASSLAND_HILLS,
    yield: { [YieldId.FOOD]: 2, [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Grassland (Hills)',
      class: 'm-base-grassland-hills',
      color: '#708735',
      variants: 3,
    },
  },
  [TerrainBaseId.GRASSLAND_MOUNTAIN]: {
    id: TerrainBaseId.GRASSLAND_MOUNTAIN,
    yield: {},
    ui: {
      name: 'Grassland (Mountain)',
      class: 'm-base-grassland-mountain',
      color: '#708735',
      variants: 5,
    },
  },
  [TerrainBaseId.PLAINS_FLAT]: {
    id: TerrainBaseId.PLAINS_FLAT,
    yield: { [YieldId.FOOD]: 1, [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Plains',
      class: 'm-base-plains-flat',
      color: '#9fa036',
      variants: 1,
    },
  },
  [TerrainBaseId.PLAINS_HILLS]: {
    id: TerrainBaseId.PLAINS_HILLS,
    yield: { [YieldId.FOOD]: 1, [YieldId.PRODUCTION]: 2 },
    ui: {
      name: 'Plains (Hills)',
      class: 'm-base-plains-hills',
      color: '#9fa036',
      variants: 3,
    },
  },
  [TerrainBaseId.PLAINS_MOUNTAIN]: {
    id: TerrainBaseId.PLAINS_MOUNTAIN,
    yield: {},
    ui: {
      name: 'Plains (Mountain)',
      class: 'm-base-plains-mountain',
      color: '#9fa036',
      variants: 5,
    },
  },
  [TerrainBaseId.DESERT_FLAT]: {
    id: TerrainBaseId.DESERT_FLAT,
    yield: {},
    ui: {
      name: 'Desert',
      class: 'm-base-desert-flat',
      color: '#efca73',
      variants: 1,
    },
  },
  [TerrainBaseId.DESERT_HILLS]: {
    id: TerrainBaseId.DESERT_HILLS,
    yield: { [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Desert (Hills)',
      class: 'm-base-desert-hills',
      color: '#efca73',
      variants: 3,
    },
  },
  [TerrainBaseId.DESERT_MOUNTAIN]: {
    id: TerrainBaseId.DESERT_MOUNTAIN,
    yield: {},
    ui: {
      name: 'Desert (Mountain)',
      class: 'm-base-desert-mountain',
      color: '#efca73',
      variants: 5,
    },
  },
  [TerrainBaseId.TUNDRA_FLAT]: {
    id: TerrainBaseId.TUNDRA_FLAT,
    yield: { [YieldId.FOOD]: 1 },
    ui: {
      name: 'Tundra',
      class: 'm-base-tundra-flat',
      color: '#918f63',
      variants: 1,
    },
  },
  [TerrainBaseId.TUNDRA_HILLS]: {
    id: TerrainBaseId.TUNDRA_HILLS,
    yield: { [YieldId.FOOD]: 1, [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Tundra (Hills)',
      class: 'm-base-tundra-hills',
      color: '#918f63',
      variants: 3,
    },
  },
  [TerrainBaseId.TUNDRA_MOUNTAIN]: {
    id: TerrainBaseId.TUNDRA_MOUNTAIN,
    yield: {},
    ui: {
      name: 'Tundra (Mountain)',
      class: 'm-base-tundra-mountain',
      color: '#918f63',
      variants: 5,
    },
  },
  [TerrainBaseId.SNOW_FLAT]: {
    id: TerrainBaseId.SNOW_FLAT,
    yield: {},
    ui: {
      name: 'Snow',
      class: 'm-base-snow-flat',
      color: '#d2e4f5',
      variants: 1,
    },
  },
  [TerrainBaseId.SNOW_HILLS]: {
    id: TerrainBaseId.SNOW_HILLS,
    yield: { [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Snow (Hills)',
      class: 'm-base-snow-hills',
      color: '#d2e4f5',
      variants: 3,
    },
  },
  [TerrainBaseId.SNOW_MOUNTAIN]: {
    id: TerrainBaseId.SNOW_MOUNTAIN,
    yield: {},
    ui: {
      name: 'Snow (Mountain)',
      class: 'm-base-snow-mountain',
      color: '#d2e4f5',
      variants: 5,
    },
  },
  [TerrainBaseId.LAKE]: {
    id: TerrainBaseId.LAKE,
    yield: { [YieldId.FOOD]: 1, [YieldId.GOLD]: 1 },
    ui: {
      name: 'Lake',
      class: 'm-base-lake',
      color: '#2e5878',
      variants: 1,
    },
  },
  [TerrainBaseId.COAST]: {
    id: TerrainBaseId.COAST,
    yield: { [YieldId.FOOD]: 1, [YieldId.GOLD]: 1 },
    ui: {
      name: 'Coast',
      class: 'm-base-coast',
      color: '#2e5878',
      variants: 1,
    },
  },
  [TerrainBaseId.OCEAN]: {
    id: TerrainBaseId.OCEAN,
    yield: { [YieldId.FOOD]: 1 },
    ui: {
      name: 'Ocean',
      class: 'm-base-ocean',
      color: '#2b2f55',
      variants: 1,
    },
  }
}
export const TERRAIN_BASE_LIST: TerrainBase[] = Object.keys(TERRAIN_BASE_SET).map(key => TERRAIN_BASE_SET[key]);



export const TERRAIN_FEATURE_SET: TerrainFeatureSet = {
  [TerrainFeatureId.FLOODPLAINS]: {
    id: TerrainFeatureId.FLOODPLAINS,
    yield: { [YieldId.FOOD]: 1 },
    ui: {
      name: 'Floodplains',
      class: 'm-feature-floodplains',
      variants: 1,
    },
  },
  [TerrainFeatureId.ICE]: {
    id: TerrainFeatureId.ICE,
    yield: {},
    ui: {
      name: 'Ice',
      class: 'm-feature-ice',
      variants: 1,
    },
  },
  [TerrainFeatureId.MARSH]: {
    id: TerrainFeatureId.MARSH,
    yield: { [YieldId.FOOD]: 1 },
    ui: {
      name: 'Marsh',
      class: 'm-feature-marsh',
      variants: 1,
    },
  },
  [TerrainFeatureId.OASIS]: {
    id: TerrainFeatureId.OASIS,
    yield: { [YieldId.FOOD]: 3, [YieldId.GOLD]: 1 },
    ui: {
      name: 'Oasis',
      class: 'm-feature-oasis',
      variants: 1,
    },
  },
  [TerrainFeatureId.RAINFOREST]: {
    id: TerrainFeatureId.RAINFOREST,
    yield: { [YieldId.FOOD]: 1 },
    ui: {
      name: 'Rainforest',
      class: 'm-feature-rainforest',
      variants: 1,
    },
  },
  [TerrainFeatureId.REEF]: {
    id: TerrainFeatureId.REEF,
    yield: { [YieldId.FOOD]: 1, [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Reef',
      class: 'm-feature-reef',
      variants: 1,
    },
  },
  [TerrainFeatureId.WOODS]: {
    id: TerrainFeatureId.WOODS,
    yield: { [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Woods',
      class: 'm-feature-woods',
      variants: 1,
    },
  }
}
export const TERRAIN_FEATURE_LIST: TerrainFeature[] = Object.keys(TERRAIN_FEATURE_SET).map(key => TERRAIN_FEATURE_SET[key]);



export const TERRAIN_RESOURCE_SET: TerrainResourceSet = {
  [TerrainResourceId.BANANAS]: {
    id: TerrainResourceId.BANANAS,
    type: TerrainResourceTypeId.BONUS,
    yield: {  [YieldId.FOOD]: 1 },
    ui: {
      name: 'Bananas',
      class: 'm-resource-bananas',
    },
  },
  [TerrainResourceId.CATTLE]: {
    id: TerrainResourceId.CATTLE,
    type: TerrainResourceTypeId.BONUS,
    yield: { [YieldId.FOOD]: 1 },
    ui: {
      name: 'Cattle',
      class: 'm-resource-cattle',
    },
  },
  [TerrainResourceId.COPPER]: {
    id: TerrainResourceId.COPPER,
    type: TerrainResourceTypeId.BONUS,
    yield: { [YieldId.GOLD]: 2 },
    ui: {
      name: 'Copper',
      class: 'm-resource-copper',
    },
  },
  [TerrainResourceId.CRABS]: {
    id: TerrainResourceId.CRABS,
    type: TerrainResourceTypeId.BONUS,
    yield: { [YieldId.GOLD]: 2 },
    ui: {
      name: 'Crabs',
      class: 'm-resource-crabs',
    },
  },
  [TerrainResourceId.DEER]: {
    id: TerrainResourceId.DEER,
    type: TerrainResourceTypeId.BONUS,
    yield: { [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Deer',
      class: 'm-resource-deer',
    },
  },
  [TerrainResourceId.FISH]: {
    id: TerrainResourceId.FISH,
    type: TerrainResourceTypeId.BONUS,
    yield: {  [YieldId.FOOD]: 1 },
    ui: {
      name: 'Fish',
      class: 'm-resource-fish',
    },
  },
  [TerrainResourceId.RICE]: {
    id: TerrainResourceId.RICE,
    type: TerrainResourceTypeId.BONUS,
    yield: {  [YieldId.FOOD]: 1 },
    ui: {
      name: 'Rice',
      class: 'm-resource-rice',
    },
  },
  [TerrainResourceId.SHEEP]: {
    id: TerrainResourceId.SHEEP,
    type: TerrainResourceTypeId.BONUS,
    yield: {  [YieldId.FOOD]: 1 },
    ui: {
      name: 'Sheep',
      class: 'm-resource-sheep',
    },
  },
  [TerrainResourceId.STONE]: {
    id: TerrainResourceId.STONE,
    type: TerrainResourceTypeId.BONUS,
    yield: { [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Stone',
      class: 'm-resource-stone',
    },
  },
  [TerrainResourceId.WHEAT]: {
    id: TerrainResourceId.WHEAT,
    type: TerrainResourceTypeId.BONUS,
    yield: { [YieldId.FOOD]: 1 },
    ui: {
      name: 'Wheat',
      class: 'm-resource-wheat',
    },
  },
  [TerrainResourceId.ALUMINUM]: {
    id: TerrainResourceId.ALUMINUM,
    type: TerrainResourceTypeId.STRATEGIC,
    yield: { [YieldId.SCIENCE]: 1 },
    ui: {
      name: 'Aluminum',
      class: 'm-resource-aluminum',
    },
  },
  [TerrainResourceId.COAL]: {
    id: TerrainResourceId.COAL,
    type: TerrainResourceTypeId.STRATEGIC,
    yield: { [YieldId.PRODUCTION]: 2 },
    ui: {
      name: 'Coal',
      class: 'm-resource-coal',
    },
  },
  [TerrainResourceId.HORSES]: {
    id: TerrainResourceId.HORSES,
    type: TerrainResourceTypeId.STRATEGIC,
    yield: { [YieldId.FOOD]: 1, [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Horses',
      class: 'm-resource-horses',
    },
  },
  [TerrainResourceId.IRON]: {
    id: TerrainResourceId.IRON,
    type: TerrainResourceTypeId.STRATEGIC,
    yield: { [YieldId.SCIENCE]: 1 },
    ui: {
      name: 'Iron',
      class: 'm-resource-iron',
    },
  },
  [TerrainResourceId.NITER]: {
    id: TerrainResourceId.NITER,
    type: TerrainResourceTypeId.STRATEGIC,
    yield: { [YieldId.FOOD]: 1, [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Niter',
      class: 'm-resource-niter',
    },
  },
  [TerrainResourceId.OIL]: {
    id: TerrainResourceId.OIL,
    type: TerrainResourceTypeId.STRATEGIC,
    yield: { [YieldId.PRODUCTION]: 3 },
    ui: {
      name: 'Oil',
      class: 'm-resource-oil',
    },
  },
  [TerrainResourceId.URANIUM]: {
    id: TerrainResourceId.URANIUM,
    type: TerrainResourceTypeId.STRATEGIC,
    yield: { [YieldId.PRODUCTION]: 2 },
    ui: {
      name: 'Uranium',
      class: 'm-resource-uranium',
    },
  },
  [TerrainResourceId.AMBER]: {
    id: TerrainResourceId.AMBER,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.CULTURE]: 1 },
    ui: {
      name: 'Amber',
      class: 'm-resource-amber',
    },
  },
  [TerrainResourceId.CITRUS]: {
    id: TerrainResourceId.CITRUS,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.FOOD]: 2 },
    ui: {
      name: 'Citrus',
      class: 'm-resource-citrus',
    },
  },
  [TerrainResourceId.COCOA]: {
    id: TerrainResourceId.COCOA,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.GOLD]: 3 },
    ui: {
      name: 'Cocoa',
      class: 'm-resource-cocoa',
    },
  },
  [TerrainResourceId.COFFEE]: {
    id: TerrainResourceId.COFFEE,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.CULTURE]: 1 },
    ui: {
      name: 'Coffee',
      class: 'm-resource-coffee',
    },
  },
  [TerrainResourceId.COTTON]: {
    id: TerrainResourceId.COTTON,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.GOLD]: 3 },
    ui: {
      name: 'Cotton',
      class: 'm-resource-cotton',
    },
  },
  [TerrainResourceId.DIAMONDS]: {
    id: TerrainResourceId.DIAMONDS,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.GOLD]: 3 },
    ui: {
      name: 'Diamonds',
      class: 'm-resource-diamonds',
    },
  },
  [TerrainResourceId.DYES]: {
    id: TerrainResourceId.DYES,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.FAITH]: 1 },
    ui: {
      name: 'Dyes',
      class: 'm-resource-dyes',
    },
  },
  [TerrainResourceId.FURS]: {
    id: TerrainResourceId.FURS,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.FOOD]: 1, [YieldId.GOLD]: 1 },
    ui: {
      name: 'Furs',
      class: 'm-resource-furs',
    },
  },
  [TerrainResourceId.GYPSUM]: {
    id: TerrainResourceId.GYPSUM,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.PRODUCTION]: 1, [YieldId.GOLD]: 1 },
    ui: {
      name: 'Gypsum',
      class: 'm-resource-gypsum',
    },
  },
  [TerrainResourceId.INCENSE]: {
    id: TerrainResourceId.INCENSE,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.FAITH]: 1 },
    ui: {
      name: 'Incense',
      class: 'm-resource-incense',
    },
  },
  [TerrainResourceId.IVORY]: {
    id: TerrainResourceId.IVORY,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.PRODUCTION]: 1, [YieldId.GOLD]: 1 },
    ui: {
      name: 'Ivory',
      class: 'm-resource-ivory',
    },
  },
  [TerrainResourceId.JADE]: {
    id: TerrainResourceId.JADE,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.CULTURE]: 1 },
    ui: {
      name: 'Jade',
      class: 'm-resource-jade',
    },
  },
  [TerrainResourceId.MARBLE]: {
    id: TerrainResourceId.MARBLE,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.CULTURE]: 1 },
    ui: {
      name: 'marble',
      class: 'm-resource-marble',
    },
  },
  [TerrainResourceId.MERCURY]: {
    id: TerrainResourceId.MERCURY,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.SCIENCE]: 1 },
    ui: {
      name: 'Mercury',
      class: 'm-resource-mercury',
    },
  },
  [TerrainResourceId.OLIVES]: {
    id: TerrainResourceId.OLIVES,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.PRODUCTION]: 1, [YieldId.GOLD]: 1 },
    ui: {
      name: 'Olives',
      class: 'm-resource-olives',
    },
  },
  [TerrainResourceId.PEARLS]: {
    id: TerrainResourceId.PEARLS,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.FAITH]: 1 },
    ui: {
      name: 'Pearls',
      class: 'm-resource-pearls',
    },
  },
  [TerrainResourceId.SALT]: {
    id: TerrainResourceId.SALT,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.FOOD]: 1, [YieldId.GOLD]: 1 },
    ui: {
      name: 'Salt',
      class: 'm-resource-salt',
    },
  },
  [TerrainResourceId.SILK]: {
    id: TerrainResourceId.SILK,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.CULTURE]: 1 },
    ui: {
      name: 'Silk',
      class: 'm-resource-silk',
    },
  },
  [TerrainResourceId.SILVER]: {
    id: TerrainResourceId.SILVER,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.GOLD]: 3 },
    ui: {
      name: 'Silver',
      class: 'm-resource-silver',
    },
  },
  [TerrainResourceId.SPICES]: {
    id: TerrainResourceId.SPICES,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.FOOD]: 2 },
    ui: {
      name:'Spices',
      class: 'm-resource-spices',
    },
  },
  [TerrainResourceId.SUGAR]: {
    id: TerrainResourceId.SUGAR,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.FOOD]: 2 },
    ui: {
      name: 'Sugar',
      class: 'm-resource-sugar',
    },
  },
  [TerrainResourceId.TEA]: {
    id: TerrainResourceId.TEA,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.SCIENCE]: 1 },
    ui: {
      name: 'Tea',
      class: 'm-resource-tea',
    },
  },
  [TerrainResourceId.TOBACCO]: {
    id: TerrainResourceId.TOBACCO,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.FAITH]: 1 },
    ui: {
      name: 'Tobacco',
      class: 'm-resource-tobacco',
    },
  },
  [TerrainResourceId.TRUFFLES]: {
    id: TerrainResourceId.TRUFFLES,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.GOLD]: 3 },
    ui: {
      name: 'Truffles',
      class: 'm-resource-truffles',
    },
  },
  [TerrainResourceId.WHALES]: {
    id: TerrainResourceId.WHALES,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.FOOD]: 1, [YieldId.GOLD]: 1 },
    ui: {
      name: 'Whales',
      class: 'm-resource-whales',
    },
  },
  [TerrainResourceId.WINE]: {
    id: TerrainResourceId.WINE,
    type: TerrainResourceTypeId.LUXURY,
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
    yield: {},
    ui: {
      name: 'Airstrip',
      class: 'm-improvement-airstrip',
    },
  },
  // +0.5 Housing, +1 Food (Mercantilism), +1 Production (Mercantilism), +1 Gold (Synthetic Materials)
  [TerrainImprovementId.CAMP]: {
    id: TerrainImprovementId.CAMP,
    yield: { [YieldId.GOLD]: 2 },
    ui: {
      name: 'Camp',
      class: 'm-improvement-camp',
    },
  },
  // +0.5 Housing, +1 Food per 2 adjacent Farms (Feudalism until Replaceable Parts), +1 Food per adjacent Farm (Replaceable Parts)
  [TerrainImprovementId.FARM]: {
    id: TerrainImprovementId.FARM,
    yield: { [YieldId.FOOD]: 1 },
    ui: {
      name: 'Farm',
      class: 'm-improvement-farm',
    },
  },
  // +0.5 Housing, +2 Gold (Cartography), +1 Food (Plastics)
  [TerrainImprovementId.FISHING_BOATS]: {
    id: TerrainImprovementId.FISHING_BOATS,
    yield: { [YieldId.FOOD]: 1 },
    ui: {
      name: 'Fishing Boats',
      class: 'm-improvement-fishing-boats',
    },
  },
  [TerrainImprovementId.FORT]: {
    id: TerrainImprovementId.FORT,
    yield: {},
    ui: {
      name: 'Fort',
      class: 'm-improvement-fort',
    },
  },
  // +1 Production (Steel), +1 Production (Cybernetics)
  [TerrainImprovementId.LUMBER_MILL]: {
    id: TerrainImprovementId.LUMBER_MILL,
    yield: { [YieldId.PRODUCTION]: 2 },
    ui: {
      name: 'Lumber Mill',
      class: 'm-improvement-lumber-mill',
    },
  },
  // -1 Appeal, +1 Production (Apprenticeship), +1 Production (Industrialization), +1 Production (Smart materials),
  [TerrainImprovementId.MINE]: {
    id: TerrainImprovementId.MINE,
    yield: { [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Mine',
      class: 'm-improvement-mine',
    },
  },
  [TerrainImprovementId.MISSILE_SILO]: {
    id: TerrainImprovementId.MISSILE_SILO,
    yield: {},
    ui: {
      name: 'Missile Silo',
      class: 'm-improvement-missile-silo',
    },
  },
  [TerrainImprovementId.MOUNTAIN_TUNNEL]: {
    id: TerrainImprovementId.MOUNTAIN_TUNNEL,
    yield: {},
    ui: {
      name: 'Mountain Tunnel',
      class: 'm-improvement-mountain-tunnel',
    },
  },
  // -1 Appeal
  [TerrainImprovementId.OFFSHORE_OIL_RIG]: {
    id: TerrainImprovementId.OFFSHORE_OIL_RIG,
    yield: { [YieldId.PRODUCTION]: 2 },
    ui: {
      name: 'Offshore Oil Rig',
      class: 'm-improvement-offshore-oil-rig',
    },
  },
  [TerrainImprovementId.OFFSHORE_WIND_FARM]: {
    id: TerrainImprovementId.OFFSHORE_WIND_FARM,
    yield: { [YieldId.PRODUCTION]: 1, [YieldId.GOLD]: 1, [YieldId.POWER]: 2 },
    ui: {
      name: 'Offshore Wind Farm',
      class: 'm-improvement-offshore-wind-farm',
    },
  },
  // -1 Appeal
  [TerrainImprovementId.OIL_WELL]: {
    id: TerrainImprovementId.OIL_WELL,
    yield: { [YieldId.PRODUCTION]: 2 },
    ui: {
      name: 'Oil Well',
      class: 'm-improvement-oil-well',
    },
  },
  // +0.5 Housing, +1 Food (Exploration), +1 Production (Robotics)
  [TerrainImprovementId.PASTURE]: {
    id: TerrainImprovementId.PASTURE,
    yield: { [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Pasture',
      class: 'm-improvement-pasture',
    },
  },
  // +0.5 Housing, +1 Food (Scientific Theory), +2 Gold (Globalization)
  [TerrainImprovementId.PLANTATION]: {
    id: TerrainImprovementId.PLANTATION,
    yield: { [YieldId.GOLD]: 2 },
    ui: {
      name: 'Plantation',
      class: 'm-improvement-plantation',
    },
  },
  // -1 Appeal, +1 Production (Gunpowder), +1 Production (Rocketry), +1 Production (Predictive systems)
  [TerrainImprovementId.QUARRY]: {
    id: TerrainImprovementId.QUARRY,
    yield: { [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Quarry',
      class: 'm-improvement-quarry',
    },
  },
  // Appeal x1 to gold, Appeal x 2 to tourism
  [TerrainImprovementId.SEASIDE_RESORT]: {
    id: TerrainImprovementId.SEASIDE_RESORT,
    yield: {},
    ui: {
      name: 'Seaside Resort',
      class: 'm-improvement-seaside-resort',
    },
  },
  // +1 Production from each adjacent Fishing Boat, Fishing Boats receive +1 Production from each adjacent Seastead, +1 Culture and Tourism for each adjacent Reef, +2 Housing.
  [TerrainImprovementId.SEASTEAD]: {
    id: TerrainImprovementId.SEASTEAD,
    yield: { [YieldId.FOOD]: 1 },
    ui: {
      name: 'Seastead',
      class: 'm-improvement-seastead',
    },
  },
  // +1 Amenities, Provides Tourism equal to the tile's Appeal
  [TerrainImprovementId.SKI_RESORT]: {
    id: TerrainImprovementId.SKI_RESORT,
    yield: {},
    ui: {
      name: 'Ski Resort',
      class: 'm-improvement-ski-resort',
    },
  },
  [TerrainImprovementId.SOLAR_FARM]: {
    id: TerrainImprovementId.SOLAR_FARM,
    yield: { [YieldId.PRODUCTION]: 1, [YieldId.GOLD]: 1, [YieldId.POWER]: 2 },
    ui: {
      name: 'Solar Farm',
      class: 'm-improvement-solar-farm',
    },
  },
  [TerrainImprovementId.WIND_FARM]: {
    id: TerrainImprovementId.WIND_FARM,
    yield: { [YieldId.PRODUCTION]: 1, [YieldId.GOLD]: 1, [YieldId.POWER]: 2 },
    ui: {
      name: 'Wind Farm',
      class: 'm-improvement-wind-farm',
    },
  }
}
export const TERRAIN_IMPROVEMENT_LIST: TerrainImprovement[] = Object.keys(TERRAIN_IMPROVEMENT_SET).map(key => TERRAIN_IMPROVEMENT_SET[key]);
