import {Injectable} from '@angular/core';

import {Coords} from '../models/utils';

import {CAMERA_MAX_EMPTY_WINDOW_SPACE_PC, CAMERA_MAX_ZOOM_LEVEL, CAMERA_MIN_ZOOM_LEVEL} from '../consts/camera.const';

@Injectable({providedIn: 'root'})
export class CameraService {

  // Keep zoomLevel in between min and max
  public normalizeZoomLevel(zoomLevel: number): number {
    if (zoomLevel > CAMERA_MAX_ZOOM_LEVEL) { zoomLevel = CAMERA_MAX_ZOOM_LEVEL }
    if (zoomLevel < CAMERA_MIN_ZOOM_LEVEL) { zoomLevel = CAMERA_MIN_ZOOM_LEVEL }
    return zoomLevel;
  }

  // Makes the ui always show at max CAMERA_MAX_EMPTY_WINDOW_SPACE_PC percent of background while panning vertically
  public normalizeVerticalTranslation(translate: Coords, canvasHeightPx: number, mapHeightPx: number): Coords {
    // center the map vertically if its zoomed out very much
    if (canvasHeightPx > mapHeightPx) {
      translate.y = Math.floor((canvasHeightPx - mapHeightPx) / 2);
      return translate;
    }

    // move map up if there is too much space above the map
    const maxEmptySpace = Math.floor(canvasHeightPx * CAMERA_MAX_EMPTY_WINDOW_SPACE_PC / 100);
    if (translate.y > maxEmptySpace) { translate.y = maxEmptySpace; }

    // move map down if there is too much space under the map
    const minTranslate = -(mapHeightPx - canvasHeightPx + maxEmptySpace);
    if (minTranslate > translate.y) { translate.y = minTranslate; }

    return translate;
  }

}
