import {TechnologyId} from '../../models/technology/technology';

export interface Technology {
  id: TechnologyId;
  prerequisites: TechnologyId[];
  cost: number;
}

export const TECHNOLOGIES: Technology[] = [
  // ANCIENT ERA
  { id: TechnologyId.POTTERY, cost: 25, prerequisites: [] },
  { id: TechnologyId.ANIMAL_HUSBANDRY, cost: 25, prerequisites: [] },
  { id: TechnologyId.MINING, cost: 25, prerequisites: [] },
  { id: TechnologyId.SAILING, cost: 50, prerequisites: [] },
  { id: TechnologyId.ASTROLOGY, cost: 50, prerequisites: [] },
  { id: TechnologyId.IRRIGATION, cost: 50, prerequisites: [TechnologyId.POTTERY] },
  { id: TechnologyId.WRITING, cost: 50, prerequisites: [TechnologyId.POTTERY] },
  { id: TechnologyId.ARCHERY, cost: 50, prerequisites: [TechnologyId.ANIMAL_HUSBANDRY] },
  { id: TechnologyId.MASONRY, cost: 80, prerequisites: [TechnologyId.MINING] },
  { id: TechnologyId.BRONZE_WORKING, cost: 80, prerequisites: [TechnologyId.MINING] },
  { id: TechnologyId.WHEEL, cost: 80, prerequisites: [TechnologyId.MINING] },

  // CLASSICAL ERA
  { id: TechnologyId.CELESTIAL_NAVIGATION, cost: 120, prerequisites: [TechnologyId.SAILING, TechnologyId.ASTROLOGY] },
  { id: TechnologyId.CURRENCY, cost: 120, prerequisites: [TechnologyId.WRITING] },
  { id: TechnologyId.HORSEBACK_RIDING, cost: 120, prerequisites: [TechnologyId.ARCHERY] },
  { id: TechnologyId.IRON_WORKING, cost: 120, prerequisites: [TechnologyId.BRONZE_WORKING] },
  { id: TechnologyId.SHIPBUILDING, cost: 200, prerequisites: [TechnologyId.SAILING] },
  { id: TechnologyId.MATHEMATICS, cost: 200, prerequisites: [TechnologyId.CURRENCY] },
  { id: TechnologyId.CONSTRUCTION, cost: 200, prerequisites: [TechnologyId.MASONRY, TechnologyId.HORSEBACK_RIDING] },
  { id: TechnologyId.ENGINEERING, cost: 200, prerequisites: [TechnologyId.WHEEL] },

  // MEDIEVAL ERA
  { id: TechnologyId.BUTTRESS, cost: 300, prerequisites: [TechnologyId.SHIPBUILDING, TechnologyId.MATHEMATICS] },
  { id: TechnologyId.MILITARY_TACTICS, cost: 275, prerequisites: [TechnologyId.MATHEMATICS] },
  { id: TechnologyId.APPRENTICESHIP, cost: 275, prerequisites: [TechnologyId.CURRENCY, TechnologyId.HORSEBACK_RIDING] },
  { id: TechnologyId.MACHINERY, cost: 275, prerequisites: [TechnologyId.IRON_WORKING, TechnologyId.ENGINEERING] },
  { id: TechnologyId.EDUCATION, cost: 335, prerequisites: [TechnologyId.MATHEMATICS, TechnologyId.APPRENTICESHIP] },
  { id: TechnologyId.STIRRUPS, cost: 360, prerequisites: [TechnologyId.HORSEBACK_RIDING] },
  { id: TechnologyId.MILITARY_ENGINEERING, cost: 335, prerequisites: [TechnologyId.CONSTRUCTION] },
  { id: TechnologyId.CASTLES, cost: 390, prerequisites: [TechnologyId.CONSTRUCTION] },

  // RENAISSANCE ERA
  { id: TechnologyId.CARTOGRAPHY, cost: 490, prerequisites: [TechnologyId.SHIPBUILDING] },
  { id: TechnologyId.MASS_PRODUCTION, cost: 490, prerequisites: [TechnologyId.SHIPBUILDING, TechnologyId.EDUCATION] },
  { id: TechnologyId.BANKING, cost: 490, prerequisites: [TechnologyId.APPRENTICESHIP, TechnologyId.EDUCATION, TechnologyId.STIRRUPS] },
  { id: TechnologyId.GUNPOWDER, cost: 490, prerequisites: [TechnologyId.APPRENTICESHIP, TechnologyId.STIRRUPS, TechnologyId.MILITARY_ENGINEERING] },
  { id: TechnologyId.PRINTING, cost: 490, prerequisites: [TechnologyId.MACHINERY] },
  { id: TechnologyId.SQUARE_RIGGING, cost: 600, prerequisites: [TechnologyId.CARTOGRAPHY] },
  { id: TechnologyId.ASTRONOMY, cost: 600, prerequisites: [TechnologyId.EDUCATION] },
  { id: TechnologyId.METAL_CASTING, cost: 660, prerequisites: [TechnologyId.GUNPOWDER] },
  { id: TechnologyId.SIEGE_TACTICS, cost: 660, prerequisites: [TechnologyId.CASTLES] },

  // INDUSTRIAL ERA
  { id: TechnologyId.INDUSTRIALIZATION, cost: 930, prerequisites: [TechnologyId.MASS_PRODUCTION, TechnologyId.SQUARE_RIGGING] },
  { id: TechnologyId.SCIENTIFIC_THEORY, cost: 930, prerequisites: [TechnologyId.ASTRONOMY, TechnologyId.BANKING] },
  { id: TechnologyId.BALLISTICS, cost: 930, prerequisites: [TechnologyId.METAL_CASTING] },
  { id: TechnologyId.MILITARY_SERVICE, cost: 930, prerequisites: [TechnologyId.PRINTING, TechnologyId.SIEGE_TACTICS] },
  { id: TechnologyId.STEAM_POWER, cost: 805, prerequisites: [TechnologyId.SQUARE_RIGGING, TechnologyId.INDUSTRIALIZATION] },
  { id: TechnologyId.SANITATION, cost: 805, prerequisites: [TechnologyId.SCIENTIFIC_THEORY] },
  { id: TechnologyId.ECONOMICS, cost: 805, prerequisites: [TechnologyId.METAL_CASTING, TechnologyId.SCIENTIFIC_THEORY] },
  { id: TechnologyId.RIFLING, cost: 970, prerequisites: [TechnologyId.BALLISTICS, TechnologyId.MILITARY_SERVICE] },

  // MODERN ERA
  { id: TechnologyId.FLIGHT, cost: 1250, prerequisites: [TechnologyId.INDUSTRIALIZATION, TechnologyId.SCIENTIFIC_THEORY] },
  { id: TechnologyId.REPLACEABLE_PARTS, cost: 1250, prerequisites: [TechnologyId.ECONOMICS] },
  { id: TechnologyId.STEEL, cost: 1140, prerequisites: [TechnologyId.RIFLING] },
  { id: TechnologyId.REFINING, cost: 1250, prerequisites: [TechnologyId.RIFLING] },
  { id: TechnologyId.ELECTRICITY, cost: 985, prerequisites: [TechnologyId.STEAM_POWER] },
  { id: TechnologyId.RADIO, cost: 1370, prerequisites: [TechnologyId.STEAM_POWER, TechnologyId.FLIGHT] },
  { id: TechnologyId.CHEMISTRY, cost: 985, prerequisites: [TechnologyId.SANITATION] },
  { id: TechnologyId.COMBUSTION, cost: 1250, prerequisites: [TechnologyId.STEEL, TechnologyId.REFINING] },

  // ATOMIC ERA
  { id: TechnologyId.ADVANCED_FLIGHT, cost: 1480, prerequisites: [TechnologyId.RADIO] },
  { id: TechnologyId.ROCKETRY, cost: 1480, prerequisites: [TechnologyId.RADIO, TechnologyId.CHEMISTRY] },
  { id: TechnologyId.ADVANCED_BALLISTICS, cost: 1410, prerequisites: [TechnologyId.REPLACEABLE_PARTS, TechnologyId.STEEL] },
  { id: TechnologyId.COMBINED_ARMS, cost: 1480, prerequisites: [TechnologyId.STEEL] },
  { id: TechnologyId.PLASTICS, cost: 1065, prerequisites: [TechnologyId.COMBUSTION] },
  { id: TechnologyId.COMPUTERS, cost: 1660, prerequisites: [TechnologyId.ELECTRICITY, TechnologyId.RADIO] },
  { id: TechnologyId.NUCLEAR_FISSION, cost: 1195, prerequisites: [TechnologyId.ADVANCED_BALLISTICS, TechnologyId.COMBINED_ARMS] },
  { id: TechnologyId.SYNTHETIC_MATERIALS, cost: 1195, prerequisites: [TechnologyId.PLASTICS] },

  // INFORMATION ERA
  { id: TechnologyId.TELECOMMUNICATIONS, cost: 1850, prerequisites: [TechnologyId.COMPUTERS] },
  { id: TechnologyId.SATELLITES, cost: 1850, prerequisites: [TechnologyId.ADVANCED_FLIGHT, TechnologyId.ROCKETRY] },
  { id: TechnologyId.GUIDANCE_SYSTEMS, cost: 1580, prerequisites: [TechnologyId.ROCKETRY, TechnologyId.ADVANCED_BALLISTICS] },
  { id: TechnologyId.LASERS, cost: 1340, prerequisites: [TechnologyId.NUCLEAR_FISSION] },
  { id: TechnologyId.COMPOSITES, cost: 1340, prerequisites: [TechnologyId.SYNTHETIC_MATERIALS] },
  { id: TechnologyId.STEALTH_TECHNOLOGY, cost: 1850, prerequisites: [TechnologyId.SYNTHETIC_MATERIALS] },
  { id: TechnologyId.ROBOTICS, cost: 2155, prerequisites: [TechnologyId.COMPUTERS] },
  { id: TechnologyId.NUCLEAR_FISSION, cost: 1560, prerequisites: [TechnologyId.LASERS] },
  { id: TechnologyId.NANOTECHNOLOGY, cost: 1560, prerequisites: [TechnologyId.COMPOSITES] }
]
