export enum YieldId {
  FOOD = 'FOOD',
  PRODUCTION = 'PRODUCTION',
  GOLD = 'GOLD',
  SCIENCE = 'SCIENCE',
  CULTURE = 'CULTURE',
  RELIGION = 'RELIGION',
  POWER = 'POWER',
  TOURISM = 'TOURISM'
}

export type Yield = {
  [key in YieldId]: number;
}
