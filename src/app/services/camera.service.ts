import {Injectable} from '@angular/core';

import {Coords} from '../models/utils';
import {Size} from '../models/size';

import {CAMERA_MAX_EMPTY_WINDOW_SPACE_PC, CAMERA_MAX_ZOOM_LEVEL, CAMERA_MIN_ZOOM_LEVEL} from '../consts/camera.const';

import {SizeStore} from '../stores/size.store';

@Injectable({providedIn: 'root'})
export class CameraService {

  size: Size;

  constructor(
    private sizeStore: SizeStore,
  ) {
    this.subscribeToData();
  }

  private subscribeToData(): void {
    this.sizeStore.size.subscribe(size => this.size = size);
  }

  // Keep zoomLevel in between min and max
  public normalizeZoomLevel(zoomLevel: number): number {
    if (zoomLevel > CAMERA_MAX_ZOOM_LEVEL) { zoomLevel = CAMERA_MAX_ZOOM_LEVEL; }
    if (zoomLevel < CAMERA_MIN_ZOOM_LEVEL) { zoomLevel = CAMERA_MIN_ZOOM_LEVEL; }
    return zoomLevel;
  }

  // Vertically: limits empty space on top and bottom of the map
  // Horizontally: Keep translate within range of (-mapWidth + tileWidth/2) ... 0
  public normalizeTranslation(translate: Coords): Coords {
    // normalize X
    translate.x = (translate.x - this.size.row.width) % this.size.row.width;

    // center the map vertically if its zoomed out very much
    if (this.size.screen.height > this.size.map.height) {
      translate.y = Math.floor((this.size.screen.height - this.size.map.height) / 2);
      return translate;
    } else {
      // move map up if there is too much space above the map
      const maxEmptySpace = Math.floor(this.size.screen.height * CAMERA_MAX_EMPTY_WINDOW_SPACE_PC / 100);
      if (translate.y > maxEmptySpace) { translate.y = maxEmptySpace; }

      // move map down if there is too much space under the map
      const minTranslate = -(this.size.map.height - this.size.screen.height + maxEmptySpace);
      if (minTranslate > translate.y) { translate.y = minTranslate; }

      return translate;
    }
  }

}
