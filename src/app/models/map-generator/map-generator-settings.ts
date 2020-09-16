export enum LandmassValueId {
  LEAST,
  LESS,
  STANDARD,
  MORE,
  MOST
}

export enum WorldAgeId {
  NEW,
  STANDARD,
  OLD
}

export enum TemperatureId {
  HOT,
  STANDARD,
  COLD
}

export enum RainfallId {
  HOT,
  STANDARD,
  COLD
}

export interface MapGeneratorSettings {
  width: number;   // 1-indexed
  height: number;  // 1-indexed
  landmass: LandmassValueId;
  continents: number;
  islands: number;
  worldAge: WorldAgeId;
  temperature: TemperatureId;
  rainfall: RainfallId;
}
