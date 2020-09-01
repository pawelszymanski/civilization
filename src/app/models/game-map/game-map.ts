import {Coords} from '../utils/coords';
import {Terrain} from './terrain';
import {Yield} from './yield';

export interface GameMapTile {
  coords: Coords;        // Provided
  terrain: Terrain;      // Provided
  cssClasses: string[];  // Recalculated on change
  yield: Yield;          // Recalculated on change
}

export interface GameMapRow {
  tiles: GameMapTile[];
}

export interface GameMap {
  rows: GameMapRow[];
}
