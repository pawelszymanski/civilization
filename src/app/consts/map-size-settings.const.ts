import {MapSizeSettings, MapSizeId} from '../models/map-size';

export const MAP_SIZE_SETTINGS_LIST: MapSizeSettings[] = [
  {
    id: MapSizeId.DUEL,
    name: 'Duel',
    width: 44,
    height: 26,
    players: 2,
    playersMax: 4,
    cityStates: 2,
    cityStatesMax: 4,
    religionsMax: 2,
    naturalWonders: 2,
    continents: 1,
    islands: 1
  },
  {
    id: MapSizeId.TINY,
    name: 'Tiny',
    width: 60,
    height: 38,
    players: 3,
    playersMax: 6,
    cityStates: 4,
    cityStatesMax: 8,
    religionsMax: 3,
    naturalWonders: 3,
    continents: 2,
    islands: 2
  },
  {
    id: MapSizeId.SMALL,
    name: 'Small',
    width: 74,
    height: 46,
    players: 9,
    playersMax: 14,
    cityStates: 6,
    cityStatesMax: 10,
    religionsMax: 4,
    naturalWonders: 4,
    continents: 3,
    islands: 3
  },
  {
    id: MapSizeId.STANDARD,
    name: 'Standard',
    width: 84,
    height: 54,
    players: 12,
    playersMax: 18,
    cityStates: 8,
    cityStatesMax: 14,
    religionsMax: 5,
    naturalWonders: 5,
    continents: 4,
    islands: 4
  },
  {
    id: MapSizeId.LARGE,
    name: 'Large',
    width: 96,
    height: 60,
    players: 15,
    playersMax: 22,
    cityStates: 10,
    cityStatesMax: 16,
    religionsMax: 6,
    naturalWonders: 6,
    continents: 5,
    islands: 5
  },
  {
    id: MapSizeId.HUGE,
    name: 'Huge',
    width: 106,
    height: 66,
    players: 18,
    playersMax: 24,
    cityStates: 12,
    cityStatesMax: 20,
    religionsMax: 7,
    naturalWonders: 7,
    continents: 6,
    islands: 6
  }
]
