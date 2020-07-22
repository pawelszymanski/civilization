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

export const YIELD_IDS_IN_ORDER = [
  YieldId.FOOD,
  YieldId.PRODUCTION,
  YieldId.GOLD,
  YieldId.SCIENCE,
  YieldId.CULTURE,
  YieldId.RELIGION,
  YieldId.POWER,
  YieldId.TOURISM
]

export type Yield = {
  [key in YieldId]: number;
}

export interface YieldOfType {
  type: YieldId;
  value: number;
}
