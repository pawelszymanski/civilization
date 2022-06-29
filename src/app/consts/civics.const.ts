import {Civic, CivicId} from '../models/civics';

type CivicSet = {
  [key in CivicId]: Civic;
};

export const CIVIC_SET: CivicSet = {
  // ANCIENT ERA
  [CivicId.CODE_OF_LAWS]: {
    id: CivicId.CODE_OF_LAWS,
    cost: 20,
    prerequisites: [],
    ui: {
      name: 'Code of laws',
      class: 'm-code-of-laws'
    }
  },
  [CivicId.CRAFTSMANSHIP]: {
    id: CivicId.CRAFTSMANSHIP,
    cost: 40,
    prerequisites: [CivicId.CODE_OF_LAWS],
    ui: {
      name: 'Craftsmanship',
      class: 'm-craftsmanship'
    }
  },
  [CivicId.FOREIGN_TRADE]: {
    id: CivicId.FOREIGN_TRADE,
    cost: 40,
    prerequisites: [CivicId.CODE_OF_LAWS],
    ui: {
      name: 'Foreign trade',
      class: 'm-foreign-trade'
    }
  },
  [CivicId.MILITARY_TRADITION]: {
    id: CivicId.MILITARY_TRADITION,
    cost: 50,
    prerequisites: [CivicId.CRAFTSMANSHIP],
    ui: {
      name: 'Military tradition',
      class: 'm-military-tradition'
    }
  },
  [CivicId.STATE_WORKFORCE]: {
    id: CivicId.STATE_WORKFORCE,
    cost: 70,
    prerequisites: [CivicId.CRAFTSMANSHIP],
    ui: {
      name: 'State workforce',
      class: 'm-state-workforce'
    }
  },
  [CivicId.EARLY_EMPIRE]: {
    id: CivicId.EARLY_EMPIRE,
    cost: 70,
    prerequisites: [CivicId.FOREIGN_TRADE],
    ui: {
      name: 'Early empire',
      class: 'm-early-empire'
    }
  },
  [CivicId.MYSTICISM]: {
    id: CivicId.MYSTICISM,
    cost: 50,
    prerequisites: [CivicId.FOREIGN_TRADE],
    ui: {
      name: 'Mysticism',
      class: 'm-mysticism'
    }
  },

  // CLASSICAL ERA
  [CivicId.GAMES_AND_RECREATION]: {
    id: CivicId.GAMES_AND_RECREATION,
    cost: 110,
    prerequisites: [CivicId.STATE_WORKFORCE],
    ui: {
      name: 'Games and recreation',
      class: 'm-games-and-recreation'
    }
  },
  [CivicId.POLITICAL_PHILOSOPHY]: {
    id: CivicId.POLITICAL_PHILOSOPHY,
    cost: 110,
    prerequisites: [CivicId.STATE_WORKFORCE, CivicId.EARLY_EMPIRE],
    ui: {
      name: 'Political philosophy',
      class: 'm-political-philosophy'
    }
  },
  [CivicId.DRAMA_AND_POETRY]: {
    id: CivicId.DRAMA_AND_POETRY,
    cost: 110,
    prerequisites: [CivicId.EARLY_EMPIRE],
    ui: {
      name: 'Drama and poetry',
      class: 'm-drama-and-poetry'
    }
  },
  [CivicId.MILITARY_TRAINING]: {
    id: CivicId.MILITARY_TRAINING,
    cost: 120,
    prerequisites: [CivicId.GAMES_AND_RECREATION, CivicId.MILITARY_TRADITION],
    ui: {
      name: 'Military training',
      class: 'm-military-training'
    }
  },
  [CivicId.DEFENSIVE_TACTICS]: {
    id: CivicId.DEFENSIVE_TACTICS,
    cost: 175,
    prerequisites: [CivicId.GAMES_AND_RECREATION, CivicId.POLITICAL_PHILOSOPHY],
    ui: {
      name: 'Defensive tactics',
      class: 'm-defensive-tactics'
    }
  },
  [CivicId.RECORDED_HISTORY]: {
    id: CivicId.RECORDED_HISTORY,
    cost: 175,
    prerequisites: [CivicId.POLITICAL_PHILOSOPHY, CivicId.DRAMA_AND_POETRY],
    ui: {
      name: 'Recorded history',
      class: 'm-recorded-history'
    }
  },
  [CivicId.THEOLOGY]: {
    id: CivicId.THEOLOGY,
    cost: 120,
    prerequisites: [CivicId.MYSTICISM, CivicId.DRAMA_AND_POETRY],
    ui: {
      name: 'Theology',
      class: 'm-theology'
    }
  },

  // MEDIEVAL ERA
  [CivicId.NAVAL_TRADITION]: {
    id: CivicId.NAVAL_TRADITION,
    cost: 200,
    prerequisites: [CivicId.DEFENSIVE_TACTICS],
    ui: {
      name: 'Naval tradition',
      class: 'm-naval-tradition'
    }
  },
  [CivicId.FEUDALISM]: {
    id: CivicId.FEUDALISM,
    cost: 275,
    prerequisites: [CivicId.DEFENSIVE_TACTICS],
    ui: {
      name: 'Feudalism',
      class: 'm-feudalism'
    }
  },
  [CivicId.CIVIL_SERVICE]: {
    id: CivicId.CIVIL_SERVICE,
    cost: 275,
    prerequisites: [CivicId.DEFENSIVE_TACTICS, CivicId.RECORDED_HISTORY],
    ui: {
      name: 'Civil service',
      class: 'm-civil-service'
    }
  },
  [CivicId.MERCENARIES]: {
    id: CivicId.MERCENARIES,
    cost: 290,
    prerequisites: [CivicId.MILITARY_TRAINING, CivicId.FEUDALISM],
    ui: {
      name: 'Mercenaries',
      class: 'm-mercenaries'
    }
  },
  [CivicId.MEDIEVAL_FAIRES]: {
    id: CivicId.MEDIEVAL_FAIRES,
    cost: 385,
    prerequisites: [CivicId.FEUDALISM],
    ui: {
      name: 'Medieval faires',
      class: 'm-medieval-faires'
    }
  },
  [CivicId.GUILDS]: {
    id: CivicId.GUILDS,
    cost: 385,
    prerequisites: [CivicId.FEUDALISM, CivicId.CIVIL_SERVICE],
    ui: {
      name: 'Guilds',
      class: 'm-guilds'
    }
  },
  [CivicId.DIVINE_RIGHT]: {
    id: CivicId.DIVINE_RIGHT,
    cost: 290,
    prerequisites: [CivicId.THEOLOGY, CivicId.CIVIL_SERVICE],
    ui: {
      name: 'Divine right',
      class: 'm-divine-right'
    }
  },

  // RENAISSANCE ERA
  [CivicId.EXPLORATION]: {
    id: CivicId.EXPLORATION,
    cost: 400,
    prerequisites: [CivicId.MERCENARIES, CivicId.MEDIEVAL_FAIRES],
    ui: {
      name: 'Exploration',
      class: 'm-exploration'
    }
  },
  [CivicId.HUMANISM]: {
    id: CivicId.HUMANISM,
    cost: 540,
    prerequisites: [CivicId.MEDIEVAL_FAIRES, CivicId.GUILDS],
    ui: {
      name: 'Humanism',
      class: 'm-humanism'
    }
  },
  [CivicId.DIPLOMATIC_SERVICE]: {
    id: CivicId.DIPLOMATIC_SERVICE,
    cost: 540,
    prerequisites: [CivicId.GUILDS],
    ui: {
      name: 'Diplomatic service',
      class: 'm-diplomatic-service'
    }
  },
  [CivicId.REFORMED_CHURCH]: {
    id: CivicId.REFORMED_CHURCH,
    cost: 400,
    prerequisites: [CivicId.DIVINE_RIGHT],
    ui: {
      name: 'Reformed church',
      class: 'm-reformed-church'
    }
  },
  [CivicId.MERCANTILISM]: {
    id: CivicId.MERCANTILISM,
    cost: 655,
    prerequisites: [CivicId.HUMANISM],
    ui: {
      name: 'Mercantilism',
      class: 'm-mercantilism'
    }
  },
  [CivicId.THE_ENLIGHTENMENT]: {
    id: CivicId.THE_ENLIGHTENMENT,
    cost: 655,
    prerequisites: [CivicId.DIPLOMATIC_SERVICE],
    ui: {
      name: 'The enlightenment',
      class: 'm-the-enlightenment'
    }
  },

  // INDUSTRIAL ERA
  [CivicId.COLONIALISM]: {
    id: CivicId.COLONIALISM,
    cost: 725,
    prerequisites: [CivicId.MERCANTILISM],
    ui: {
      name: 'Colonialism',
      class: 'm-colonialism'
    }
  },
  [CivicId.CIVIL_ENGINEERING]: {
    id: CivicId.CIVIL_ENGINEERING,
    cost: 920,
    prerequisites: [CivicId.MERCANTILISM],
    ui: {
      name: 'Civil engineering',
      class: 'm-civil-engineering'
    }
  },
  [CivicId.NATIONALISM]: {
    id: CivicId.NATIONALISM,
    cost: 920,
    prerequisites: [CivicId.THE_ENLIGHTENMENT],
    ui: {
      name: 'Nationalism',
      class: 'm-nationalism'
    }
  },
  [CivicId.OPERA_AND_BALLET]: {
    id: CivicId.OPERA_AND_BALLET,
    cost: 725,
    prerequisites: [CivicId.THE_ENLIGHTENMENT],
    ui: {
      name: 'Opera nd ballet',
      class: 'm-opera-and-ballet'
    }
  },
  [CivicId.NATURAL_HISTORY]: {
    id: CivicId.NATURAL_HISTORY,
    cost: 870,
    prerequisites: [CivicId.COLONIALISM],
    ui: {
      name: 'Natural history',
      class: 'm-natural-history'
    }
  },
  [CivicId.URBANIZATION]: {
    id: CivicId.URBANIZATION,
    cost: 1060,
    prerequisites: [CivicId.CIVIL_ENGINEERING, CivicId.NATIONALISM],
    ui: {
      name: 'Urbanization',
      class: 'm-urbanization'
    }
  },
  [CivicId.SCORCHED_EARTH]: {
    id: CivicId.SCORCHED_EARTH,
    cost: 1060,
    prerequisites: [CivicId.NATIONALISM],
    ui: {
      name: 'Scorched earth',
      class: 'm-scorched-earth'
    }
  },

  // MODERN ERA
  [CivicId.CONSERVATION]: {
    id: CivicId.CONSERVATION,
    cost: 1255,
    prerequisites: [CivicId.NATURAL_HISTORY, CivicId.URBANIZATION],
    ui: {
      name: 'Conservation',
      class: 'm-conservation'
    }
  },
  [CivicId.MASS_MEDIA]: {
    id: CivicId.MASS_MEDIA,
    cost: 1410,
    prerequisites: [CivicId.URBANIZATION],
    ui: {
      name: 'Mass media',
      class: 'm-mass-media'
    }
  },
  [CivicId.MOBILIZATION]: {
    id: CivicId.MOBILIZATION,
    cost: 1410,
    prerequisites: [CivicId.URBANIZATION],
    ui: {
      name: 'Mobilization',
      class: 'm-mobilization'
    }
  },
  [CivicId.CAPITALISM]: {
    id: CivicId.CAPITALISM,
    cost: 1560,
    prerequisites: [CivicId.MASS_MEDIA],
    ui: {
      name: 'Capitalism',
      class: 'm-capitalism'
    }
  },
  [CivicId.IDEOLOGY]: {
    id: CivicId.IDEOLOGY,
    cost: 1660,
    prerequisites: [CivicId.MASS_MEDIA, CivicId.MOBILIZATION],
    ui: {
      name: 'Ideology',
      class: 'm-ideology'
    }
  },
  [CivicId.NUCLEAR_PROGRAM]: {
    id: CivicId.NUCLEAR_PROGRAM,
    cost: 1715,
    prerequisites: [CivicId.IDEOLOGY],
    ui: {
      name: 'Nuclear program',
      class: 'm-nuclear-program'
    }
  },
  [CivicId.SUFFRAGE]: {
    id: CivicId.SUFFRAGE,
    cost: 1715,
    prerequisites: [CivicId.IDEOLOGY],
    ui: {
      name: 'Suffrage',
      class: 'm-suffrage'
    }
  },
  [CivicId.TOTALITARIANISM]: {
    id: CivicId.TOTALITARIANISM,
    cost: 1715,
    prerequisites: [CivicId.IDEOLOGY],
    ui: {
      name: 'Totalitarianism',
      class: 'm-totalitarianism'
    }
  },
  [CivicId.CLASS_STRUGGLE]: {
    id: CivicId.CLASS_STRUGGLE,
    cost: 1715,
    prerequisites: [CivicId.IDEOLOGY],
    ui: {
      name: 'Class struggle',
      class: 'm-class-struggle'
    }
  },

  // ATOMIC ERA
  [CivicId.CULTURAL_HERITAGE]: {
    id: CivicId.CULTURAL_HERITAGE,
    cost: 1955,
    prerequisites: [CivicId.CONSERVATION],
    ui: {
      name: 'Cultural heritage',
      class: 'm-cultural-heritage'
    }
  },
  [CivicId.COLD_WAR]: {
    id: CivicId.COLD_WAR,
    cost: 2185,
    prerequisites: [CivicId.IDEOLOGY],
    ui: {
      name: 'Cold war',
      class: 'm-cold-war'
    }
  },
  [CivicId.PROFESSIONAL_SPORTS]: {
    id: CivicId.PROFESSIONAL_SPORTS,
    cost: 2185,
    prerequisites: [CivicId.IDEOLOGY],
    ui: {
      name: 'Professional sports',
      class: 'm-professional-sports'
    }
  },
  [CivicId.RAPID_DEPLOYMENT]: {
    id: CivicId.RAPID_DEPLOYMENT,
    cost: 2415,
    prerequisites: [CivicId.COLD_WAR],
    ui: {
      name: 'Rapid deployment',
      class: 'm-rapid-deployment'
    }
  },
  [CivicId.SPACE_RACE]: {
    id: CivicId.SPACE_RACE,
    cost: 2415,
    prerequisites: [CivicId.COLD_WAR],
    ui: {
      name: 'Space race',
      class: 'm-space-race'
    }
  },

  // INFORMATION ERA
  [CivicId.ENVIRONMENTALISM]: {
    id: CivicId.ENVIRONMENTALISM,
    cost: 2880,
    prerequisites: [CivicId.CULTURAL_HERITAGE, CivicId.RAPID_DEPLOYMENT],
    ui: {
      name: 'Environmentalism',
      class: 'm-environmentalism'
    }
  },
  [CivicId.GLOBALIZATION]: {
    id: CivicId.GLOBALIZATION,
    cost: 2880,
    prerequisites: [CivicId.RAPID_DEPLOYMENT, CivicId.SPACE_RACE],
    ui: {
      name: 'Globalization',
      class: 'm-globalization'
    }
  },
  [CivicId.SOCIAL_MEDIA]: {
    id: CivicId.SOCIAL_MEDIA,
    cost: 2880,
    prerequisites: [CivicId.PROFESSIONAL_SPORTS, CivicId.SPACE_RACE],
    ui: {
      name: 'Social media',
      class: 'm-social-media'
    }
  },
  [CivicId.NEAR_FUTURE_GOVERNANCE]: {
    id: CivicId.NEAR_FUTURE_GOVERNANCE,
    cost: 3100,
    prerequisites: [CivicId.ENVIRONMENTALISM, CivicId.GLOBALIZATION],
    ui: {
      name: 'Near future governance',
      class: 'm-near-future-governance'
    }
  },
  [CivicId.VENTURE_POLITICS]: {
    id: CivicId.VENTURE_POLITICS,
    cost: 3000,
    prerequisites: [CivicId.GLOBALIZATION, CivicId.SOCIAL_MEDIA],
    ui: {
      name: 'Venture politics',
      class: 'm-venture-politics'
    }
  },
  [CivicId.DISTRIBUTED_SOVEREIGNTY]: {
    id: CivicId.DISTRIBUTED_SOVEREIGNTY,
    cost: 3000,
    prerequisites: [CivicId.GLOBALIZATION, CivicId.SOCIAL_MEDIA],
    ui: {
      name: 'Distributed sovereignty',
      class: 'm-distributed-sovereignty'
    }
  },
  [CivicId.OPTIMIZATION_IMPERATIVE]: {
    id: CivicId.OPTIMIZATION_IMPERATIVE,
    cost: 3000,
    prerequisites: [CivicId.GLOBALIZATION, CivicId.SOCIAL_MEDIA],
    ui: {
      name: 'Optimization imperative',
      class: 'm-optimization-imperative'
    }
  }
};
