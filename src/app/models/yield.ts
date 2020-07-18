export enum YieldId {
  GOLD,
  SCIENCE,
  PRODUCTION,
  CULTURE,
  RELIGION,
  POWER,
  TOURISM
}

export type Yield = {
  [key in YieldId]: number;
};
