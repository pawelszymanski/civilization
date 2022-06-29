export enum MapSizeId {
  DUEL,
  TINY,
  SMALL,
  STANDARD,
  LARGE,
  HUGE
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
}
