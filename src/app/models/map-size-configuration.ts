export enum MapSizeConfigurationId {
  DUEL,
  TINY,
  SMALL,
  STANDARD,
  LARGE,
  HUGE
}

export interface MapSizeConfiguration {
  id: MapSizeConfigurationId;
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
}
