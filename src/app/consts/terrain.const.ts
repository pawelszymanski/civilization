import {
  TerrainBaseId,
  TerrainFeatureId,
  TerrainResourceId,
  TerrainImprovementId,
  TerrainResourceTypeId,
  TerrainUi,
  TerrainUiWithVariations
} from '../models/terrain';
import {Yield, YieldId} from '../models/yield';



interface TerrainBase {
  id: TerrainBaseId;
  yield: Partial<Yield>;
  ui: TerrainUiWithVariations;
}

type TerrainBaseSet = {
  [key in TerrainBaseId]: TerrainBase;
}



interface TerrainFeature {
  id: TerrainFeatureId;
  yield: Partial<Yield>;
  ui: TerrainUiWithVariations;
}

// All but TerrainFeatureId.NONE
type TerrainFeatureSet = Omit<{[key in TerrainFeatureId]: TerrainFeature;}, TerrainFeatureId.NONE>;



interface TerrainResource {
  id: TerrainResourceId;
  type: TerrainResourceTypeId;
  yield: Partial<Yield>;
  ui: TerrainUi;
}

// All but TerrainResourceId.NONE
type TerrainResourceSet = Omit<{[key in TerrainResourceId]: TerrainResource;}, TerrainResourceId.NONE>;



interface TerrainImprovement {
  id: TerrainImprovementId;
  yield: Partial<Yield>;
  ui: TerrainUi;
}

// All but TerrainImprovementId.NONE
type TerrainImprovementSet = Omit<{[key in TerrainImprovementId]: TerrainImprovement;}, TerrainImprovementId.NONE>;



export const TERRAIN_BASE_SET: TerrainBaseSet = {
  [TerrainBaseId.GRASSLAND_FLAT]: {
    id: TerrainBaseId.GRASSLAND_FLAT,
    yield: { [YieldId.FOOD]: 2 },
    ui: {
      name: 'Grassland',
      cssClass: 'm-base-grassland-flat',
      cssVariations: 1,
    },
  },
  [TerrainBaseId.GRASSLAND_HILLS]: {
    id: TerrainBaseId.GRASSLAND_HILLS,
    yield: { [YieldId.FOOD]: 2, [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Grassland (Hills)',
      cssClass: 'm-base-grassland-hills',
      cssVariations: 3,
    },
  },
  [TerrainBaseId.GRASSLAND_MOUNTAIN]: {
    id: TerrainBaseId.GRASSLAND_MOUNTAIN,
    yield: {},
    ui: {
      name: 'Grassland (Mountain)',
      cssClass: 'm-base-grassland-mountain',
      cssVariations: 5,
    },
  },
  [TerrainBaseId.PLAINS_FLAT]: {
    id: TerrainBaseId.PLAINS_FLAT,
    yield: { [YieldId.FOOD]: 1, [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Plains',
      cssClass: 'm-base-plains-flat',
      cssVariations: 1,
    },
  },
  [TerrainBaseId.PLAINS_HILLS]: {
    id: TerrainBaseId.PLAINS_HILLS,
    yield: { [YieldId.FOOD]: 1, [YieldId.PRODUCTION]: 2 },
    ui: {
      name: 'Plains (Hills)',
      cssClass: 'm-base-plains-hills',
      cssVariations: 3,
    },
  },
  [TerrainBaseId.PLAINS_MOUNTAIN]: {
    id: TerrainBaseId.PLAINS_MOUNTAIN,
    yield: {},
    ui: {
      name: 'Plains (Mountain)',
      cssClass: 'm-base-plains-mountain',
      cssVariations: 5,
    },
  },
  [TerrainBaseId.DESERT_FLAT]: {
    id: TerrainBaseId.DESERT_FLAT,
    yield: {},
    ui: {
      name: 'Desert',
      cssClass: 'm-base-desert-flat',
      cssVariations: 1,
    },
  },
  [TerrainBaseId.DESERT_HILLS]: {
    id: TerrainBaseId.DESERT_HILLS,
    yield: { [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Desert (Hills)',
      cssClass: 'm-base-desert-hills',
      cssVariations: 3,
    },
  },
  [TerrainBaseId.DESERT_MOUNTAIN]: {
    id: TerrainBaseId.DESERT_MOUNTAIN,
    yield: {},
    ui: {
      name: 'Desert (Mountain)',
      cssClass: 'm-base-desert-mountain',
      cssVariations: 5,
    },
  },
  [TerrainBaseId.TUNDRA_FLAT]: {
    id: TerrainBaseId.TUNDRA_FLAT,
    yield: { [YieldId.FOOD]: 1 },
    ui: {
      name: 'Tundra',
      cssClass: 'm-base-tundra-flat',
      cssVariations: 1,
    },
  },
  [TerrainBaseId.TUNDRA_HILLS]: {
    id: TerrainBaseId.TUNDRA_HILLS,
    yield: { [YieldId.FOOD]: 1, [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Tundra (Hills)',
      cssClass: 'm-base-tundra-hills',
      cssVariations: 3,
    },
  },
  [TerrainBaseId.TUNDRA_MOUNTAIN]: {
    id: TerrainBaseId.TUNDRA_MOUNTAIN,
    yield: {},
    ui: {
      name: 'Tundra (Mountain)',
      cssClass: 'm-base-tundra-mountain',
      cssVariations: 5,
    },
  },
  [TerrainBaseId.SNOW_FLAT]: {
    id: TerrainBaseId.SNOW_FLAT,
    yield: {},
    ui: {
      name: 'Snow',
      cssClass: 'm-base-snow-flat',
      cssVariations: 1,
    },
  },
  [TerrainBaseId.SNOW_HILLS]: {
    id: TerrainBaseId.SNOW_HILLS,
    yield: { [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Snow (Hills)',
      cssClass: 'm-base-snow-hills',
      cssVariations: 3,
    },
  },
  [TerrainBaseId.SNOW_MOUNTAIN]: {
    id: TerrainBaseId.SNOW_MOUNTAIN,
    yield: {},
    ui: {
      name: 'Snow (Mountain)',
      cssClass: 'm-base-snow-mountain',
      cssVariations: 5,
    },
  },
  [TerrainBaseId.LAKE]: {
    id: TerrainBaseId.LAKE,
    yield: { [YieldId.FOOD]: 1, [YieldId.GOLD]: 1 },
    ui: {
      name: 'Lake',
      cssClass: 'm-base-lake',
      cssVariations: 1,
    },
  },
  [TerrainBaseId.COAST]: {
    id: TerrainBaseId.COAST,
    yield: { [YieldId.FOOD]: 1, [YieldId.GOLD]: 1 },
    ui: {
      name: 'Coast',
      cssClass: 'm-base-coast',
      cssVariations: 1,
    },
  },
  [TerrainBaseId.OCEAN]: {
    id: TerrainBaseId.OCEAN,
    yield: { [YieldId.FOOD]: 1 },
    ui: {
      name: 'Ocean',
      cssClass: 'm-base-ocean',
      cssVariations: 1,
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
      cssClass: 'm-feature-floodplains',
      cssVariations: 1,
    },
  },
  [TerrainFeatureId.ICE]: {
    id: TerrainFeatureId.ICE,
    yield: {},
    ui: {
      name: 'Ice',
      cssClass: 'm-feature-ice',
      cssVariations: 1,
    },
  },
  [TerrainFeatureId.MARSH]: {
    id: TerrainFeatureId.MARSH,
    yield: { [YieldId.FOOD]: 1 },
    ui: {
      name: 'Marsh',
      cssClass: 'm-feature-marsh',
      cssVariations: 1,
    },
  },
  [TerrainFeatureId.OASIS]: {
    id: TerrainFeatureId.OASIS,
    yield: { [YieldId.FOOD]: 3, [YieldId.GOLD]: 1 },
    ui: {
      name: 'Oasis',
      cssClass: 'm-feature-oasis',
      cssVariations: 1,
    },
  },
  [TerrainFeatureId.RAINFOREST]: {
    id: TerrainFeatureId.RAINFOREST,
    yield: { [YieldId.FOOD]: 1 },
    ui: {
      name: 'Rainforest',
      cssClass: 'm-feature-rainforest',
      cssVariations: 1,
    },
  },
  [TerrainFeatureId.REEF]: {
    id: TerrainFeatureId.REEF,
    yield: { [YieldId.FOOD]: 1, [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Reef',
      cssClass: 'm-feature-reef',
      cssVariations: 1,
    },
  },
  [TerrainFeatureId.WOODS]: {
    id: TerrainFeatureId.WOODS,
    yield: { [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Woods',
      cssClass: 'm-feature-woods',
      cssVariations: 1,
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
      cssClass: 'm-resource-bananas',
    },
  },
  [TerrainResourceId.CATTLE]: {
    id: TerrainResourceId.CATTLE,
    type: TerrainResourceTypeId.BONUS,
    yield: { [YieldId.FOOD]: 1 },
    ui: {
      name: 'Cattle',
      cssClass: 'm-resource-cattle',
    },
  },
  [TerrainResourceId.COPPER]: {
    id: TerrainResourceId.COPPER,
    type: TerrainResourceTypeId.BONUS,
    yield: { [YieldId.GOLD]: 2 },
    ui: {
      name: 'Copper',
      cssClass: 'm-resource-copper',
    },
  },
  [TerrainResourceId.CRABS]: {
    id: TerrainResourceId.CRABS,
    type: TerrainResourceTypeId.BONUS,
    yield: { [YieldId.GOLD]: 2 },
    ui: {
      name: 'Crabs',
      cssClass: 'm-resource-crabs',
    },
  },
  [TerrainResourceId.DEER]: {
    id: TerrainResourceId.DEER,
    type: TerrainResourceTypeId.BONUS,
    yield: { [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Deer',
      cssClass: 'm-resource-deer',
    },
  },
  [TerrainResourceId.FISH]: {
    id: TerrainResourceId.FISH,
    type: TerrainResourceTypeId.BONUS,
    yield: {  [YieldId.FOOD]: 1 },
    ui: {
      name: 'Fish',
      cssClass: 'm-resource-fish',
    },
  },
  [TerrainResourceId.RICE]: {
    id: TerrainResourceId.RICE,
    type: TerrainResourceTypeId.BONUS,
    yield: {  [YieldId.FOOD]: 1 },
    ui: {
      name: 'Rice',
      cssClass: 'm-resource-rice',
    },
  },
  [TerrainResourceId.SHEEP]: {
    id: TerrainResourceId.SHEEP,
    type: TerrainResourceTypeId.BONUS,
    yield: {  [YieldId.FOOD]: 1 },
    ui: {
      name: 'Sheep',
      cssClass: 'm-resource-sheep',
    },
  },
  [TerrainResourceId.STONE]: {
    id: TerrainResourceId.STONE,
    type: TerrainResourceTypeId.BONUS,
    yield: { [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Stone',
      cssClass: 'm-resource-stone',
    },
  },
  [TerrainResourceId.WHEAT]: {
    id: TerrainResourceId.WHEAT,
    type: TerrainResourceTypeId.BONUS,
    yield: { [YieldId.FOOD]: 1 },
    ui: {
      name: 'Wheat',
      cssClass: 'm-resource-wheat',
    },
  },
  [TerrainResourceId.ALUMINUM]: {
    id: TerrainResourceId.ALUMINUM,
    type: TerrainResourceTypeId.STRATEGIC,
    yield: { [YieldId.SCIENCE]: 1 },
    ui: {
      name: 'Aluminum',
      cssClass: 'm-resource-aluminum',
    },
  },
  [TerrainResourceId.COAL]: {
    id: TerrainResourceId.COAL,
    type: TerrainResourceTypeId.STRATEGIC,
    yield: { [YieldId.PRODUCTION]: 2 },
    ui: {
      name: 'Coal',
      cssClass: 'm-resource-coal',
    },
  },
  [TerrainResourceId.HORSES]: {
    id: TerrainResourceId.HORSES,
    type: TerrainResourceTypeId.STRATEGIC,
    yield: { [YieldId.FOOD]: 1, [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Horses',
      cssClass: 'm-resource-horses',
    },
  },
  [TerrainResourceId.IRON]: {
    id: TerrainResourceId.IRON,
    type: TerrainResourceTypeId.STRATEGIC,
    yield: { [YieldId.SCIENCE]: 1 },
    ui: {
      name: 'Iron',
      cssClass: 'm-resource-iron',
    },
  },
  [TerrainResourceId.NITER]: {
    id: TerrainResourceId.NITER,
    type: TerrainResourceTypeId.STRATEGIC,
    yield: { [YieldId.FOOD]: 1, [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Niter',
      cssClass: 'm-resource-niter',
    },
  },
  [TerrainResourceId.OIL]: {
    id: TerrainResourceId.OIL,
    type: TerrainResourceTypeId.STRATEGIC,
    yield: { [YieldId.PRODUCTION]: 3 },
    ui: {
      name: 'Oil',
      cssClass: 'm-resource-oil',
    },
  },
  [TerrainResourceId.URANIUM]: {
    id: TerrainResourceId.URANIUM,
    type: TerrainResourceTypeId.STRATEGIC,
    yield: { [YieldId.PRODUCTION]: 2 },
    ui: {
      name: 'Uranium',
      cssClass: 'm-resource-uranium',
    },
  },
  [TerrainResourceId.AMBER]: {
    id: TerrainResourceId.AMBER,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.CULTURE]: 1 },
    ui: {
      name: 'Amber',
      cssClass: 'm-resource-amber',
    },
  },
  [TerrainResourceId.CITRUS]: {
    id: TerrainResourceId.CITRUS,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.FOOD]: 2 },
    ui: {
      name: 'Citrus',
      cssClass: 'm-resource-citrus',
    },
  },
  [TerrainResourceId.COCOA]: {
    id: TerrainResourceId.COCOA,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.GOLD]: 3 },
    ui: {
      name: 'Cocoa',
      cssClass: 'm-resource-cocoa',
    },
  },
  [TerrainResourceId.COFFEE]: {
    id: TerrainResourceId.COFFEE,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.CULTURE]: 1 },
    ui: {
      name: 'Coffee',
      cssClass: 'm-resource-coffee',
    },
  },
  [TerrainResourceId.COTTON]: {
    id: TerrainResourceId.COTTON,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.GOLD]: 3 },
    ui: {
      name: 'Cotton',
      cssClass: 'm-resource-cotton',
    },
  },
  [TerrainResourceId.DIAMONDS]: {
    id: TerrainResourceId.DIAMONDS,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.GOLD]: 3 },
    ui: {
      name: 'Diamonds',
      cssClass: 'm-resource-diamonds',
    },
  },
  [TerrainResourceId.DYES]: {
    id: TerrainResourceId.DYES,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.FAITH]: 1 },
    ui: {
      name: 'Dyes',
      cssClass: 'm-resource-dyes',
    },
  },
  [TerrainResourceId.FURS]: {
    id: TerrainResourceId.FURS,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.FOOD]: 1, [YieldId.GOLD]: 1 },
    ui: {
      name: 'Furs',
      cssClass: 'm-resource-furs',
    },
  },
  [TerrainResourceId.GYPSUM]: {
    id: TerrainResourceId.GYPSUM,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.PRODUCTION]: 1, [YieldId.GOLD]: 1 },
    ui: {
      name: 'Gypsum',
      cssClass: 'm-resource-gypsum',
    },
  },
  [TerrainResourceId.INCENSE]: {
    id: TerrainResourceId.INCENSE,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.FAITH]: 1 },
    ui: {
      name: 'Incense',
      cssClass: 'm-resource-incense',
    },
  },
  [TerrainResourceId.IVORY]: {
    id: TerrainResourceId.IVORY,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.PRODUCTION]: 1, [YieldId.GOLD]: 1 },
    ui: {
      name: 'Ivory',
      cssClass: 'm-resource-ivory',
    },
  },
  [TerrainResourceId.JADE]: {
    id: TerrainResourceId.JADE,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.CULTURE]: 1 },
    ui: {
      name: 'Jade',
      cssClass: 'm-resource-jade',
    },
  },
  [TerrainResourceId.MARBLE]: {
    id: TerrainResourceId.MARBLE,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.CULTURE]: 1 },
    ui: {
      name: 'marble',
      cssClass: 'm-resource-marble',
    },
  },
  [TerrainResourceId.MERCURY]: {
    id: TerrainResourceId.MERCURY,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.SCIENCE]: 1 },
    ui: {
      name: 'Mercury',
      cssClass: 'm-resource-mercury',
    },
  },
  [TerrainResourceId.OLIVES]: {
    id: TerrainResourceId.OLIVES,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.PRODUCTION]: 1, [YieldId.GOLD]: 1 },
    ui: {
      name: 'Olives',
      cssClass: 'm-resource-olives',
    },
  },
  [TerrainResourceId.PEARLS]: {
    id: TerrainResourceId.PEARLS,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.FAITH]: 1 },
    ui: {
      name: 'Pearls',
      cssClass: 'm-resource-pearls',
    },
  },
  [TerrainResourceId.SALT]: {
    id: TerrainResourceId.SALT,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.FOOD]: 1, [YieldId.GOLD]: 1 },
    ui: {
      name: 'Salt',
      cssClass: 'm-resource-salt',
    },
  },
  [TerrainResourceId.SILK]: {
    id: TerrainResourceId.SILK,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.CULTURE]: 1 },
    ui: {
      name: 'Silk',
      cssClass: 'm-resource-silk',
    },
  },
  [TerrainResourceId.SILVER]: {
    id: TerrainResourceId.SILVER,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.GOLD]: 3 },
    ui: {
      name: 'Silver',
      cssClass: 'm-resource-silver',
    },
  },
  [TerrainResourceId.SPICES]: {
    id: TerrainResourceId.SPICES,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.FOOD]: 2 },
    ui: {
      name:'Spices',
      cssClass: 'm-resource-spices',
    },
  },
  [TerrainResourceId.SUGAR]: {
    id: TerrainResourceId.SUGAR,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.FOOD]: 2 },
    ui: {
      name: 'Sugar',
      cssClass: 'm-resource-sugar',
    },
  },
  [TerrainResourceId.TEA]: {
    id: TerrainResourceId.TEA,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.SCIENCE]: 1 },
    ui: {
      name: 'Tea',
      cssClass: 'm-resource-tea',
    },
  },
  [TerrainResourceId.TOBACCO]: {
    id: TerrainResourceId.TOBACCO,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.FAITH]: 1 },
    ui: {
      name: 'Tobacco',
      cssClass: 'm-resource-tobacco',
    },
  },
  [TerrainResourceId.TRUFFLES]: {
    id: TerrainResourceId.TRUFFLES,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.GOLD]: 3 },
    ui: {
      name: 'Truffles',
      cssClass: 'm-resource-truffles',
    },
  },
  [TerrainResourceId.WHALES]: {
    id: TerrainResourceId.WHALES,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.FOOD]: 1, [YieldId.GOLD]: 1 },
    ui: {
      name: 'Whales',
      cssClass: 'm-resource-whales',
    },
  },
  [TerrainResourceId.WINE]: {
    id: TerrainResourceId.WINE,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.FOOD]: 1, [YieldId.GOLD]: 1 },
    ui: {
      name: 'Wine',
      cssClass: 'm-resource-wine',
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
      cssClass: 'm-improvement-airstrip',
    },
  },
  // +0.5 Housing, +1 Food (Mercantilism), +1 Production (Mercantilism), +1 Gold (Synthetic Materials)
  [TerrainImprovementId.CAMP]: {
    id: TerrainImprovementId.CAMP,
    yield: { [YieldId.GOLD]: 2 },
    ui: {
      name: 'Camp',
      cssClass: 'm-improvement-camp',
    },
  },
  // +0.5 Housing, +1 Food per 2 adjacent Farms (Feudalism until Replaceable Parts), +1 Food per adjacent Farm (Replaceable Parts)
  [TerrainImprovementId.FARM]: {
    id: TerrainImprovementId.FARM,
    yield: { [YieldId.FOOD]: 1 },
    ui: {
      name: 'Farm',
      cssClass: 'm-improvement-farm',
    },
  },
  // +0.5 Housing, +2 Gold (Cartography), +1 Food (Plastics)
  [TerrainImprovementId.FISHING_BOATS]: {
    id: TerrainImprovementId.FISHING_BOATS,
    yield: { [YieldId.FOOD]: 1 },
    ui: {
      name: 'Fishing Boats',
      cssClass: 'm-improvement-fishing-boats',
    },
  },
  [TerrainImprovementId.FORT]: {
    id: TerrainImprovementId.FORT,
    yield: {},
    ui: {
      name: 'Fort',
      cssClass: 'm-improvement-fort',
    },
  },
  // +1 Production (Steel), +1 Production (Cybernetics)
  [TerrainImprovementId.LUMBER_MILL]: {
    id: TerrainImprovementId.LUMBER_MILL,
    yield: { [YieldId.PRODUCTION]: 2 },
    ui: {
      name: 'Lumber Mill',
      cssClass: 'm-improvement-lumber-mill',
    },
  },
  // -1 Appeal, +1 Production (Apprenticeship), +1 Production (Industrialization), +1 Production (Smart materials),
  [TerrainImprovementId.MINE]: {
    id: TerrainImprovementId.MINE,
    yield: { [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Mine',
      cssClass: 'm-improvement-mine',
    },
  },
  [TerrainImprovementId.MISSILE_SILO]: {
    id: TerrainImprovementId.MISSILE_SILO,
    yield: {},
    ui: {
      name: 'Missile Silo',
      cssClass: 'm-improvement-missile-silo',
    },
  },
  [TerrainImprovementId.MOUNTAIN_TUNNEL]: {
    id: TerrainImprovementId.MOUNTAIN_TUNNEL,
    yield: {},
    ui: {
      name: 'Mountain Tunnel',
      cssClass: 'm-improvement-mountain-tunnel',
    },
  },
  // -1 Appeal
  [TerrainImprovementId.OFFSHORE_OIL_RIG]: {
    id: TerrainImprovementId.OFFSHORE_OIL_RIG,
    yield: { [YieldId.PRODUCTION]: 2 },
    ui: {
      name: 'Offshore Oil Rig',
      cssClass: 'm-improvement-offshore-oil-rig',
    },
  },
  [TerrainImprovementId.OFFSHORE_WIND_FARM]: {
    id: TerrainImprovementId.OFFSHORE_WIND_FARM,
    yield: { [YieldId.PRODUCTION]: 1, [YieldId.GOLD]: 1, [YieldId.POWER]: 2 },
    ui: {
      name: 'Offshore Wind Farm',
      cssClass: 'm-improvement-offshore-wind-farm',
    },
  },
  // -1 Appeal
  [TerrainImprovementId.OIL_WELL]: {
    id: TerrainImprovementId.OIL_WELL,
    yield: { [YieldId.PRODUCTION]: 2 },
    ui: {
      name: 'Oil Well',
      cssClass: 'm-improvement-oil-well',
    },
  },
  // +0.5 Housing, +1 Food (Exploration), +1 Production (Robotics)
  [TerrainImprovementId.PASTURE]: {
    id: TerrainImprovementId.PASTURE,
    yield: { [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Pasture',
      cssClass: 'm-improvement-pasture',
    },
  },
  // +0.5 Housing, +1 Food (Scientific Theory), +2 Gold (Globalization)
  [TerrainImprovementId.PLANTATION]: {
    id: TerrainImprovementId.PLANTATION,
    yield: { [YieldId.GOLD]: 2 },
    ui: {
      name: 'Plantation',
      cssClass: 'm-improvement-plantation',
    },
  },
  // -1 Appeal, +1 Production (Gunpowder), +1 Production (Rocketry), +1 Production (Predictive systems)
  [TerrainImprovementId.QUARRY]: {
    id: TerrainImprovementId.QUARRY,
    yield: { [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Quarry',
      cssClass: 'm-improvement-quarry',
    },
  },
  // Appeal x1 to gold, Appeal x 2 to tourism
  [TerrainImprovementId.SEASIDE_RESORT]: {
    id: TerrainImprovementId.SEASIDE_RESORT,
    yield: {},
    ui: {
      name: 'Seaside Resort',
      cssClass: 'm-improvement-seaside-resort',
    },
  },
  // +1 Production from each adjacent Fishing Boat, Fishing Boats receive +1 Production from each adjacent Seastead, +1 Culture and Tourism for each adjacent Reef, +2 Housing.
  [TerrainImprovementId.SEASTEAD]: {
    id: TerrainImprovementId.SEASTEAD,
    yield: { [YieldId.FOOD]: 1 },
    ui: {
      name: 'Seastead',
      cssClass: 'm-improvement-seastead',
    },
  },
  // +1 Amenities, Provides Tourism equal to the tile's Appeal
  [TerrainImprovementId.SKI_RESORT]: {
    id: TerrainImprovementId.SKI_RESORT,
    yield: {},
    ui: {
      name: 'Ski Resort',
      cssClass: 'm-improvement-ski-resort',
    },
  },
  [TerrainImprovementId.SOLAR_FARM]: {
    id: TerrainImprovementId.SOLAR_FARM,
    yield: { [YieldId.PRODUCTION]: 1, [YieldId.GOLD]: 1, [YieldId.POWER]: 2 },
    ui: {
      name: 'Solar Farm',
      cssClass: 'm-improvement-solar-farm',
    },
  },
  [TerrainImprovementId.WIND_FARM]: {
    id: TerrainImprovementId.WIND_FARM,
    yield: { [YieldId.PRODUCTION]: 1, [YieldId.GOLD]: 1, [YieldId.POWER]: 2 },
    ui: {
      name: 'Wind Farm',
      cssClass: 'm-improvement-wind-farm',
    },
  }
}
export const TERRAIN_IMPROVEMENT_LIST: TerrainImprovement[] = Object.keys(TERRAIN_IMPROVEMENT_SET).map(key => TERRAIN_IMPROVEMENT_SET[key]);
