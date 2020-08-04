import {Coords3d} from '../../models/utils/coords';

export interface Camera {
  // Primary variable, affected by mouse wheel
  zoomLevel: number;

  // Secondary, calculated based on the zoomLevel
  tileSize: number;
  translate: Coords3d;
  perspective: number;
  rotate: Coords3d;
}
