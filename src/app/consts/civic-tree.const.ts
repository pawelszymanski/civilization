import {EraId} from '../models/era';
import {CivicId} from '../models/civics';
import {CivicTree} from '../models/research-tree';

export const CIVIC_TREE: CivicTree = [
  {
    id: EraId.ANCIENT,
    civics: [
      {id: CivicId.CODE_OF_LAWS, eraCoords: {x: 0, y: 3}},
      {id: CivicId.CRAFTSMANSHIP, eraCoords: {x: 1, y: 1}},
      {id: CivicId.FOREIGN_TRADE, eraCoords: {x: 1, y: 5}},
      {id: CivicId.MILITARY_TRADITION, eraCoords: {x: 2, y: 0}},
      {id: CivicId.STATE_WORKFORCE, eraCoords: {x: 2, y: 3}},
      {id: CivicId.EARLY_EMPIRE, eraCoords: {x: 2, y: 4}},
      {id: CivicId.MYSTICISM, eraCoords: {x: 2, y: 6}}
    ]
  },
  {
    id: EraId.CLASSICAL,
    civics: [
      {id: CivicId.GAMES_AND_RECREATION, eraCoords: {x: 0, y: 1}},
      {id: CivicId.POLITICAL_PHILOSOPHY, eraCoords: {x: 0, y: 3}},
      {id: CivicId.DRAMA_AND_POETRY, eraCoords: {x: 0, y: 5}},
      {id: CivicId.MILITARY_TRAINING, eraCoords: {x: 1, y: 0}},
      {id: CivicId.DEFENSIVE_TACTICS, eraCoords: {x: 1, y: 2}},
      {id: CivicId.RECORDED_HISTORY, eraCoords: {x: 1, y: 4}},
      {id: CivicId.THEOLOGY, eraCoords: {x: 1, y: 6}}
    ]
  },
  {
    id: EraId.MEDIEVAL,
    civics: [
      {id: CivicId.NAVAL_TRADITION, eraCoords: {x: 0, y: 1}},
      {id: CivicId.FEUDALISM, eraCoords: {x: 0, y: 2}},
      {id: CivicId.CIVIL_SERVICE, eraCoords: {x: 0, y: 4}},
      {id: CivicId.MERCENARIES, eraCoords: {x: 1, y: 0}},
      {id: CivicId.MEDIEVAL_FAIRES, eraCoords: {x: 1, y: 2}},
      {id: CivicId.GUILDS, eraCoords: {x: 1, y: 4}},
      {id: CivicId.DIVINE_RIGHT, eraCoords: {x: 1, y: 6}}
    ]
  },
  {
    id: EraId.RENAISSANCE,
    civics: [
      {id: CivicId.EXPLORATION, eraCoords: {x: 0, y: 0}},
      {id: CivicId.HUMANISM, eraCoords: {x: 0, y: 2}},
      {id: CivicId.DIPLOMATIC_SERVICE, eraCoords: {x: 0, y: 4}},
      {id: CivicId.REFORMED_CHURCH, eraCoords: {x: 0, y: 6}},
      {id: CivicId.MERCANTILISM, eraCoords: {x: 1, y: 2}},
      {id: CivicId.THE_ENLIGHTENMENT, eraCoords: {x: 1, y: 4}}
    ]
  },
  {
    id: EraId.INDUSTRIAL,
    civics: [
      {id: CivicId.COLONIALISM, eraCoords: {x: 0, y: 0}},
      {id: CivicId.CIVIL_ENGINEERING, eraCoords: {x: 0, y: 2}},
      {id: CivicId.NATIONALISM, eraCoords: {x: 0, y: 3}},
      {id: CivicId.OPERA_AND_BALLET, eraCoords: {x: 0, y: 5}},
      {id: CivicId.NATURAL_HISTORY, eraCoords: {x: 1, y: 0}},
      {id: CivicId.URBANIZATION, eraCoords: {x: 1, y: 2}},
      {id: CivicId.SCORCHED_EARTH, eraCoords: {x: 1, y: 5}}
    ]
  },
  {
    id: EraId.MODERN,
    civics: [
      {id: CivicId.CONSERVATION, eraCoords: {x: 0, y: 0}},
      {id: CivicId.MASS_MEDIA, eraCoords: {x: 0, y: 2}},
      {id: CivicId.MOBILIZATION, eraCoords: {x: 0, y: 4}},
      {id: CivicId.CAPITALISM, eraCoords: {x: 1, y: 1}},
      {id: CivicId.IDEOLOGY, eraCoords: {x: 1, y: 2}},
      {id: CivicId.NUCLEAR_PROGRAM, eraCoords: {x: 2, y: 1}},
      {id: CivicId.SUFFRAGE, eraCoords: {x: 2, y: 3}},
      {id: CivicId.TOTALITARIANISM, eraCoords: {x: 2, y: 5}},
      {id: CivicId.CLASS_STRUGGLE, eraCoords: {x: 2, y: 6}}
    ]
  },
  {
    id: EraId.ATOMIC,
    civics: [
      {id: CivicId.CULTURAL_HERITAGE, eraCoords: {x: 0, y: 0}},
      {id: CivicId.COLD_WAR, eraCoords: {x: 0, y: 2}},
      {id: CivicId.PROFESSIONAL_SPORTS, eraCoords: {x: 0, y: 5}},
      {id: CivicId.RAPID_DEPLOYMENT, eraCoords: {x: 1, y: 2}},
      {id: CivicId.SPACE_RACE, eraCoords: {x: 1, y: 4}}
    ]
  },
  {
    id: EraId.INFORMATION,
    civics: [
      {id: CivicId.ENVIRONMENTALISM, eraCoords: {x: 0, y: 1}},
      {id: CivicId.GLOBALIZATION, eraCoords: {x: 0, y: 3}},
      {id: CivicId.SOCIAL_MEDIA, eraCoords: {x: 0, y: 5}},
      {id: CivicId.NEAR_FUTURE_GOVERNANCE, eraCoords: {x: 1, y: 2}},
      {id: CivicId.VENTURE_POLITICS, eraCoords: {x: 1, y: 3}},
      {id: CivicId.DISTRIBUTED_SOVEREIGNTY, eraCoords: {x: 1, y: 4}},
      {id: CivicId.OPTIMIZATION_IMPERATIVE, eraCoords: {x: 1, y: 5}}
    ]
  }
];
