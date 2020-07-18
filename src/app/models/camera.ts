import {Coords} from './coords';

export interface Camera {
  zoomLevel: number;
  tileSize: number;
  perspective: number;
  rotateX: number;
  scale: number;
  offset: Coords;
}
