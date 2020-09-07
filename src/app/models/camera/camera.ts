import {Coords} from '../../models/utils/coords';

export interface Camera {
  zoomLevel: number;       // Primary variable, affected by mouse wheel
  tileSize: number;        // Secondary variable, calculated based on the zoomLevel
  translate: Coords;       // Secondary variable, calculated based on the zoomLevel
}
