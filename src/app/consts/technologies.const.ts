import {Technology, TechnologyId} from '../models/technologies';

type TechnologySet = {
  [key in TechnologyId]: Technology;
};

export const TECHNOLOGY_SET: TechnologySet = {
  // ANCIENT ERA
  [TechnologyId.POTTERY]: {
    id: TechnologyId.POTTERY,
    cost: 25,
    prerequisites: [],
    ui: {
      name: 'Pottery',
      class: 'm-pottery'
    }
  },
  [TechnologyId.ANIMAL_HUSBANDRY]: {
    id: TechnologyId.ANIMAL_HUSBANDRY,
    cost: 25,
    prerequisites: [],
    ui: {
      name: 'Animal husbandry',
      class: 'm-animal-husbandry'
    }
  },
  [TechnologyId.MINING]: {
    id: TechnologyId.MINING,
    cost: 25,
    prerequisites: [],
    ui: {
      name: 'Mining',
      class: 'm-mining'
    }

  },
  [TechnologyId.SAILING]: {
    id: TechnologyId.SAILING,
    cost: 50,
    prerequisites: [],
    ui: {
      name: 'Sailing',
      class: 'm-sailing'
    }
  },
  [TechnologyId.ASTROLOGY]: {
    id: TechnologyId.ASTROLOGY,
    cost: 50,
    prerequisites: [],
    ui: {
      name: 'Astrology',
      class: 'm-astrology'
    }
  },
  [TechnologyId.IRRIGATION]: {
    id: TechnologyId.IRRIGATION,
    cost: 50,
    prerequisites: [TechnologyId.POTTERY],
    ui: {
      name: 'Irrigation',
      class: 'm-irrigation'
    }
  },
  [TechnologyId.WRITING]: {
    id: TechnologyId.WRITING,
    cost: 50,
    prerequisites: [TechnologyId.POTTERY],
    ui: {
      name: 'Writing',
      class: 'm-writing'
    }
  },
  [TechnologyId.ARCHERY]: {
    id: TechnologyId.ARCHERY,
    cost: 50,
    prerequisites: [TechnologyId.ANIMAL_HUSBANDRY],
    ui: {
      name: 'Archery',
      class: 'm-archery'
    }
  },
  [TechnologyId.MASONRY]: {
    id: TechnologyId.MASONRY,
    cost: 80,
    prerequisites: [TechnologyId.MINING],
    ui: {
      name: 'Masonry',
      class: 'm-masonry'
    }
  },
  [TechnologyId.BRONZE_WORKING]: {
    id: TechnologyId.BRONZE_WORKING,
    cost: 80,
    prerequisites: [TechnologyId.MINING],
    ui: {
      name: 'Bronze working',
      class: 'm-bronze-working'
    }
  },
  [TechnologyId.WHEEL]: {
    id: TechnologyId.WHEEL,
    cost: 80,
    prerequisites: [TechnologyId.MINING],
    ui: {
      name: 'Wheel',
      class: 'm-wheel'
    }
  },

  // CLASSICAL ERA
  [TechnologyId.CELESTIAL_NAVIGATION]: {
    id: TechnologyId.CELESTIAL_NAVIGATION,
    cost: 120,
    prerequisites: [TechnologyId.SAILING, TechnologyId.ASTROLOGY],
    ui: {
      name: 'Celestial navigation',
      class: 'm-celestial-navigation'
    }
  },
  [TechnologyId.CURRENCY]: {
    id: TechnologyId.CURRENCY,
    cost: 120,
    prerequisites: [TechnologyId.WRITING],
    ui: {
      name: 'Currency',
      class: 'm-currency'
    }
  },
  [TechnologyId.HORSEBACK_RIDING]: {
    id: TechnologyId.HORSEBACK_RIDING,
    cost: 120,
    prerequisites: [TechnologyId.ARCHERY],
    ui: {
      name: 'Horseback riding',
      class: 'm-horseback-riding'
    }
  },
  [TechnologyId.IRON_WORKING]: {
    id: TechnologyId.IRON_WORKING,
    cost: 120,
    prerequisites: [TechnologyId.BRONZE_WORKING],
    ui: {
      name: 'Iron working',
      class: 'm-iron-working'
    }
  },
  [TechnologyId.SHIPBUILDING]: {
    id: TechnologyId.SHIPBUILDING,
    cost: 200,
    prerequisites: [TechnologyId.SAILING],
    ui: {
      name: 'Shipbuilding',
      class: 'm-shipbuilding'
    }
  },
  [TechnologyId.MATHEMATICS]: {
    id: TechnologyId.MATHEMATICS,
    cost: 200,
    prerequisites: [TechnologyId.CURRENCY],
    ui: {
      name: 'Mathematics',
      class: 'm-mathematics'
    }
  },
  [TechnologyId.CONSTRUCTION]: {
    id: TechnologyId.CONSTRUCTION,
    cost: 200,
    prerequisites: [TechnologyId.MASONRY, TechnologyId.HORSEBACK_RIDING],
    ui: {
      name: 'Construction',
      class: 'm-construction'
    }
  },
  [TechnologyId.ENGINEERING]: {
    id: TechnologyId.ENGINEERING,
    cost: 200,
    prerequisites: [TechnologyId.WHEEL],
    ui: {
      name: 'Engineering',
      class: 'm-engineering'
    }
  },

  // MEDIEVAL ERA
  [TechnologyId.BUTTRESS]: {
    id: TechnologyId.BUTTRESS,
    cost: 300,
    prerequisites: [TechnologyId.SHIPBUILDING, TechnologyId.MATHEMATICS],
    ui: {
      name: 'Buttress',
      class: 'm-buttress'
    }
  },
  [TechnologyId.MILITARY_TACTICS]: {
    id: TechnologyId.MILITARY_TACTICS,
    cost: 275,
    prerequisites: [TechnologyId.MATHEMATICS],
    ui: {
      name: 'Military tactics',
      class: 'm-military-tactics'
    }
  },
  [TechnologyId.APPRENTICESHIP]: {
    id: TechnologyId.APPRENTICESHIP,
    cost: 275,
    prerequisites: [TechnologyId.CURRENCY, TechnologyId.HORSEBACK_RIDING],
    ui: {
      name: 'Apprenticeship',
      class: 'm-apprenticeship'
    }
  },
  [TechnologyId.MACHINERY]: {
    id: TechnologyId.MACHINERY,
    cost: 275,
    prerequisites: [TechnologyId.IRON_WORKING, TechnologyId.ENGINEERING],
    ui: {
      name: 'Machinery',
      class: 'm-machinery'
    }
  },
  [TechnologyId.EDUCATION]: {
    id: TechnologyId.EDUCATION,
    cost: 335,
    prerequisites: [TechnologyId.MATHEMATICS, TechnologyId.APPRENTICESHIP],
    ui: {
      name: 'Education',
      class: 'm-education'
    }
  },
  [TechnologyId.STIRRUPS]: {
    id: TechnologyId.STIRRUPS,
    cost: 360,
    prerequisites: [TechnologyId.HORSEBACK_RIDING],
    ui: {
      name: 'Stirrups',
      class: 'm-stirrups'
    }
  },
  [TechnologyId.MILITARY_ENGINEERING]: {
    id: TechnologyId.MILITARY_ENGINEERING,
    cost: 335,
    prerequisites: [TechnologyId.CONSTRUCTION],
    ui: {
      name: 'Military engineering',
      class: 'm-military-engineering'
    }
  },
  [TechnologyId.CASTLES]: {
    id: TechnologyId.CASTLES,
    cost: 390,
    prerequisites: [TechnologyId.CONSTRUCTION],
    ui: {
      name: 'Castles',
      class: 'm-castles'
    }
  },

  // RENAISSANCE ERA
  [TechnologyId.CARTOGRAPHY]: {
    id: TechnologyId.CARTOGRAPHY,
    cost: 490,
    prerequisites: [TechnologyId.SHIPBUILDING],
    ui: {
      name: 'Cartography',
      class: 'm-cartography'
    }
  },
  [TechnologyId.MASS_PRODUCTION]: {
    id: TechnologyId.MASS_PRODUCTION,
    cost: 490,
    prerequisites: [TechnologyId.SHIPBUILDING, TechnologyId.EDUCATION],
    ui: {
      name: 'Mass production',
      class: 'm-mass-production'
    }
  },
  [TechnologyId.BANKING]: {
    id: TechnologyId.BANKING,
    cost: 490,
    prerequisites: [TechnologyId.APPRENTICESHIP, TechnologyId.EDUCATION, TechnologyId.STIRRUPS],
    ui: {
      name: 'Banking',
      class: 'm-banking'
    }
  },
  [TechnologyId.GUNPOWDER]: {
    id: TechnologyId.GUNPOWDER,
    cost: 490,
    prerequisites: [TechnologyId.APPRENTICESHIP, TechnologyId.STIRRUPS, TechnologyId.MILITARY_ENGINEERING],
    ui: {
      name: 'Gunpowder',
      class: 'm-gunpowder'
    }
  },
  [TechnologyId.PRINTING]: {
    id: TechnologyId.PRINTING,
    cost: 490,
    prerequisites: [TechnologyId.MACHINERY],
    ui: {
      name: 'Printing',
      class: 'm-printing'
    }
  },
  [TechnologyId.SQUARE_RIGGING]: {
    id: TechnologyId.SQUARE_RIGGING,
    cost: 600,
    prerequisites: [TechnologyId.CARTOGRAPHY],
    ui: {
      name: 'Square rigging',
      class: 'm-square-rigging'
    }
  },
  [TechnologyId.ASTRONOMY]: {
    id: TechnologyId.ASTRONOMY,
    cost: 600,
    prerequisites: [TechnologyId.EDUCATION],
    ui: {
      name: 'Astronomy',
      class: 'm-astronomy'
    }
  },
  [TechnologyId.METAL_CASTING]: {
    id: TechnologyId.METAL_CASTING,
    cost: 660,
    prerequisites: [TechnologyId.GUNPOWDER],
    ui: {
      name: 'Metal casting',
      class: 'm-metal-casting'
    }
  },
  [TechnologyId.SIEGE_TACTICS]: {
    id: TechnologyId.SIEGE_TACTICS,
    cost: 660,
    prerequisites: [TechnologyId.CASTLES],
    ui: {
      name: 'Siege tactics',
      class: 'm-siege-tactics'
    }
  },

  // INDUSTRIAL ERA
  [TechnologyId.INDUSTRIALIZATION]: {
    id: TechnologyId.INDUSTRIALIZATION,
    cost: 930,
    prerequisites: [TechnologyId.MASS_PRODUCTION, TechnologyId.SQUARE_RIGGING],
    ui: {
      name: 'Industrialization',
      class: 'm-industrialization'
    }
  },
  [TechnologyId.SCIENTIFIC_THEORY]: {
    id: TechnologyId.SCIENTIFIC_THEORY,
    cost: 930,
    prerequisites: [TechnologyId.ASTRONOMY, TechnologyId.BANKING],
    ui: {
      name: 'Scientific theory',
      class: 'm-scientific-theory'
    }
  },
  [TechnologyId.BALLISTICS]: {
    id: TechnologyId.BALLISTICS,
    cost: 930,
    prerequisites: [TechnologyId.METAL_CASTING],
    ui: {
      name: 'Ballistics',
      class: 'm-ballistics'
    }
  },
  [TechnologyId.MILITARY_SCIENCE]: {
    id: TechnologyId.MILITARY_SCIENCE,
    cost: 930,
    prerequisites: [TechnologyId.PRINTING, TechnologyId.SIEGE_TACTICS],
    ui: {
      name: 'Military science',
      class: 'm-military-science'
    }
  },
  [TechnologyId.STEAM_POWER]: {
    id: TechnologyId.STEAM_POWER,
    cost: 805,
    prerequisites: [TechnologyId.SQUARE_RIGGING, TechnologyId.INDUSTRIALIZATION],
    ui: {
      name: 'Steam power',
      class: 'm-steam-power'
    }
  },
  [TechnologyId.SANITATION]: {
    id: TechnologyId.SANITATION,
    cost: 805,
    prerequisites: [TechnologyId.SCIENTIFIC_THEORY],
    ui: {
      name: 'Sanitation',
      class: 'm-sanitation'
    }
  },
  [TechnologyId.ECONOMICS]: {
    id: TechnologyId.ECONOMICS,
    cost: 805,
    prerequisites: [TechnologyId.METAL_CASTING, TechnologyId.SCIENTIFIC_THEORY],
    ui: {
      name: 'Economics',
      class: 'm-economics'
    }
  },
  [TechnologyId.RIFLING]: {
    id: TechnologyId.RIFLING,
    cost: 970,
    prerequisites: [TechnologyId.BALLISTICS, TechnologyId.MILITARY_SCIENCE],
    ui: {
      name: 'Rifling',
      class: 'm-rifling'
    }
  },

  // MODERN ERA
  [TechnologyId.FLIGHT]: {
    id: TechnologyId.FLIGHT,
    cost: 1250,
    prerequisites: [TechnologyId.INDUSTRIALIZATION, TechnologyId.SCIENTIFIC_THEORY],
    ui: {
      name: 'Flight',
      class: 'm-flight'
    }
  },
  [TechnologyId.REPLACEABLE_PARTS]: {
    id: TechnologyId.REPLACEABLE_PARTS,
    cost: 1250,
    prerequisites: [TechnologyId.ECONOMICS],
    ui: {
      name: 'Replaceable parts',
      class: 'm-replaceable-parts'
    }
  },
  [TechnologyId.STEEL]: {
    id: TechnologyId.STEEL,
    cost: 1140,
    prerequisites: [TechnologyId.RIFLING],
    ui: {
      name: 'Steel',
      class: 'm-steel'
    }
  },
  [TechnologyId.REFINING]: {
    id: TechnologyId.REFINING,
    cost: 1250,
    prerequisites: [TechnologyId.RIFLING],
    ui: {
      name: 'Refining',
      class: 'm-refining'
    }
  },
  [TechnologyId.ELECTRICITY]: {
    id: TechnologyId.ELECTRICITY,
    cost: 985,
    prerequisites: [TechnologyId.STEAM_POWER],
    ui: {
      name: 'Electricity',
      class: 'm-electricity'
    }
  },
  [TechnologyId.RADIO]: {
    id: TechnologyId.RADIO,
    cost: 1370,
    prerequisites: [TechnologyId.STEAM_POWER, TechnologyId.FLIGHT],
    ui: {
      name: 'Radio',
      class: 'm-radio'
    }
  },
  [TechnologyId.CHEMISTRY]: {
    id: TechnologyId.CHEMISTRY,
    cost: 985,
    prerequisites: [TechnologyId.SANITATION],
    ui: {
      name: 'Chemistry',
      class: 'm-chemistry'
    }
  },
  [TechnologyId.COMBUSTION]: {
    id: TechnologyId.COMBUSTION,
    cost: 1250,
    prerequisites: [TechnologyId.STEEL, TechnologyId.REFINING],
    ui: {
      name: 'Combustion',
      class: 'm-combustion'
    }
  },

  // ATOMIC ERA
  [TechnologyId.ADVANCED_FLIGHT]: {
    id: TechnologyId.ADVANCED_FLIGHT,
    cost: 1480,
    prerequisites: [TechnologyId.RADIO],
    ui: {
      name: 'Advanced flight',
      class: 'm-advanced-flight'
    }
  },
  [TechnologyId.ROCKETRY]: {
    id: TechnologyId.ROCKETRY,
    cost: 1480,
    prerequisites: [TechnologyId.RADIO, TechnologyId.CHEMISTRY],
    ui: {
      name: 'Rocketry',
      class: 'm-rocketry'
    }
  },
  [TechnologyId.ADVANCED_BALLISTICS]: {
    id: TechnologyId.ADVANCED_BALLISTICS,
    cost: 1410,
    prerequisites: [TechnologyId.REPLACEABLE_PARTS, TechnologyId.STEEL],
    ui: {
      name: 'Advanced ballistics',
      class: 'm-advanced-ballistics'
    }
  },
  [TechnologyId.COMBINED_ARMS]: {
    id: TechnologyId.COMBINED_ARMS,
    cost: 1480,
    prerequisites: [TechnologyId.STEEL],
    ui: {
      name: 'Combined arms',
      class: 'm-combined-arms'
    }
  },
  [TechnologyId.PLASTICS]: {
    id: TechnologyId.PLASTICS,
    cost: 1065,
    prerequisites: [TechnologyId.COMBUSTION],
    ui: {
      name: 'Plastics',
      class: 'm-plastics'
    }
  },
  [TechnologyId.COMPUTERS]: {
    id: TechnologyId.COMPUTERS,
    cost: 1660,
    prerequisites: [TechnologyId.ELECTRICITY, TechnologyId.RADIO],
    ui: {
      name: 'Computers',
      class: 'm-computers'
    }
  },
  [TechnologyId.NUCLEAR_FISSION]: {
    id: TechnologyId.NUCLEAR_FISSION,
    cost: 1195,
    prerequisites: [TechnologyId.ADVANCED_BALLISTICS, TechnologyId.COMBINED_ARMS],
    ui: {
      name: 'Nuclear fission',
      class: 'm-nuclear-fission'
    }
  },
  [TechnologyId.SYNTHETIC_MATERIALS]: {
    id: TechnologyId.SYNTHETIC_MATERIALS,
    cost: 1195,
    prerequisites: [TechnologyId.PLASTICS],
    ui: {
      name: 'Synthetic materials',
      class: 'm-synthetic-materials'
    }
  },

  // INFORMATION ERA
  [TechnologyId.TELECOMMUNICATIONS]: {
    id: TechnologyId.TELECOMMUNICATIONS,
    cost: 1850,
    prerequisites: [TechnologyId.COMPUTERS],
    ui: {
      name: 'Telecommunications',
      class: 'm-telecommunications'
    }
  },
  [TechnologyId.SATELLITES]: {
    id: TechnologyId.SATELLITES,
    cost: 1850,
    prerequisites: [TechnologyId.ADVANCED_FLIGHT, TechnologyId.ROCKETRY],
    ui: {
      name: 'Satellites',
      class: 'm-satellites'
    }
  },
  [TechnologyId.GUIDANCE_SYSTEMS]: {
    id: TechnologyId.GUIDANCE_SYSTEMS,
    cost: 1580,
    prerequisites: [TechnologyId.ROCKETRY, TechnologyId.ADVANCED_BALLISTICS],
    ui: {
      name: 'Guidance systems',
      class: 'm-guidance-systems'
    }
  },
  [TechnologyId.LASERS]: {
    id: TechnologyId.LASERS,
    cost: 1340,
    prerequisites: [TechnologyId.NUCLEAR_FISSION],
    ui: {
      name: 'Lasers',
      class: 'm-lasers'
    }
  },
  [TechnologyId.COMPOSITES]: {
    id: TechnologyId.COMPOSITES,
    cost: 1340,
    prerequisites: [TechnologyId.SYNTHETIC_MATERIALS],
    ui: {
      name: 'Composites',
      class: 'm-composites'
    }
  },
  [TechnologyId.STEALTH_TECHNOLOGY]: {
    id: TechnologyId.STEALTH_TECHNOLOGY,
    cost: 1850,
    prerequisites: [TechnologyId.SYNTHETIC_MATERIALS],
    ui: {
      name: 'Stealth technology',
      class: 'm-stealth-technology'
    }
  },
  [TechnologyId.ROBOTICS]: {
    id: TechnologyId.ROBOTICS,
    cost: 2155,
    prerequisites: [TechnologyId.COMPUTERS],
    ui: {
      name: 'Robotics',
      class: 'm-robotics'
    }
  },
  [TechnologyId.NUCLEAR_FUSION]: {
    id: TechnologyId.NUCLEAR_FUSION,
    cost: 1560,
    prerequisites: [TechnologyId.LASERS],
    ui: {
      name: 'Nuclear fusion',
      class: 'm-nuclear-fusion'
    }
  },
  [TechnologyId.NANOTECHNOLOGY]: {
    id: TechnologyId.NANOTECHNOLOGY,
    cost: 1560,
    prerequisites: [TechnologyId.COMPOSITES],
    ui: {
      name: 'Nanotechnology',
      class: 'm-nanotechnology'
    }
  }
};
