import {Coords} from '../utils/coords';
import {Terrain} from './terrain';
import {Yield} from './yield';

export interface GameMapTile {
  coords: Coords;
  terrain: Terrain;
  cssClasses: string[];
  yield: Yield;
}

export interface GameMapRow {
  tiles: GameMapTile[];
}

export interface GameMap {
  rows: GameMapRow[];
}
