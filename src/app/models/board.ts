import {Coords} from './coords';
import {Terrain} from './terrain';
import {Yield} from './yield';

export interface BoardTile {
  coords: Coords;
  terrain: Terrain;
  cssClass?: string;
  yield?: Yield;
}

export interface BoardRow {
  tiles: BoardTile[];
}

export interface Board {
  rows: BoardRow[];
}

export interface PredefinedBoard {
  name: string;
  board: Board;
}
