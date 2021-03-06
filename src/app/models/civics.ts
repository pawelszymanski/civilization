export enum CivicId {
  CODE_OF_LAWS,
  CRAFTSMANSHIP,
  FOREIGN_TRADE,
  MILITARY_TRADITION,
  STATE_WORKFORCE,
  EARLY_EMPIRE,
  MYSTICISM,
  GAMES_AND_RECREATION,
  POLITICAL_PHILOSOPHY,
  DRAMA_AND_POETRY,
  MILITARY_TRAINING,
  DEFENSIVE_TACTICS,
  RECORDED_HISTORY,
  THEOLOGY,
  NAVAL_TRADITION,
  FEUDALISM,
  CIVIL_SERVICE,
  MERCENARIES,
  MEDIEVAL_FAIRES,
  GUILDS,
  DIVINE_RIGHT,
  EXPLORATION,
  HUMANISM,
  DIPLOMACTIC_SERVICE,
  REFORMED_CHURCH,
  MERCANTILISM,
  THE_ENLIGHTENMENT,
  COLONIALISM,
  CIVIL_ENGINEERING,
  NATIONALISM,
  OPERA_AND_BALLET,
  NATURAL_HISTORY,
  URBANIZATION,
  SCORCHED_EARTH,
  CONSERVATION,
  MASS_MEDIA,
  MOBILIZATION,
  CAPITALISM,
  IDEOLOGY,
  NUCLEAR_PROGRAM,
  SUFFRAGE,
  TOTALITARIANISM,
  CLASS_STRUGGLE,
  CULTURAL_HERITAGE,
  COLD_WAR,
  PROFESSIONAL_SPORTS,
  RAPID_DEPLOYMENT,
  SPACE_RACE,
  ENVIRONMENTALISM,
  GLOBALIZATION,
  SOCIAL_MEDIA,
  NEAR_FUTURE_GOVERNANCE,
  VENTURE_POLITICS,
  DISTRIBUTED_SOVEREIGNTY,
  OPTIMIZATION_IMPERATIVE,
}

export interface Civic {
  id: CivicId;
  prerequisites: CivicId[];
  cost: number;
  ui: {
    name: string;
    class: string;
  }
}
