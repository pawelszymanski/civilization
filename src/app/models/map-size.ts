export enum MapSizeId {
  DUEL,
  TINY,
  SMALL,
  STANDARD,
  LARGE,
  HUGE,
  GIANT,
  MAX,
}

export interface MapSizeSettings {
  id: MapSizeId;
  name: string;
  width: number;
  height: number;
  players: number;
  playersMax: number;
  cityStates: number;
  cityStatesMax: number;
  religionsMax: number;
  naturalWonders: number;
  continents: number;
  islands: number;
  archipelagos: number;
}
