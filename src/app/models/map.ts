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
  isVisible?: boolean;          // calculated, is in the viewport?
  px?: Coords;                  // calculated, coords on the viewport
  transformStr?: string;        // calculated, pre-computed transform style string, updated each RAF frame
}

export interface Map {
  tiles: Tile[];
  width: number;   // 1-indexed
  height: number;  // 1-indexed
}
