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

export const YIELD_IDS_IN_ORDER = [
  YieldId.FOOD,
  YieldId.PRODUCTION,
  YieldId.GOLD,
  YieldId.SCIENCE,
  YieldId.CULTURE,
  YieldId.FAITH,
  YieldId.POWER,
  YieldId.TOURISM
]

export type Yield = {
  [key in YieldId]: number;
}

export interface YieldOfType {
  type: YieldId;
  count: number;
}
