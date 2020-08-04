import {EraId} from '../../models/era';
import {TechTree} from '../../models/technology/tech-tree';
import {TechnologyId} from '../../models/technology/technology';

export const TECH_TREE: TechTree = [
  {
    id: EraId.ANCIENT,
    technologies: [
      {id: TechnologyId.POTTERY, eraCoords: {x: 0, y: 3}},
      {id: TechnologyId.ANIMAL_HUSBANDRY, eraCoords: {x: 0, y: 4}},
      {id: TechnologyId.MINING, eraCoords: {x: 0, y: 6}},
      {id: TechnologyId.SAILING, eraCoords: {x: 1, y: 0}},
      {id: TechnologyId.ASTROLOGY, eraCoords: {x: 1, y: 1}},
      {id: TechnologyId.IRRIGATION, eraCoords: {x: 1, y: 2}},
      {id: TechnologyId.WRITING, eraCoords: {x: 1, y: 3}},
      {id: TechnologyId.ARCHERY, eraCoords: {x: 1, y: 4}},
      {id: TechnologyId.MASONRY, eraCoords: {x: 2, y: 5}},
      {id: TechnologyId.BRONZE_WORKING, eraCoords: {x: 2, y: 6}},
      {id: TechnologyId.WHEEL, eraCoords: {x: 2, y: 7}}
    ]
  },
  {
    id: EraId.CLASSICAL,
    technologies: [
      {id: TechnologyId.CELESTIAL_NAVIGATION, eraCoords: {x: 0, y: 1}},
      {id: TechnologyId.CURRENCY, eraCoords: {x: 0, y: 3}},
      {id: TechnologyId.HORSEBACK_RIDING, eraCoords: {x: 0, y: 4}},
      {id: TechnologyId.IRON_WORKING, eraCoords: {x: 0, y: 6}},
      {id: TechnologyId.SHIPBUILDING, eraCoords: {x: 1, y: 0}},
      {id: TechnologyId.MATHEMATICS, eraCoords: {x: 1, y: 2}},
      {id: TechnologyId.CONSTRUCTION, eraCoords: {x: 1, y: 5}},
      {id: TechnologyId.ENGINEERING, eraCoords: {x: 1, y: 7}}
    ]
  },
  {
    id: EraId.MEDIEVAL,
    technologies: [
      {id: TechnologyId.BUTTRESS, eraCoords: {x: 0, y: 0}},
      {id: TechnologyId.MILITARY_TACTICS, eraCoords: {x: 0, y: 1}},
      {id: TechnologyId.APPRENTICESHIP, eraCoords: {x: 0, y: 3}},
      {id: TechnologyId.MACHINERY, eraCoords: {x: 0, y: 7}},
      {id: TechnologyId.EDUCATION, eraCoords: {x: 1, y: 2}},
      {id: TechnologyId.STIRRUPS, eraCoords: {x: 1, y: 4}},
      {id: TechnologyId.MILITARY_ENGINEERING, eraCoords: {x: 1, y: 5}},
      {id: TechnologyId.CASTLES, eraCoords: {x: 1, y: 6}}
    ]
  },
  {
    id: EraId.RENAISSANCE,
    technologies: [
      {id: TechnologyId.CARTOGRAPHY, eraCoords: {x: 0, y: 0}},
      {id: TechnologyId.MASS_PRODUCTION, eraCoords: {x: 0, y: 1}},
      {id: TechnologyId.BANKING, eraCoords: {x: 0, y: 3}},
      {id: TechnologyId.GUNPOWDER, eraCoords: {x: 0, y: 4}},
      {id: TechnologyId.PRINTING, eraCoords: {x: 0, y: 7}},
      {id: TechnologyId.SQUARE_RIGGING, eraCoords: {x: 1, y: 0}},
      {id: TechnologyId.ASTRONOMY, eraCoords: {x: 1, y: 2}},
      {id: TechnologyId.METAL_CASTING, eraCoords: {x: 1, y: 4}},
      {id: TechnologyId.SIEGE_TACTICS, eraCoords: {x: 1, y: 6}}
    ]
  },
  {
    id: EraId.INDUSTRIAL,
    technologies: [
      {id: TechnologyId.INDUSTRIALIZATION, eraCoords: {x: 0, y: 1}},
      {id: TechnologyId.SCIENTIFIC_THEORY, eraCoords: {x: 0, y: 2}},
      {id: TechnologyId.BALLISTICS, eraCoords: {x: 0, y: 4}},
      {id: TechnologyId.MILITARY_SERVICE, eraCoords: {x: 0, y: 6}},
      {id: TechnologyId.STEAM_POWER, eraCoords: {x: 1, y: 0}},
      {id: TechnologyId.SANITATION, eraCoords: {x: 1, y: 2}},
      {id: TechnologyId.ECONOMICS, eraCoords: {x: 1, y: 3}},
      {id: TechnologyId.RIFLING, eraCoords: {x: 1, y: 5}}
    ]
  },
  {
    id: EraId.MODERN,
    technologies: [
      {id: TechnologyId.FLIGHT, eraCoords: {x: 0, y: 1}},
      {id: TechnologyId.REPLACEABLE_PARTS, eraCoords: {x: 0, y: 3}},
      {id: TechnologyId.STEEL, eraCoords: {x: 0, y: 4}},
      {id: TechnologyId.REFINING, eraCoords: {x: 0, y: 6}},
      {id: TechnologyId.ELECTRICITY, eraCoords: {x: 1, y: 0}},
      {id: TechnologyId.RADIO, eraCoords: {x: 1, y: 1}},
      {id: TechnologyId.CHEMISTRY, eraCoords: {x: 1, y: 2}},
      {id: TechnologyId.COMBUSTION, eraCoords: {x: 1, y: 5}}
    ]
  },
  {
    id: EraId.ATOMIC,
    technologies: [
      {id: TechnologyId.ADVANCED_FLIGHT, eraCoords: {x: 0, y: 1}},
      {id: TechnologyId.ROCKETRY, eraCoords: {x: 0, y: 2}},
      {id: TechnologyId.ADVANCED_BALLISTICS, eraCoords: {x: 0, y: 3}},
      {id: TechnologyId.COMBINED_ARMS, eraCoords: {x: 0, y: 4}},
      {id: TechnologyId.PLASTICS, eraCoords: {x: 0, y: 5}},
      {id: TechnologyId.COMPUTERS, eraCoords: {x: 1, y: 0}},
      {id: TechnologyId.NUCLEAR_FISSION, eraCoords: {x: 1, y: 4}},
      {id: TechnologyId.SYNTHETIC_MATERIALS, eraCoords: {x: 1, y: 5}}
    ]
  },
  {
    id: EraId.INFORMATION,
    technologies: [
      {id: TechnologyId.TELECOMMUNICATIONS, eraCoords: {x: 0, y: 0}},
      {id: TechnologyId.SATELLITES, eraCoords: {x: 0, y: 2}},
      {id: TechnologyId.GUIDANCE_SYSTEMS, eraCoords: {x: 0, y: 3}},
      {id: TechnologyId.LASERS, eraCoords: {x: 0, y: 4}},
      {id: TechnologyId.COMPOSITES, eraCoords: {x: 0, y: 5}},
      {id: TechnologyId.STEALTH_TECHNOLOGY, eraCoords: {x: 0, y: 6}},
      {id: TechnologyId.ROBOTICS, eraCoords: {x: 1, y: 1}},
      {id: TechnologyId.NUCLEAR_FUSION, eraCoords: {x: 1, y: 4}},
      {id: TechnologyId.NANOTECHNOLOGY, eraCoords: {x: 1, y: 5}}
    ]
  }
];
