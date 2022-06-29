import {Coords} from './utils';

export interface FullSize {
  width: number;
  height: number;
}

export interface HalfSize {
  halfWidth: number;
  halfHeight: number;
}

export interface QuarterSize {
  oneQuarterWidth: number;
  oneQuarterHeight: number;
  threeQuarterWidth: number;
  threeQuarterHeight: number;
}

export interface Size {
  tile: FullSize & HalfSize & QuarterSize;  // Tile height is equal to tile size CSS variable, rest is calculated from height
  row: FullSize;                            // Calculated
  map: FullSize;                            // Calculated
  vertices: Coords[];                       // Calculated
  screen: FullSize & HalfSize;              // Calculated
}
