import {Coords} from './utils';
import {Terrain} from './terrain';
import {Yield} from './yield';

export interface Tile {
  coords: Coords;        // Provided, 0-indexed
  terrain: Terrain;      // Provided
  yield: Yield;          // Recalculated on change
}

export interface Map {
  tiles: Tile[];
  width: number;   // 1-indexed
  height: number;  // 1-indexed
}
