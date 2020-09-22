import {Injectable} from '@angular/core';

import {Coords} from '../models/utils';

import {CAMERA_MAX_EMPTY_WINDOW_SPACE_PC, CAMERA_MAX_ZOOM_LEVEL, CAMERA_MIN_ZOOM_LEVEL} from '../consts/camera.const';

import {StrategicMapInHtmlCameraService} from './strategic-map-in-html-camera.service';

@Injectable({providedIn: 'root'})
export class CameraService {

  public htmlSpecific: StrategicMapInHtmlCameraService;

  constructor(
    private strategicMapInHtmlCameraService: StrategicMapInHtmlCameraService
  ) {
    this.htmlSpecific = this.strategicMapInHtmlCameraService;
  }

  // Keep zoomLevel in between min and max
  public normalizeZoomLevel(zoomLevel: number): number {
    if (zoomLevel > CAMERA_MAX_ZOOM_LEVEL) { zoomLevel = CAMERA_MAX_ZOOM_LEVEL }
    if (zoomLevel < CAMERA_MIN_ZOOM_LEVEL) { zoomLevel = CAMERA_MIN_ZOOM_LEVEL }
    return zoomLevel;
  }

  // Makes the ui always show at max CAMERA_MAX_EMPTY_WINDOW_SPACE_PC percent of background while panning vertically
  public normalizeVerticalTranslation(translate: Coords, mapHeight: number, viewportHeight: number): Coords {
    // center the map vertically if its zoomed out very much
    if (viewportHeight > mapHeight) {
      translate.y = Math.floor((viewportHeight - mapHeight) / 2);
      return translate;
    }

    // move map up if there is too much space above the map
    const maxEmptySpace = Math.floor(viewportHeight * CAMERA_MAX_EMPTY_WINDOW_SPACE_PC / 100);
    if (translate.y > maxEmptySpace) { translate.y = maxEmptySpace; }

    // move map down if there is too much space under the map
    const minTranslate = -(mapHeight - viewportHeight + maxEmptySpace);
    if (minTranslate > translate.y) { translate.y = minTranslate; }

    return translate;
  }

  // Keep translate within range of (-mapWidth + tileWidth/2) ... 0
  public normalizeHorizontalTranslation(translate: Coords, mapWidth: number, tileWidth: number): Coords {
    const mapWidthWithoutIndent = mapWidth - tileWidth / 2;
    return {
      x: (translate.x - mapWidthWithoutIndent) % mapWidthWithoutIndent,
      y: translate.y
    }
  }

}
