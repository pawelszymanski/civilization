export enum LandmassAmountId {
  LEAST,
  LESS,
  STANDARD,
  MORE,
  MOST,
}

export enum WorldAgeId {
  NEW,
  STANDARD,
  OLD,
}

export enum TemperatureId {
  HOT,
  STANDARD,
  COLD,
}

export enum RainfallId {
  DRY,
  STANDARD,
  WET,
}

export interface MapGeneratorSettings {
  seed: number;
  width: number; // 1-indexed
  height: number; // 1-indexed
  landmass: LandmassAmountId;
  continents: number;
  islands: number;
  archipelagos: number;
  worldAge: WorldAgeId;
  temperature: TemperatureId;
  rainfall: RainfallId;
}
