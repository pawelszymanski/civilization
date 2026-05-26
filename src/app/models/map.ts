import { Coords } from './utils';
import { Terrain } from './terrain';
import { Yield } from './yield';

export enum TileHighlightId {
  WB_TERRAIN_PLACEMENT,
}

export interface Tile {
  grid: Coords; // 0-indexed location on the map
  terrain: Terrain;
  landmass?: number; // 0 = ocean, 1+ = continents, 100+ = islands, 200+ = archipelago clusters, 300/301 = top/bottom ice cap
  yield?: Yield; // calculated
  isVisible?: boolean; // calculated, is in the viewport?
  px?: Coords; // calculated, coords on the viewport
  transformStr?: string; // calculated, pre-computed transform style string, updated each RAF frame
}

export interface Map {
  tiles: Tile[];
  width: number; // 1-indexed
  height: number; // 1-indexed
}
