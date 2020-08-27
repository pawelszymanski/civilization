export enum YieldId {
  FOOD = 'FOOD',
  PRODUCTION = 'PRODUCTION',
  GOLD = 'GOLD',
  SCIENCE = 'SCIENCE',
  CULTURE = 'CULTURE',
  FAITH = 'FAITH',
  POWER = 'POWER',
  TOURISM = 'TOURISM'
}

export type Yield = {
  [key in YieldId]: number;
}

export interface YieldOfType {
  type: YieldId;
  count: number;
}
