import {Coords} from './coords';
import {Terrain} from './terrain';
import {Yield} from './yield';

export interface GameMapTile {
  coords: Coords;
  terrain: Terrain;
  yield: Yield;
}

export interface GameMapRow {
  tiles: GameMapTile[];
}

export interface GameMap {
  rows: GameMapRow[];
}
