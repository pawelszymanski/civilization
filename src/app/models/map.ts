import {Coords} from './utils';
import {Terrain} from './terrain';
import {Yield} from './yield';

export interface Tile {
  grid: Coords;            // Provided, 0-indexed location on the map
  terrain: Terrain;        // Provided
  yield: Yield;            // Calculated
}

export interface Map {
  tiles: Tile[];
  width: number;   // 1-indexed
  height: number;  // 1-indexed
}
