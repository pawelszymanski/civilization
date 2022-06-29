import {Coords} from './utils';
import {Terrain} from './terrain';
import {Yield} from './yield';

export enum TileHighlightId {
  WB_TERRAIN_PLACEMENT,
}

export interface Tile {
  grid: Coords;                 // provided, 0-indexed location on the map
  terrain: Terrain;             // provided
  yield: Yield;                 // calculated
  isVisible?: boolean;          // is in the viewport?
  px?: Coords;                  // coords on the viewport
}

export interface Map {
  tiles: Tile[];
  width: number;   // 1-indexed
  height: number;  // 1-indexed
}
