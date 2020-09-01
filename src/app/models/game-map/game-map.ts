import {Coords} from '../utils/coords';
import {Terrain} from './terrain';
import {Yield} from './yield';

export interface GameMapTile {
  coords: Coords;        // Provided
  terrain: Terrain;      // Provided
  yield: Yield;          // Recalculated on change
  cssClasses: string[];  // Recalculated on change
}

export interface GameMapRow {
  tiles: GameMapTile[];
}

export interface GameMap {
  rows: GameMapRow[];
}
