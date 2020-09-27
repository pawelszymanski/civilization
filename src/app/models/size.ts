import {Coords} from './utils';

export interface FullSize {
  width: number;
  height: number;
}

export interface HalfSize {
  halfWidth: number;
  halfHeight: number;
}

export interface Size {
  tile: FullSize & HalfSize;      // Tile height is equal to tile size CSS variable, rest is calculated from height
  row: FullSize;                  // Calculated
  map: FullSize;                  // Calculated
  viewport: FullSize & HalfSize;  // Calculated
  vertices: Coords[];             // Calculated
}
