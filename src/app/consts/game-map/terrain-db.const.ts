import {
  TerrainBaseId,
  TerrainFeatureId,
  TerrainResourceId,
  TerrainImprovementId,
  TerrainResourceTypeId,
  TerrainUi
} from '../../models/game-map/terrain';
import {Yield, YieldId} from '../../models/game-map/yield';



interface TerrainBase {
  id: TerrainBaseId;
  yield: Partial<Yield>;
  ui: TerrainUi;
}

type TerrainBaseDb = {
  [key in TerrainBaseId]: TerrainBase;
}



interface TerrainFeature {
  id: TerrainFeatureId;
  yield: Partial<Yield>;
  ui: TerrainUi;
}

// All but TerrainFeatureId.NONE
type TerrainFeatureDb = Omit<{[key in TerrainFeatureId]: TerrainFeature;}, TerrainFeatureId.NONE>;



interface TerrainResource {
  id: TerrainResourceId;
  type: TerrainResourceTypeId;
  yield: Partial<Yield>;
  ui: TerrainUi;
}

// All but TerrainResourceId.NONE
type TerrainResourceDb = Omit<{[key in TerrainResourceId]: TerrainResource;}, TerrainResourceId.NONE>;



interface TerrainImprovement {
  id: TerrainImprovementId;
  yield: Partial<Yield>;
  ui: TerrainUi;
}

// All but TerrainImprovementId.NONE
type TerrainImprovementDb = Omit<{[key in TerrainImprovementId]: TerrainImprovement;}, TerrainImprovementId.NONE>;



export const TERRAIN_BASE_DB: TerrainBaseDb = {
  [TerrainBaseId.GRASSLAND_FLAT]: {
    id: TerrainBaseId.GRASSLAND_FLAT,
    yield: { [YieldId.FOOD]: 2 },
    ui: {
      name: 'Grassland',
      cssClassBase: 'm-base-grassland-flat',
    },
  },
  [TerrainBaseId.GRASSLAND_HILLS]: {
    id: TerrainBaseId.GRASSLAND_HILLS,
    yield: { [YieldId.FOOD]: 2, [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Grassland (Hills)',
      cssClassBase: 'm-base-grassland-hills',
    },
  },
  [TerrainBaseId.GRASSLAND_MOUNTAIN]: {
    id: TerrainBaseId.GRASSLAND_MOUNTAIN,
    yield: {},
    ui: {
      name: 'Grassland (Mountain)',
      cssClassBase: 'm-base-grassland-mountain',
    },
  },
  [TerrainBaseId.PLAINS_FLAT]: {
    id: TerrainBaseId.PLAINS_FLAT,
    yield: { [YieldId.FOOD]: 1, [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Plains',
      cssClassBase: 'm-base-plains-flat',
    },
  },
  [TerrainBaseId.PLAINS_HILLS]: {
    id: TerrainBaseId.PLAINS_HILLS,
    yield: { [YieldId.FOOD]: 1, [YieldId.PRODUCTION]: 2 },
    ui: {
      name: 'Plains (Hills)',
      cssClassBase: 'm-base-plains-hills',
    },
  },
  [TerrainBaseId.PLAINS_MOUNTAIN]: {
    id: TerrainBaseId.PLAINS_MOUNTAIN,
    yield: {},
    ui: {
      name: 'Plains (Mountain)',
      cssClassBase: 'm-base-plains-mountain',
    },
  },
  [TerrainBaseId.DESERT_FLAT]: {
    id: TerrainBaseId.DESERT_FLAT,
    yield: {},
    ui: {
      name: 'Desert',
      cssClassBase: 'm-base-desert-flat',
    },
  },
  [TerrainBaseId.DESERT_HILLS]: {
    id: TerrainBaseId.DESERT_HILLS,
    yield: { [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Desert (Hills)',
      cssClassBase: 'm-base-desert-hills',
    },
  },
  [TerrainBaseId.DESERT_MOUNTAIN]: {
    id: TerrainBaseId.DESERT_MOUNTAIN,
    yield: {},
    ui: {
      name: 'Desert (Mountain)',
      cssClassBase: 'm-base-desert-mountain',
    },
  },
  [TerrainBaseId.TUNDRA_FLAT]: {
    id: TerrainBaseId.TUNDRA_FLAT,
    yield: { [YieldId.FOOD]: 1 },
    ui: {
      name: 'Tundra',
      cssClassBase: 'm-base-tundra-flat',
    },
  },
  [TerrainBaseId.TUNDRA_HILLS]: {
    id: TerrainBaseId.TUNDRA_HILLS,
    yield: { [YieldId.FOOD]: 1, [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Tundra (Hills)',
      cssClassBase: 'm-base-tundra-hills',
    },
  },
  [TerrainBaseId.TUNDRA_MOUNTAIN]: {
    id: TerrainBaseId.TUNDRA_MOUNTAIN,
    yield: {},
    ui: {
      name: 'Tundra (Mountain)',
      cssClassBase: 'm-base-tundra-mountain',
    },
  },
  [TerrainBaseId.SNOW_FLAT]: {
    id: TerrainBaseId.SNOW_FLAT,
    yield: {},
    ui: {
      name: 'Snow',
      cssClassBase: 'm-base-snow-flat',
    },
  },
  [TerrainBaseId.SNOW_HILLS]: {
    id: TerrainBaseId.SNOW_HILLS,
    yield: { [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Snow (Hills)',
      cssClassBase: 'm-base-snow-hills',
    },
  },
  [TerrainBaseId.SNOW_MOUNTAIN]: {
    id: TerrainBaseId.SNOW_MOUNTAIN,
    yield: {},
    ui: {
      name: 'Snow (Mountain)',
      cssClassBase: 'm-base-snow-mountain',
    },
  },
  [TerrainBaseId.LAKE]: {
    id: TerrainBaseId.LAKE,
    yield: { [YieldId.FOOD]: 1, [YieldId.GOLD]: 1 },
    ui: {
      name: 'Lake',
      cssClassBase: 'm-base-lake',
    },
  },
  [TerrainBaseId.COAST]: {
    id: TerrainBaseId.COAST,
    yield: { [YieldId.FOOD]: 1, [YieldId.GOLD]: 1 },
    ui: {
      name: 'Coast',
      cssClassBase: 'm-base-coast',
    },
  },
  [TerrainBaseId.OCEAN]: {
    id: TerrainBaseId.OCEAN,
    yield: { [YieldId.FOOD]: 1 },
    ui: {
      name: 'Ocean',
      cssClassBase: 'm-base-ocean',
    },
  }
}
export const TERRAIN_BASE_LIST: TerrainBase[] = Object.keys(TERRAIN_BASE_DB).map(key => TERRAIN_BASE_DB[key]);



export const TERRAIN_FEATURE_DB: TerrainFeatureDb = {
  [TerrainFeatureId.FLOODPLAINS]: {
    id: TerrainFeatureId.FLOODPLAINS,
    yield: { [YieldId.FOOD]: 1 },
    ui: {
      name: 'Floodplains',
      cssClassBase: 'm-feature-floodplains',
    },
  },
  [TerrainFeatureId.ICE]: {
    id: TerrainFeatureId.ICE,
    yield: {},
    ui: {
      name: 'Ice',
      cssClassBase: 'm-feature-ice',
    },
  },
  [TerrainFeatureId.MARSH]: {
    id: TerrainFeatureId.MARSH,
    yield: { [YieldId.FOOD]: 1 },
    ui: {
      name: 'Marsh',
      cssClassBase: 'm-feature-marsh',
    },
  },
  [TerrainFeatureId.OASIS]: {
    id: TerrainFeatureId.OASIS,
    yield: { [YieldId.FOOD]: 3, [YieldId.GOLD]: 1 },
    ui: {
      name: 'Oasis',
      cssClassBase: 'm-feature-oasis',
    },
  },
  [TerrainFeatureId.RAINFOREST]: {
    id: TerrainFeatureId.RAINFOREST,
    yield: { [YieldId.FOOD]: 1 },
    ui: {
      name: 'Rainforest',
      cssClassBase: 'm-feature-rainforest',
    },
  },
  [TerrainFeatureId.REEF]: {
    id: TerrainFeatureId.REEF,
    yield: { [YieldId.FOOD]: 1, [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Reef',
      cssClassBase: 'm-feature-reef',
    },
  },
  [TerrainFeatureId.WOODS]: {
    id: TerrainFeatureId.WOODS,
    yield: { [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Woods',
      cssClassBase: 'm-feature-woods',
    },
  }
}
export const TERRAIN_FEATURE_LIST: TerrainFeature[] = Object.keys(TERRAIN_FEATURE_DB).map(key => TERRAIN_FEATURE_DB[key]);



export const TERRAIN_RESOURCE_DB: TerrainResourceDb = {
  [TerrainResourceId.BANANAS]: {
    id: TerrainResourceId.BANANAS,
    type: TerrainResourceTypeId.BONUS,
    yield: {  [YieldId.FOOD]: 1 },
    ui: {
      name: 'Bananas',
      cssClassBase: 'm-resource-bananas',
    },
  },
  [TerrainResourceId.CATTLE]: {
    id: TerrainResourceId.CATTLE,
    type: TerrainResourceTypeId.BONUS,
    yield: { [YieldId.FOOD]: 1 },
    ui: {
      name: 'Cattle',
      cssClassBase: 'm-resource-cattle',
    },
  },
  [TerrainResourceId.COPPER]: {
    id: TerrainResourceId.COPPER,
    type: TerrainResourceTypeId.BONUS,
    yield: { [YieldId.GOLD]: 2 },
    ui: {
      name: 'Copper',
      cssClassBase: 'm-resource-copper',
    },
  },
  [TerrainResourceId.CRABS]: {
    id: TerrainResourceId.CRABS,
    type: TerrainResourceTypeId.BONUS,
    yield: { [YieldId.GOLD]: 2 },
    ui: {
      name: 'Crabs',
      cssClassBase: 'm-resource-crabs',
    },
  },
  [TerrainResourceId.DEER]: {
    id: TerrainResourceId.DEER,
    type: TerrainResourceTypeId.BONUS,
    yield: { [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Deer',
      cssClassBase: 'm-resource-deer',
    },
  },
  [TerrainResourceId.FISH]: {
    id: TerrainResourceId.FISH,
    type: TerrainResourceTypeId.BONUS,
    yield: {  [YieldId.FOOD]: 1 },
    ui: {
      name: 'Fish',
      cssClassBase: 'm-resource-fish',
    },
  },
  [TerrainResourceId.RICE]: {
    id: TerrainResourceId.RICE,
    type: TerrainResourceTypeId.BONUS,
    yield: {  [YieldId.FOOD]: 1 },
    ui: {
      name: 'Rice',
      cssClassBase: 'm-resource-rice',
    },
  },
  [TerrainResourceId.SHEEP]: {
    id: TerrainResourceId.SHEEP,
    type: TerrainResourceTypeId.BONUS,
    yield: {  [YieldId.FOOD]: 1 },
    ui: {
      name: 'Sheep',
      cssClassBase: 'm-resource-sheep',
    },
  },
  [TerrainResourceId.STONE]: {
    id: TerrainResourceId.STONE,
    type: TerrainResourceTypeId.BONUS,
    yield: { [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Stone',
      cssClassBase: 'm-resource-stone',
    },
  },
  [TerrainResourceId.WHEAT]: {
    id: TerrainResourceId.WHEAT,
    type: TerrainResourceTypeId.BONUS,
    yield: { [YieldId.FOOD]: 1 },
    ui: {
      name: 'Wheat',
      cssClassBase: 'm-resource-wheat',
    },
  },
  [TerrainResourceId.ALUMINUM]: {
    id: TerrainResourceId.ALUMINUM,
    type: TerrainResourceTypeId.STRATEGIC,
    yield: { [YieldId.SCIENCE]: 1 },
    ui: {
      name: 'Aluminum',
      cssClassBase: 'm-resource-aluminum',
    },
  },
  [TerrainResourceId.COAL]: {
    id: TerrainResourceId.COAL,
    type: TerrainResourceTypeId.STRATEGIC,
    yield: { [YieldId.PRODUCTION]: 2 },
    ui: {
      name: 'Coal',
      cssClassBase: 'm-resource-coal',
    },
  },
  [TerrainResourceId.HORSES]: {
    id: TerrainResourceId.HORSES,
    type: TerrainResourceTypeId.STRATEGIC,
    yield: { [YieldId.FOOD]: 1, [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Horses',
      cssClassBase: 'm-resource-horses',
    },
  },
  [TerrainResourceId.IRON]: {
    id: TerrainResourceId.IRON,
    type: TerrainResourceTypeId.STRATEGIC,
    yield: { [YieldId.SCIENCE]: 1 },
    ui: {
      name: 'Iron',
      cssClassBase: 'm-resource-iron',
    },
  },
  [TerrainResourceId.NITER]: {
    id: TerrainResourceId.NITER,
    type: TerrainResourceTypeId.STRATEGIC,
    yield: { [YieldId.FOOD]: 1, [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Niter',
      cssClassBase: 'm-resource-niter',
    },
  },
  [TerrainResourceId.OIL]: {
    id: TerrainResourceId.OIL,
    type: TerrainResourceTypeId.STRATEGIC,
    yield: { [YieldId.PRODUCTION]: 3 },
    ui: {
      name: 'Oil',
      cssClassBase: 'm-resource-oil',
    },
  },
  [TerrainResourceId.URANIUM]: {
    id: TerrainResourceId.URANIUM,
    type: TerrainResourceTypeId.STRATEGIC,
    yield: { [YieldId.PRODUCTION]: 2 },
    ui: {
      name: 'Uranium',
      cssClassBase: 'm-resource-uranium',
    },
  },
  [TerrainResourceId.AMBER]: {
    id: TerrainResourceId.AMBER,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.CULTURE]: 1 },
    ui: {
      name: 'Amber',
      cssClassBase: 'm-resource-amber',
    },
  },
  [TerrainResourceId.CITRUS]: {
    id: TerrainResourceId.CITRUS,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.FOOD]: 2 },
    ui: {
      name: 'Citrus',
      cssClassBase: 'm-resource-citrus',
    },
  },
  [TerrainResourceId.COCOA]: {
    id: TerrainResourceId.COCOA,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.GOLD]: 3 },
    ui: {
      name: 'Cocoa',
      cssClassBase: 'm-resource-cocoa',
    },
  },
  [TerrainResourceId.COFFEE]: {
    id: TerrainResourceId.COFFEE,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.CULTURE]: 1 },
    ui: {
      name: 'Coffee',
      cssClassBase: 'm-resource-coffee',
    },
  },
  [TerrainResourceId.COTTON]: {
    id: TerrainResourceId.COTTON,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.GOLD]: 3 },
    ui: {
      name: 'Cotton',
      cssClassBase: 'm-resource-cotton',
    },
  },
  [TerrainResourceId.DIAMONDS]: {
    id: TerrainResourceId.DIAMONDS,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.GOLD]: 3 },
    ui: {
      name: 'Diamonds',
      cssClassBase: 'm-resource-diamonds',
    },
  },
  [TerrainResourceId.DYES]: {
    id: TerrainResourceId.DYES,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.FAITH]: 1 },
    ui: {
      name: 'Dyes',
      cssClassBase: 'm-resource-dyes',
    },
  },
  [TerrainResourceId.FURS]: {
    id: TerrainResourceId.FURS,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.FOOD]: 1, [YieldId.GOLD]: 1 },
    ui: {
      name: 'Furs',
      cssClassBase: 'm-resource-furs',
    },
  },
  [TerrainResourceId.GYPSUM]: {
    id: TerrainResourceId.GYPSUM,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.PRODUCTION]: 1, [YieldId.GOLD]: 1 },
    ui: {
      name: 'Gypsum',
      cssClassBase: 'm-resource-gypsum',
    },
  },
  [TerrainResourceId.INCENSE]: {
    id: TerrainResourceId.INCENSE,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.FAITH]: 1 },
    ui: {
      name: 'Incense',
      cssClassBase: 'm-resource-incense',
    },
  },
  [TerrainResourceId.IVORY]: {
    id: TerrainResourceId.IVORY,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.PRODUCTION]: 1, [YieldId.GOLD]: 1 },
    ui: {
      name: 'Ivory',
      cssClassBase: 'm-resource-ivory',
    },
  },
  [TerrainResourceId.JADE]: {
    id: TerrainResourceId.JADE,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.CULTURE]: 1 },
    ui: {
      name: 'Jade',
      cssClassBase: 'm-resource-jade',
    },
  },
  [TerrainResourceId.MARBLE]: {
    id: TerrainResourceId.MARBLE,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.CULTURE]: 1 },
    ui: {
      name: 'marble',
      cssClassBase: 'm-resource-marble',
    },
  },
  [TerrainResourceId.MERCURY]: {
    id: TerrainResourceId.MERCURY,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.SCIENCE]: 1 },
    ui: {
      name: 'Mercury',
      cssClassBase: 'm-resource-mercury',
    },
  },
  [TerrainResourceId.OLIVES]: {
    id: TerrainResourceId.OLIVES,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.PRODUCTION]: 1, [YieldId.GOLD]: 1 },
    ui: {
      name: 'Olives',
      cssClassBase: 'm-resource-olives',
    },
  },
  [TerrainResourceId.PEARLS]: {
    id: TerrainResourceId.PEARLS,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.FAITH]: 1 },
    ui: {
      name: 'Pearls',
      cssClassBase: 'm-resource-pearls',
    },
  },
  [TerrainResourceId.SALT]: {
    id: TerrainResourceId.SALT,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.FOOD]: 1, [YieldId.GOLD]: 1 },
    ui: {
      name: 'Salt',
      cssClassBase: 'm-resource-salt',
    },
  },
  [TerrainResourceId.SILK]: {
    id: TerrainResourceId.SILK,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.CULTURE]: 1 },
    ui: {
      name: 'Silk',
      cssClassBase: 'm-resource-silk',
    },
  },
  [TerrainResourceId.SILVER]: {
    id: TerrainResourceId.SILVER,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.GOLD]: 3 },
    ui: {
      name: 'Silver',
      cssClassBase: 'm-resource-silver',
    },
  },
  [TerrainResourceId.SPICES]: {
    id: TerrainResourceId.SPICES,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.FOOD]: 2 },
    ui: {
      name:'Spices',
      cssClassBase: 'm-resource-spices',
    },
  },
  [TerrainResourceId.SUGAR]: {
    id: TerrainResourceId.SUGAR,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.FOOD]: 2 },
    ui: {
      name: 'Sugar',
      cssClassBase: 'm-resource-sugar',
    },
  },
  [TerrainResourceId.TEA]: {
    id: TerrainResourceId.TEA,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.SCIENCE]: 1 },
    ui: {
      name: 'Tea',
      cssClassBase: 'm-resource-tea',
    },
  },
  [TerrainResourceId.TOBACCO]: {
    id: TerrainResourceId.TOBACCO,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.FAITH]: 1 },
    ui: {
      name: 'Tobacco',
      cssClassBase: 'm-resource-tobacco',
    },
  },
  [TerrainResourceId.TRUFFLES]: {
    id: TerrainResourceId.TRUFFLES,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.GOLD]: 3 },
    ui: {
      name: 'Truffles',
      cssClassBase: 'm-resource-truffles',
    },
  },
  [TerrainResourceId.WHALES]: {
    id: TerrainResourceId.WHALES,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.FOOD]: 1, [YieldId.GOLD]: 1 },
    ui: {
      name: 'Whales',
      cssClassBase: 'm-resource-whales',
    },
  },
  [TerrainResourceId.WINE]: {
    id: TerrainResourceId.WINE,
    type: TerrainResourceTypeId.LUXURY,
    yield: { [YieldId.FOOD]: 1, [YieldId.GOLD]: 1 },
    ui: {
      name: 'Wine',
      cssClassBase: 'm-resource-wine',
    },
  }
}
export const TERRAIN_RESOURCE_LIST: TerrainResource[] = Object.keys(TERRAIN_RESOURCE_DB).map(key => TERRAIN_RESOURCE_DB[key]);



export const TERRAIN_IMPROVEMENT_DB: TerrainImprovementDb = {
  // -1 Appeal
  [TerrainImprovementId.AIRSTRIP]: {
    id: TerrainImprovementId.AIRSTRIP,
    yield: {},
    ui: {
      name: 'Airstrip',
      cssClassBase: 'm-improvement-airstrip',
    },
  },
  // +0.5 Housing, +1 Food (Mercantilism), +1 Production (Mercantilism), +1 Gold (Synthetic Materials)
  [TerrainImprovementId.CAMP]: {
    id: TerrainImprovementId.CAMP,
    yield: { [YieldId.GOLD]: 2 },
    ui: {
      name: 'Camp',
      cssClassBase: 'm-improvement-camp',
    },
  },
  // +0.5 Housing, +1 Food per 2 adjacent Farms (Feudalism until Replaceable Parts), +1 Food per adjacent Farm (Replaceable Parts)
  [TerrainImprovementId.FARM]: {
    id: TerrainImprovementId.FARM,
    yield: { [YieldId.FOOD]: 1 },
    ui: {
      name: 'Farm',
      cssClassBase: 'm-improvement-farm',
    },
  },
  // +0.5 Housing, +2 Gold (Cartography), +1 Food (Plastics)
  [TerrainImprovementId.FISHING_BOATS]: {
    id: TerrainImprovementId.FISHING_BOATS,
    yield: { [YieldId.FOOD]: 1 },
    ui: {
      name: 'Fishing Boats',
      cssClassBase: 'm-improvement-fishing-boats',
    },
  },
  [TerrainImprovementId.FORT]: {
    id: TerrainImprovementId.FORT,
    yield: {},
    ui: {
      name: 'Fort',
      cssClassBase: 'm-improvement-fort',
    },
  },
  // +1 Production (Steel), +1 Production (Cybernetics)
  [TerrainImprovementId.LUMBER_MILL]: {
    id: TerrainImprovementId.LUMBER_MILL,
    yield: { [YieldId.PRODUCTION]: 2 },
    ui: {
      name: 'Lumber Mill',
      cssClassBase: 'm-improvement-lumber-mill',
    },
  },
  // -1 Appeal, +1 Production (Apprenticeship), +1 Production (Industrialization), +1 Production (Smart materials),
  [TerrainImprovementId.MINE]: {
    id: TerrainImprovementId.MINE,
    yield: { [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Mine',
      cssClassBase: 'm-improvement-mine',
    },
  },
  [TerrainImprovementId.MISSILE_SILO]: {
    id: TerrainImprovementId.MISSILE_SILO,
    yield: {},
    ui: {
      name: 'Missile Silo',
      cssClassBase: 'm-improvement-missile-silo',
    },
  },
  [TerrainImprovementId.MOUNTAIN_TUNNEL]: {
    id: TerrainImprovementId.MOUNTAIN_TUNNEL,
    yield: {},
    ui: {
      name: 'Mountain Tunnel',
      cssClassBase: 'm-improvement-mountain-tunnel',
    },
  },
  // -1 Appeal
  [TerrainImprovementId.OFFSHORE_OIL_RIG]: {
    id: TerrainImprovementId.OFFSHORE_OIL_RIG,
    yield: { [YieldId.PRODUCTION]: 2 },
    ui: {
      name: 'Offshore Oil Rig',
      cssClassBase: 'm-improvement-offshore-oil-rig',
    },
  },
  [TerrainImprovementId.OFFSHORE_WIND_FARM]: {
    id: TerrainImprovementId.OFFSHORE_WIND_FARM,
    yield: { [YieldId.PRODUCTION]: 1, [YieldId.GOLD]: 1, [YieldId.POWER]: 2 },
    ui: {
      name: 'Offshore Wind Farm',
      cssClassBase: 'm-improvement-offshore-wind-farm',
    },
  },
  // -1 Appeal
  [TerrainImprovementId.OIL_WELL]: {
    id: TerrainImprovementId.OIL_WELL,
    yield: { [YieldId.PRODUCTION]: 2 },
    ui: {
      name: 'Oil Well',
      cssClassBase: 'm-improvement-oil-well',
    },
  },
  // +0.5 Housing, +1 Food (Exploration), +1 Production (Robotics)
  [TerrainImprovementId.PASTURE]: {
    id: TerrainImprovementId.PASTURE,
    yield: { [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Pasture',
      cssClassBase: 'm-improvement-pasture',
    },
  },
  // +0.5 Housing, +1 Food (Scientific Theory), +2 Gold (Globalization)
  [TerrainImprovementId.PLANTATION]: {
    id: TerrainImprovementId.PLANTATION,
    yield: { [YieldId.GOLD]: 2 },
    ui: {
      name: 'Plantation',
      cssClassBase: 'm-improvement-plantation',
    },
  },
  // -1 Appeal, +1 Production (Gunpowder), +1 Production (Rocketry), +1 Production (Predictive systems)
  [TerrainImprovementId.QUARRY]: {
    id: TerrainImprovementId.QUARRY,
    yield: { [YieldId.PRODUCTION]: 1 },
    ui: {
      name: 'Quarry',
      cssClassBase: 'm-improvement-quarry',
    },
  },
  // Appeal x1 to gold, Appeal x 2 to tourism
  [TerrainImprovementId.SEASIDE_RESORT]: {
    id: TerrainImprovementId.SEASIDE_RESORT,
    yield: {},
    ui: {
      name: 'Seaside Resort',
      cssClassBase: 'm-improvement-seaside-resort',
    },
  },
  // +1 Production from each adjacent Fishing Boat, Fishing Boats receive +1 Production from each adjacent Seastead, +1 Culture and Tourism for each adjacent Reef, +2 Housing.
  [TerrainImprovementId.SEASTEAD]: {
    id: TerrainImprovementId.SEASTEAD,
    yield: { [YieldId.FOOD]: 1 },
    ui: {
      name: 'Seastead',
      cssClassBase: 'm-improvement-seastead',
    },
  },
  // +1 Amenities, Provides Tourism equal to the tile's Appeal
  [TerrainImprovementId.SKI_RESORT]: {
    id: TerrainImprovementId.SKI_RESORT,
    yield: {},
    ui: {
      name: 'Ski Resort',
      cssClassBase: 'm-improvement-ski-resort',
    },
  },
  [TerrainImprovementId.SOLAR_FARM]: {
    id: TerrainImprovementId.SOLAR_FARM,
    yield: { [YieldId.PRODUCTION]: 1, [YieldId.GOLD]: 1, [YieldId.POWER]: 2 },
    ui: {
      name: 'Solar Farm',
      cssClassBase: 'm-improvement-solar-farm',
    },
  },
  [TerrainImprovementId.WIND_FARM]: {
    id: TerrainImprovementId.WIND_FARM,
    yield: { [YieldId.PRODUCTION]: 1, [YieldId.GOLD]: 1, [YieldId.POWER]: 2 },
    ui: {
      name: 'Wind Farm',
      cssClassBase: 'm-improvement-wind-farm',
    },
  }
}
export const TERRAIN_IMPROVEMENT_LIST: TerrainImprovement[] = Object.keys(TERRAIN_IMPROVEMENT_DB).map(key => TERRAIN_IMPROVEMENT_DB[key]);
