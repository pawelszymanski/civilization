import {Civic, CivicId} from '../models/civics';

export const CIVICS: Civic[] = [
  // ANCIENT ERA
  { id: CivicId.CODE_OF_LAWS, cost: 20, prerequisites: [] },
  { id: CivicId.CRAFTSMANSHIP, cost: 40, prerequisites: [CivicId.CODE_OF_LAWS] },
  { id: CivicId.FOREIGN_TRADE, cost: 40, prerequisites: [CivicId.CODE_OF_LAWS] },
  { id: CivicId.MILITARY_TRADITION, cost: 50, prerequisites: [CivicId.CRAFTSMANSHIP] },
  { id: CivicId.STATE_WORKFORCE, cost: 70, prerequisites: [CivicId.CRAFTSMANSHIP] },
  { id: CivicId.EARLY_EMPIRE, cost: 70, prerequisites: [CivicId.FOREIGN_TRADE] },
  { id: CivicId.MYSTICISM, cost: 50, prerequisites: [CivicId.FOREIGN_TRADE] },

  // CLASSICAL ERA
  { id: CivicId.GAMES_AND_RECREATION, cost: 110, prerequisites: [CivicId.STATE_WORKFORCE] },
  { id: CivicId.POLITICAL_PHILOSOPHY, cost: 110, prerequisites: [CivicId.STATE_WORKFORCE, CivicId.EARLY_EMPIRE] },
  { id: CivicId.DRAMA_AND_POETRY, cost: 110, prerequisites: [CivicId.EARLY_EMPIRE] },
  { id: CivicId.MILITARY_TRAINING, cost: 120, prerequisites: [CivicId.GAMES_AND_RECREATION, CivicId.MILITARY_TRADITION] },
  { id: CivicId.DEFENSIVE_TACTICS, cost: 175, prerequisites: [CivicId.GAMES_AND_RECREATION, CivicId.POLITICAL_PHILOSOPHY] },
  { id: CivicId.RECORDED_HISTORY, cost: 175, prerequisites: [CivicId.POLITICAL_PHILOSOPHY, CivicId.DRAMA_AND_POETRY] },
  { id: CivicId.THEOLOGY, cost: 120, prerequisites: [CivicId.MYSTICISM, CivicId.DRAMA_AND_POETRY] },

  // MEDIEVAL ERA
  { id: CivicId.NAVAL_TRADITION, cost: 200, prerequisites: [CivicId.DEFENSIVE_TACTICS] },
  { id: CivicId.FEUDALISM, cost: 275, prerequisites: [CivicId.DEFENSIVE_TACTICS] },
  { id: CivicId.CIVIL_SERVICE, cost: 275, prerequisites: [CivicId.DEFENSIVE_TACTICS, CivicId.RECORDED_HISTORY] },
  { id: CivicId.MERCENARIES, cost: 290, prerequisites: [CivicId.MILITARY_TRAINING, CivicId.FEUDALISM] },
  { id: CivicId.MEDIEVAL_FAIRES, cost: 385, prerequisites: [CivicId.FEUDALISM] },
  { id: CivicId.GUILDS, cost: 385, prerequisites: [CivicId.FEUDALISM, CivicId.CIVIL_SERVICE] },
  { id: CivicId.DIVINE_RIGHT, cost: 290, prerequisites: [CivicId.THEOLOGY, CivicId.CIVIL_SERVICE] },

  // RENAISSANCE ERA
  { id: CivicId.EXPLORATION, cost: 400, prerequisites: [CivicId.MERCENARIES, CivicId.MEDIEVAL_FAIRES] },
  { id: CivicId.HUMANISM, cost: 540, prerequisites: [CivicId.MEDIEVAL_FAIRES, CivicId.GUILDS] },
  { id: CivicId.DIPLOMACY_SERVICE, cost: 540, prerequisites: [CivicId.GUILDS] },
  { id: CivicId.REFORMED_CHURCH, cost: 400, prerequisites: [CivicId.DIVINE_RIGHT] },
  { id: CivicId.MERCANTILISM, cost: 655, prerequisites: [CivicId.HUMANISM] },
  { id: CivicId.THE_ENLIGHTENMENT, cost: 655, prerequisites: [CivicId.DIPLOMACY_SERVICE] },

  // INDUSTRIAL ERA
  { id: CivicId.COLONIALISM, cost: 725, prerequisites: [CivicId.MERCANTILISM] },
  { id: CivicId.CIVIL_ENGINEERING, cost: 920, prerequisites: [CivicId.MERCANTILISM] },
  { id: CivicId.NATIONALISM, cost: 920, prerequisites: [CivicId.THE_ENLIGHTENMENT] },
  { id: CivicId.OPERA_AND_BALLET, cost: 725, prerequisites: [CivicId.THE_ENLIGHTENMENT] },
  { id: CivicId.NATURAL_HISTORY, cost: 870, prerequisites: [CivicId.COLONIALISM] },
  { id: CivicId.URBANIZATION, cost: 1060, prerequisites: [CivicId.CIVIL_ENGINEERING, CivicId.NATIONALISM] },
  { id: CivicId.SCORCHED_EARTH, cost: 1060, prerequisites: [CivicId.NATIONALISM] },

  // MODERN ERA
  { id: CivicId.CONSERVATION, cost: 1255, prerequisites: [CivicId.NATURAL_HISTORY, CivicId.URBANIZATION] },
  { id: CivicId.MASS_MEDIA, cost: 1410, prerequisites: [CivicId.URBANIZATION] },
  { id: CivicId.MOBILIZATION, cost: 1410, prerequisites: [CivicId.URBANIZATION] },
  { id: CivicId.CAPITALISM, cost: 1560, prerequisites: [CivicId.MASS_MEDIA] },
  { id: CivicId.IDEOLOGY, cost: 1660, prerequisites: [CivicId.MASS_MEDIA, CivicId.MOBILIZATION] },
  { id: CivicId.NUCLEAR_PROGRAM, cost: 1715, prerequisites: [CivicId.IDEOLOGY] },
  { id: CivicId.SUFFRAGE, cost: 1715, prerequisites: [CivicId.IDEOLOGY] },
  { id: CivicId.TOTALITARIANISM, cost: 1715, prerequisites: [CivicId.IDEOLOGY] },
  { id: CivicId.CLASS_STRUGGLE, cost: 1715, prerequisites: [CivicId.IDEOLOGY] },

  // ATOMIC ERA
  { id: CivicId.CULTURAL_HERITAGE, cost: 1955, prerequisites: [CivicId.CONSERVATION] },
  { id: CivicId.COLD_WAR, cost: 2185, prerequisites: [CivicId.IDEOLOGY] },
  { id: CivicId.PROFESSIONAL_SPORTS, cost: 2185, prerequisites: [CivicId.IDEOLOGY] },
  { id: CivicId.RAPID_DEPLOYMENT, cost: 2415, prerequisites: [CivicId.COLD_WAR] },
  { id: CivicId.SPACE_RACE, cost: 2415, prerequisites: [CivicId.COLD_WAR] },

  // INFORMATION ERA
  { id: CivicId.ENVIRONMENTALISM, cost: 2880, prerequisites: [CivicId.CULTURAL_HERITAGE, CivicId.RAPID_DEPLOYMENT] },
  { id: CivicId.GLOBALIZATION, cost: 2880, prerequisites: [CivicId.RAPID_DEPLOYMENT, CivicId.SPACE_RACE] },
  { id: CivicId.SOCIAL_MEDIA, cost: 2880, prerequisites: [CivicId.PROFESSIONAL_SPORTS, CivicId.SPACE_RACE] },
  { id: CivicId.NEAR_FUTURE_GOVERNANCE, cost: 3100, prerequisites: [CivicId.ENVIRONMENTALISM, CivicId.GLOBALIZATION] },
  { id: CivicId.VENTURE_POLITICS, cost: 3000, prerequisites: [CivicId.GLOBALIZATION, CivicId.SOCIAL_MEDIA] },
  { id: CivicId.DISTRIBUTED_SOVEREIGNTY, cost: 3000, prerequisites: [CivicId.GLOBALIZATION, CivicId.SOCIAL_MEDIA] },
  { id: CivicId.OPTIMIZATION_IMPERATIVE, cost: 3000, prerequisites: [CivicId.GLOBALIZATION, CivicId.SOCIAL_MEDIA] }
]
