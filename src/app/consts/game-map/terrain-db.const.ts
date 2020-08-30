import {
  TerrainBaseId,
  TerrainFeatureId,
  TerrainResourceId,
  TerrainImprovementId,
  TerrainResourceTypeId
} from '../../models/game-map/terrain';
import {Yield, YieldId} from '../../models/game-map/yield';



interface TerrainBase {
  id: TerrainBaseId;
  name: string;
  cssClass: string;
  yield: Partial<Yield>;
}

interface TerrainFeature {
  id: TerrainFeatureId;
  name: string;
  cssClass: string;
  yield: Partial<Yield>;
}

interface TerrainResource {
  id: TerrainResourceId;
  name: string;
  cssClass: string;
  yield: Partial<Yield>;
  type: TerrainResourceTypeId;
}

interface TerrainImprovement {
  id: TerrainImprovementId;
  name: string;
  cssClass: string;
  yield: Partial<Yield>;
}

type TerrainBaseDb = {
  [key in TerrainBaseId]: TerrainBase;
}

type TerrainFeatureDb = {
  [key in TerrainFeatureId]: TerrainFeature;
}

type TerrainResourceDb = {
  [key in TerrainResourceId]: TerrainResource;
}

type TerrainImprovementDb = {
  [key in TerrainImprovementId]: TerrainImprovement;
}



export const TERRAIN_BASE_DB: TerrainBaseDb = {
  [TerrainBaseId.GRASSLAND_FLAT]: {
    id: TerrainBaseId.GRASSLAND_FLAT,
    name: 'Grassland',
    cssClass: 'm-grassland-flat',
    yield: { [YieldId.FOOD]: 2 }
  },
  [TerrainBaseId.GRASSLAND_HILLS]: {
    id: TerrainBaseId.GRASSLAND_HILLS,
    name: 'Grassland (Hills)',
    cssClass: 'm-grassland-hills',
    yield: { [YieldId.FOOD]: 2, [YieldId.PRODUCTION]: 1 }
  },
  [TerrainBaseId.GRASSLAND_MOUNTAIN]: {
    id: TerrainBaseId.GRASSLAND_MOUNTAIN,
    name: 'Grassland (Mountain)',
    cssClass: 'm-grassland-mountain',
    yield: {}
  },
  [TerrainBaseId.PLAINS_FLAT]: {
    id: TerrainBaseId.PLAINS_FLAT,
    name: 'Plains',
    cssClass: 'm-plains-flat',
    yield: { [YieldId.FOOD]: 1, [YieldId.PRODUCTION]: 1 }
  },
  [TerrainBaseId.PLAINS_HILLS]: {
    id: TerrainBaseId.PLAINS_HILLS,
    name: 'Plains (Hills)',
    cssClass: 'm-plains-hills',
    yield: { [YieldId.FOOD]: 1, [YieldId.PRODUCTION]: 2 }
  },
  [TerrainBaseId.PLAINS_MOUNTAIN]: {
    id: TerrainBaseId.PLAINS_MOUNTAIN,
    name: 'Plains (Mountain)',
    cssClass: 'm-plains-mountain',
    yield: {}
  },
  [TerrainBaseId.DESERT_FLAT]: {
    id: TerrainBaseId.DESERT_FLAT,
    name: 'Desert',
    cssClass: 'm-desert-flat',
    yield: {}
  },
  [TerrainBaseId.DESERT_HILLS]: {
    id: TerrainBaseId.DESERT_HILLS,
    name: 'Desert (Hills)',
    cssClass: 'm-desert-hills',
    yield: { [YieldId.PRODUCTION]: 1 }
  },
  [TerrainBaseId.DESERT_MOUNTAIN]: {
    id: TerrainBaseId.DESERT_MOUNTAIN,
    name: 'Desert (Mountain)',
    cssClass: 'm-desert-mountain',
    yield: {}
  },
  [TerrainBaseId.TUNDRA_FLAT]: {
    id: TerrainBaseId.TUNDRA_FLAT,
    name: 'Tundra',
    cssClass: 'm-tundra-flat',
    yield: { [YieldId.FOOD]: 1 }
  },
  [TerrainBaseId.TUNDRA_HILLS]: {
    id: TerrainBaseId.TUNDRA_HILLS,
    name: 'Tundra (Hills)',
    cssClass: 'm-tundra-hills',
    yield: { [YieldId.FOOD]: 1, [YieldId.PRODUCTION]: 1 }
  },
  [TerrainBaseId.TUNDRA_MOUNTAIN]: {
    id: TerrainBaseId.TUNDRA_MOUNTAIN,
    name: 'Tundra (Mountain)',
    cssClass: 'm-tundra-mountain',
    yield: {}
  },
  [TerrainBaseId.SNOW_FLAT]: {
    id: TerrainBaseId.SNOW_FLAT,
    name: 'Snow',
    cssClass: 'm-snow-flat',
    yield: {}
  },
  [TerrainBaseId.SNOW_HILLS]: {
    id: TerrainBaseId.SNOW_HILLS,
    name: 'Snow (Hills)',
    cssClass: 'm-snow-hills',
    yield: { [YieldId.PRODUCTION]: 1 }
  },
  [TerrainBaseId.SNOW_MOUNTAIN]: {
    id: TerrainBaseId.SNOW_MOUNTAIN,
    name: 'Snow (Mountain)',
    cssClass: 'm-snow-mountain',
    yield: {}
  },
  [TerrainBaseId.LAKE]: {
    id: TerrainBaseId.LAKE,
    name: 'Lake',
    cssClass: 'm-lake',
    yield: { [YieldId.FOOD]: 1, [YieldId.GOLD]: 1 }
  },
  [TerrainBaseId.COAST]: {
    id: TerrainBaseId.COAST,
    name: 'Coast',
    cssClass: 'm-coast',
    yield: { [YieldId.FOOD]: 1, [YieldId.GOLD]: 1 }
  },
  [TerrainBaseId.OCEAN]: {
    id: TerrainBaseId.OCEAN,
    name: 'Ocean',
    cssClass: 'm-ocean',
    yield: { [YieldId.FOOD]: 1 }
  }
}
export const TERRAIN_BASE_LIST: TerrainBase[] = Object.keys(TERRAIN_BASE_DB).map(key => TERRAIN_BASE_DB[key]);



export const TERRAIN_FEATURE_DB: TerrainFeatureDb = {
  [TerrainFeatureId.NONE]: {
    id: TerrainFeatureId.NONE,
    name: '',
    cssClass: 'm-feature-none',
    yield: {}
  },
  [TerrainFeatureId.FLOODPLAINS]: {
    id: TerrainFeatureId.FLOODPLAINS,
    name: 'Floodplains',
    cssClass: 'm-feature-floodplains',
    yield: { [YieldId.FOOD]: 1 }
  },
  [TerrainFeatureId.ICE]: {
    id: TerrainFeatureId.ICE,
    name: 'Ice',
    cssClass: 'm-feature-ice',
    yield: {}
  },
  [TerrainFeatureId.MARSH]: {
    id: TerrainFeatureId.MARSH,
    name: 'Marsh',
    cssClass: 'm-feature-marsh',
    yield: { [YieldId.FOOD]: 1 }
  },
  [TerrainFeatureId.OASIS]: {
    id: TerrainFeatureId.OASIS,
    name: 'Oasis',
    cssClass: 'm-feature-oasis',
    yield: { [YieldId.FOOD]: 3, [YieldId.GOLD]: 1 }
  },
  [TerrainFeatureId.RAINFOREST]: {
    id: TerrainFeatureId.RAINFOREST,
    name: 'Rainforest',
    cssClass: 'm-feature-rainforest',
    yield: { [YieldId.FOOD]: 1 }
  },
  [TerrainFeatureId.REEF]: {
    id: TerrainFeatureId.REEF,
    name: 'Reef',
    cssClass: 'm-feature-reef',
    yield: { [YieldId.FOOD]: 1, [YieldId.PRODUCTION]: 1 }
  },
  [TerrainFeatureId.WOODS]: {
    id: TerrainFeatureId.WOODS,
    name: 'Woods',
    cssClass: 'm-feature-woods',
    yield: { [YieldId.PRODUCTION]: 1 }
  }
}
export const TERRAIN_FEATURE_LIST: TerrainFeature[] = Object.keys(TERRAIN_FEATURE_DB).map(key => TERRAIN_FEATURE_DB[key]);



export const TERRAIN_RESOURCE_DB: TerrainResourceDb = {
  [TerrainResourceId.NONE]: {
    id: TerrainResourceId.NONE,
    name: '',
    cssClass: 'm-resource-none',
    yield: {},
    type: null
  },
  [TerrainResourceId.BANANAS]: {
    id: TerrainResourceId.BANANAS,
    name: 'Bananas',
    cssClass: 'm-resource-bananas',
    yield: {  [YieldId.FOOD]: 1 },
    type: TerrainResourceTypeId.BONUS
  },
  [TerrainResourceId.CATTLE]: {
    id: TerrainResourceId.CATTLE,
    name: 'Cattle',
    cssClass: 'm-resource-cattle',
    yield: { [YieldId.FOOD]: 1 },
    type: TerrainResourceTypeId.BONUS
  },
  [TerrainResourceId.COPPER]: {
    id: TerrainResourceId.COPPER,
    name: 'Copper',
    cssClass: 'm-resource-copper',
    yield: { [YieldId.GOLD]: 2 },
    type: TerrainResourceTypeId.BONUS
  },
  [TerrainResourceId.CRABS]: {
    id: TerrainResourceId.CRABS,
    name: 'Crabs',
    cssClass: 'm-resource-crabs',
    yield: { [YieldId.GOLD]: 2 },
    type: TerrainResourceTypeId.BONUS
  },
  [TerrainResourceId.DEER]: {
    id: TerrainResourceId.DEER,
    name: 'Deer',
    cssClass: 'm-resource-deer',
    yield: { [YieldId.PRODUCTION]: 1 },
    type: TerrainResourceTypeId.BONUS
  },
  [TerrainResourceId.FISH]: {
    id: TerrainResourceId.FISH,
    name: 'Fish',
    cssClass: 'm-resource-fish',
    yield: {  [YieldId.FOOD]: 1 },
    type: TerrainResourceTypeId.BONUS
  },
  [TerrainResourceId.RICE]: {
    id: TerrainResourceId.RICE,
    name: 'Rice',
    cssClass: 'm-resource-rice',
    yield: {  [YieldId.FOOD]: 1 },
    type: TerrainResourceTypeId.BONUS
  },
  [TerrainResourceId.SHEEP]: {
    id: TerrainResourceId.SHEEP,
    name: 'Sheep',
    cssClass: 'm-resource-sheep',
    yield: {  [YieldId.FOOD]: 1 },
    type: TerrainResourceTypeId.BONUS
  },
  [TerrainResourceId.STONE]: {
    id: TerrainResourceId.STONE,
    name: 'Stone',
    cssClass: 'm-resource-stone',
    yield: { [YieldId.PRODUCTION]: 1 },
    type: TerrainResourceTypeId.BONUS
  },
  [TerrainResourceId.WHEAT]: {
    id: TerrainResourceId.WHEAT,
    name: 'Wheat',
    cssClass: 'm-resource-wheat',
    yield: { [YieldId.FOOD]: 1 },
    type: TerrainResourceTypeId.BONUS
  },
  [TerrainResourceId.ALUMINUM]: {
    id: TerrainResourceId.ALUMINUM,
    name: 'Aluminum',
    cssClass: 'm-resource-aluminum',
    yield: { [YieldId.SCIENCE]: 1 },
    type: TerrainResourceTypeId.STRATEGIC
  },
  [TerrainResourceId.COAL]: {
    id: TerrainResourceId.COAL,
    name: 'Coal',
    cssClass: 'm-resource-coal',
    yield: { [YieldId.PRODUCTION]: 2 },
    type: TerrainResourceTypeId.STRATEGIC
  },
  [TerrainResourceId.HORSES]: {
    id: TerrainResourceId.HORSES,
    name: 'Horses',
    cssClass: 'm-resource-horses',
    yield: { [YieldId.FOOD]: 1, [YieldId.PRODUCTION]: 1 },
    type: TerrainResourceTypeId.STRATEGIC
  },
  [TerrainResourceId.IRON]: {
    id: TerrainResourceId.IRON,
    name: 'Iron',
    cssClass: 'm-resource-iron',
    yield: { [YieldId.SCIENCE]: 1 },
    type: TerrainResourceTypeId.STRATEGIC
  },
  [TerrainResourceId.NITER]: {
    id: TerrainResourceId.NITER,
    name: 'Niter',
    cssClass: 'm-resource-niter',
    yield: { [YieldId.FOOD]: 1, [YieldId.PRODUCTION]: 1 },
    type: TerrainResourceTypeId.STRATEGIC
  },
  [TerrainResourceId.OIL]: {
    id: TerrainResourceId.OIL,
    name: 'Oil',
    cssClass: 'm-resource-oil',
    yield: { [YieldId.PRODUCTION]: 3 },
    type: TerrainResourceTypeId.STRATEGIC
  },
  [TerrainResourceId.URANIUM]: {
    id: TerrainResourceId.URANIUM,
    name: 'Uranium',
    cssClass: 'm-resource-uranium',
    yield: { [YieldId.PRODUCTION]: 2 },
    type: TerrainResourceTypeId.STRATEGIC
  },
  [TerrainResourceId.AMBER]: {
    id: TerrainResourceId.AMBER,
    name: 'Amber',
    cssClass: 'm-resource-amber',
    yield: { [YieldId.CULTURE]: 1 },
    type: TerrainResourceTypeId.LUXURY
  },
  [TerrainResourceId.CITRUS]: {
    id: TerrainResourceId.CITRUS,
    name: 'Citrus',
    cssClass: 'm-resource-citrus',
    yield: { [YieldId.FOOD]: 2 },
    type: TerrainResourceTypeId.LUXURY
  },
  [TerrainResourceId.COCOA]: {
    id: TerrainResourceId.COCOA,
    name: 'Cocoa',
    cssClass: 'm-resource-cocoa',
    yield: { [YieldId.GOLD]: 3 },
    type: TerrainResourceTypeId.LUXURY
  },
  [TerrainResourceId.COFFEE]: {
    id: TerrainResourceId.COFFEE,
    name: 'Coffee',
    cssClass: 'm-resource-coffee',
    yield: { [YieldId.CULTURE]: 1 },
    type: TerrainResourceTypeId.LUXURY
  },
  [TerrainResourceId.COTTON]: {
    id: TerrainResourceId.COTTON,
    name: 'Cotton',
    cssClass: 'm-resource-cotton',
    yield: { [YieldId.GOLD]: 3 },
    type: TerrainResourceTypeId.LUXURY
  },
  [TerrainResourceId.DIAMONDS]: {
    id: TerrainResourceId.DIAMONDS,
    name: 'Diamonds',
    cssClass: 'm-resource-diamonds',
    yield: { [YieldId.GOLD]: 3 },
    type: TerrainResourceTypeId.LUXURY
  },
  [TerrainResourceId.DYES]: {
    id: TerrainResourceId.DYES,
    name: 'Dyes',
    cssClass: 'm-resource-dyes',
    yield: { [YieldId.FAITH]: 1 },
    type: TerrainResourceTypeId.LUXURY
  },
  [TerrainResourceId.FURS]: {
    id: TerrainResourceId.FURS,
    name: 'Furs',
    cssClass: 'm-resource-furs',
    yield: { [YieldId.FOOD]: 1, [YieldId.GOLD]: 1 },
    type: TerrainResourceTypeId.LUXURY
  },
  [TerrainResourceId.GYPSUM]: {
    id: TerrainResourceId.GYPSUM,
    name: 'Gypsum',
    cssClass: 'm-resource-gypsum',
    yield: { [YieldId.PRODUCTION]: 1, [YieldId.GOLD]: 1 },
    type: TerrainResourceTypeId.LUXURY
  },
  [TerrainResourceId.INCENSE]: {
    id: TerrainResourceId.INCENSE,
    name: 'Incense',
    cssClass: 'm-resource-incense',
    yield: { [YieldId.FAITH]: 1 },
    type: TerrainResourceTypeId.LUXURY
  },
  [TerrainResourceId.IVORY]: {
    id: TerrainResourceId.IVORY,
    name: 'Ivory',
    cssClass: 'm-resource-ivory',
    yield: { [YieldId.PRODUCTION]: 1, [YieldId.GOLD]: 1 },
    type: TerrainResourceTypeId.LUXURY
  },
  [TerrainResourceId.JADE]: {
    id: TerrainResourceId.JADE,
    name: 'Jade',
    cssClass: 'm-resource-jade',
    yield: { [YieldId.CULTURE]: 1 },
    type: TerrainResourceTypeId.LUXURY
  },
  [TerrainResourceId.MARBLE]: {
    id: TerrainResourceId.MARBLE,
    name: 'marble',
    cssClass: 'm-resource-marble',
    yield: { [YieldId.CULTURE]: 1 },
    type: TerrainResourceTypeId.LUXURY
  },
  [TerrainResourceId.MERCURY]: {
    id: TerrainResourceId.MERCURY,
    name: 'Mercury',
    cssClass: 'm-resource-mercury',
    yield: { [YieldId.SCIENCE]: 1 },
    type: TerrainResourceTypeId.LUXURY
  },
  [TerrainResourceId.OLIVES]: {
    id: TerrainResourceId.OLIVES,
    name: 'Olives',
    cssClass: 'm-resource-olives',
    yield: { [YieldId.PRODUCTION]: 1, [YieldId.GOLD]: 1 },
    type: TerrainResourceTypeId.LUXURY
  },
  [TerrainResourceId.PEARLS]: {
    id: TerrainResourceId.PEARLS,
    name: 'Pearls',
    cssClass: 'm-resource-pearls',
    yield: { [YieldId.FAITH]: 1 },
    type: TerrainResourceTypeId.LUXURY
  },
  [TerrainResourceId.SALT]: {
    id: TerrainResourceId.SALT,
    name: 'Salt',
    cssClass: 'm-resource-salt',
    yield: { [YieldId.FOOD]: 1, [YieldId.GOLD]: 1 },
    type: TerrainResourceTypeId.LUXURY
  },
  [TerrainResourceId.SILK]: {
    id: TerrainResourceId.SILK,
    name: 'Silk',
    cssClass: 'm-resource-silk',
    yield: { [YieldId.CULTURE]: 1 },
    type: TerrainResourceTypeId.LUXURY
  },
  [TerrainResourceId.SILVER]: {
    id: TerrainResourceId.SILVER,
    name: 'Silver',
    cssClass: 'm-resource-silver',
    yield: { [YieldId.GOLD]: 3 },
    type: TerrainResourceTypeId.LUXURY
  },
  [TerrainResourceId.SPICES]: {
    id: TerrainResourceId.SPICES,
    name: 'Spices',
    cssClass: 'm-resource-spices',
    yield: { [YieldId.FOOD]: 2 },
    type: TerrainResourceTypeId.LUXURY
  },
  [TerrainResourceId.SUGAR]: {
    id: TerrainResourceId.SUGAR,
    name: 'Sugar',
    cssClass: 'm-resource-sugar',
    yield: { [YieldId.FOOD]: 2 },
    type: TerrainResourceTypeId.LUXURY
  },
  [TerrainResourceId.TEA]: {
    id: TerrainResourceId.TEA,
    name: 'Tea',
    cssClass: 'm-resource-tea',
    yield: { [YieldId.SCIENCE]: 1 },
    type: TerrainResourceTypeId.LUXURY
  },
  [TerrainResourceId.TOBACCO]: {
    id: TerrainResourceId.TOBACCO,
    name: 'Tobacco',
    cssClass: 'm-resource-tobacco',
    yield: { [YieldId.FAITH]: 1 },
    type: TerrainResourceTypeId.LUXURY
  },
  [TerrainResourceId.TRUFFLES]: {
    id: TerrainResourceId.TRUFFLES,
    name: 'Truffles',
    cssClass: 'm-resource-truffles',
    yield: { [YieldId.GOLD]: 3 },
    type: TerrainResourceTypeId.LUXURY
  },
  [TerrainResourceId.WHALES]: {
    id: TerrainResourceId.WHALES,
    name: 'Whales',
    cssClass: 'm-resource-whales',
    yield: { [YieldId.FOOD]: 1, [YieldId.GOLD]: 1 },
    type: TerrainResourceTypeId.LUXURY
  },
  [TerrainResourceId.WINE]: {
    id: TerrainResourceId.WINE,
    name: 'Wine',
    cssClass: 'm-resource-wine',
    yield: { [YieldId.FOOD]: 1, [YieldId.GOLD]: 1 },
    type: TerrainResourceTypeId.LUXURY
  }
}
export const TERRAIN_RESOURCE_LIST: TerrainResource[] = Object.keys(TERRAIN_RESOURCE_DB).map(key => TERRAIN_RESOURCE_DB[key]);



export const TERRAIN_IMPROVEMENT_DB: TerrainImprovementDb = {
  [TerrainImprovementId.NONE]: {
    id: TerrainImprovementId.NONE,
    name: '',
    cssClass: 'm-improvement-none',
    yield: {},
  },
  // -1 Appeal
  [TerrainImprovementId.AIRSTRIP]: {
    id: TerrainImprovementId.AIRSTRIP,
    name: 'Airstrip',
    cssClass: 'm-improvement-airstrip',
    yield: {},
  },
  // +0.5 Housing, +1 Food (Mercantilism), +1 Production (Mercantilism), +1 Gold (Synthetic Materials)
  [TerrainImprovementId.CAMP]: {
    id: TerrainImprovementId.CAMP,
    name: 'Camp',
    cssClass: 'm-improvement-camp',
    yield: { [YieldId.GOLD]: 2 },
  },
  // +0.5 Housing, +1 Food per 2 adjacent Farms (Feudalism until Replaceable Parts), +1 Food per adjacent Farm (Replaceable Parts)
  [TerrainImprovementId.FARM]: {
    id: TerrainImprovementId.FARM,
    name: 'Farm',
    cssClass: 'm-improvement-farm',
    yield: { [YieldId.FOOD]: 1 },
  },
  // +0.5 Housing, +2 Gold (Cartography), +1 Food (Plastics)
  [TerrainImprovementId.FISHING_BOATS]: {
    id: TerrainImprovementId.FISHING_BOATS,
    name: 'Fishing Boats',
    cssClass: 'm-improvement-fishing-boats',
    yield: { [YieldId.FOOD]: 1 },
  },
  [TerrainImprovementId.FORT]: {
    id: TerrainImprovementId.FORT,
    name: 'Fort',
    cssClass: 'm-improvement-fort',
    yield: {  },
  },
  // +1 Production (Steel), +1 Production (Cybernetics)
  [TerrainImprovementId.LUMBER_MILL]: {
    id: TerrainImprovementId.LUMBER_MILL,
    name: 'Lumber Mill',
    cssClass: 'm-improvement-lumber-mill',
    yield: { [YieldId.PRODUCTION]: 2 },
  },
  // -1 Appeal, +1 Production (Apprenticeship), +1 Production (Industrialization), +1 Production (Smart materials),
  [TerrainImprovementId.MINE]: {
    id: TerrainImprovementId.MINE,
    name: 'Mine',
    cssClass: 'm-improvement-mine',
    yield: { [YieldId.PRODUCTION]: 1 },
  },
  [TerrainImprovementId.MISSILE_SILO]: {
    id: TerrainImprovementId.MISSILE_SILO,
    name: 'Missile Silo',
    cssClass: 'm-improvement-missile-silo',
    yield: {  },
  },
  [TerrainImprovementId.MOUNTAIN_TUNNEL]: {
    id: TerrainImprovementId.MOUNTAIN_TUNNEL,
    name: 'Mountain Tunnel',
    cssClass: 'm-improvement-mountain-tunnel',
    yield: {  },
  },
  // -1 Appeal
  [TerrainImprovementId.OFFSHORE_OIL_RIG]: {
    id: TerrainImprovementId.OFFSHORE_OIL_RIG,
    name: 'Offshore Oil Rig',
    cssClass: 'm-improvement-offshore-oil-rig',
    yield: { [YieldId.PRODUCTION]: 2 },
  },
  [TerrainImprovementId.OFFSHORE_WIND_FARM]: {
    id: TerrainImprovementId.OFFSHORE_WIND_FARM,
    name: 'Offshore Wind Farm',
    cssClass: 'm-improvement-offshore-wind-farm',
    yield: { [YieldId.PRODUCTION]: 1, [YieldId.GOLD]: 1, [YieldId.POWER]: 2 },
  },
  // -1 Appeal
  [TerrainImprovementId.OIL_WELL]: {
    id: TerrainImprovementId.OIL_WELL,
    name: 'Oil Well',
    cssClass: 'm-improvement-oil-well',
    yield: { [YieldId.PRODUCTION]: 2 },
  },
  // +0.5 Housing, +1 Food (Exploration), +1 Production (Robotics)
  [TerrainImprovementId.PASTURE]: {
    id: TerrainImprovementId.PASTURE,
    name: 'Pasture',
    cssClass: 'm-improvement-pasture',
    yield: { [YieldId.PRODUCTION]: 1 },
  },
  // +0.5 Housing, +1 Food (Scientific Theory), +2 Gold (Globalization)
  [TerrainImprovementId.PLANTATION]: {
    id: TerrainImprovementId.PLANTATION,
    name: 'Plantation',
    cssClass: 'm-improvement-plantation',
    yield: { [YieldId.GOLD]: 2 },
  },
  // -1 Appeal, +1 Production (Gunpowder), +1 Production (Rocketry), +1 Production (Predictive systems)
  [TerrainImprovementId.QUARRY]: {
    id: TerrainImprovementId.QUARRY,
    name: 'Quarry',
    cssClass: 'm-improvement-quarry',
    yield: { [YieldId.PRODUCTION]: 1 },
  },
  // Appeal x1 to gold, Appeal x 2 to tourism
  [TerrainImprovementId.SEASIDE_RESORT]: {
    id: TerrainImprovementId.SEASIDE_RESORT,
    name: 'Seaside Resort',
    cssClass: 'm-improvement-seaside-resort',
    yield: {}
  },
  // +1 Production from each adjacent Fishing Boat, Fishing Boats receive +1 Production from each adjacent Seastead, +1 Culture and Tourism for each adjacent Reef, +2 Housing.
  [TerrainImprovementId.SEASTEAD]: {
    id: TerrainImprovementId.SEASTEAD,
    name: 'Seastead',
    cssClass: 'm-improvement-seastead',
    yield: { [YieldId.FOOD]: 1 }
  },
  // +1 Amenities, Provides Tourism equal to the tile's Appeal
  [TerrainImprovementId.SKI_RESORT]: {
    id: TerrainImprovementId.SKI_RESORT,
    name: 'Ski Resort',
    cssClass: 'm-improvement-ski-resort',
    yield: {}
  },
  [TerrainImprovementId.SOLAR_FARM]: {
    id: TerrainImprovementId.SOLAR_FARM,
    name: 'Solar Farm',
    cssClass: 'm-improvement-solar-farm',
    yield: { [YieldId.PRODUCTION]: 1, [YieldId.GOLD]: 1, [YieldId.POWER]: 2 }
  },
  [TerrainImprovementId.WIND_FARM]: {
    id: TerrainImprovementId.WIND_FARM,
    name: 'Wind Farm',
    cssClass: 'm-improvement-wind-farm',
    yield: { [YieldId.PRODUCTION]: 1, [YieldId.GOLD]: 1, [YieldId.POWER]: 2 }
  }
}
export const TERRAIN_IMPROVEMENT_LIST: TerrainImprovement[] = Object.keys(TERRAIN_IMPROVEMENT_DB).map(key => TERRAIN_IMPROVEMENT_DB[key]);
