import {Injectable} from '@angular/core';

import {Coords} from '../../models/utils/coords';

import {CAMERA_MAX_EMPTY_WINDOW_SPACE_PC, CAMERA_MAX_ZOOM_LEVEL, CAMERA_MIN_ZOOM_LEVEL} from '../../consts/camera/camera.const';

import {Tile} from '../../models/game-map/game-map';

@Injectable({providedIn: 'root'})
export class CameraHelperService {

  constructor(
    private window: Window
  ) {}

  // Box model width of the .game-map-tile element
  // Vertical size is between vertexes, horizontally its from edge to edge, hence smaller.
  public tileSizeToGameMapTileElemWidth(tileSize: number): number {
    return Math.floor(tileSize * 0.9);
  }

  // Box model height of the .game-map-row element
  // .game-map-tile has a negative margin in CSS of calc(25% + 1) hence it takes calc(75% - 1px) horizontal space
  public tileSizeToGameMapRowElemHeight(tileSize: number): number {
    return Math.floor(tileSize * 0.75) - 1;
  }

  // CSS coordinates of the center of the tile on the game map
  public centerOfTheTileCoords(tile: Tile): Coords {
    // const tileSize = this.getTileSizeCssVariable();                   // root variable for size calculations, eg. 100px
    // const tileWidth = this.tileSizeToGameMapTileElemWidth(tileSize);  // box model width, eg. 90px
    // const rowHeight = this.tileSizeToGameMapRowElemHeight(tileSize);  // box model height, eg. 74px

    // const xCssFix = ((tile.coords.y % 2 === 1) ? Math.floor(tileWidth / 2) : 0);  // Move odd (0-based) rows to right
    // const yCssFix = ((tileSize - rowHeight) / 2);  // Adjust for a CSS box model that had negative margin
    //
    // return {
    //   x: (tile.coords.x + 0.5) * tileWidth + xCssFix,
    //   y: (tile.coords.y + 0.5) * rowHeight + yCssFix
    // }
    return {x: 0, y: 0}
  }

  public mapCoordsAtScreenCenter(currentTranslate: Coords): Coords {
    return {
      x: Math.floor((this.window.innerWidth / 2) - currentTranslate.x),
      y: Math.floor((this.window.innerHeight / 2) - currentTranslate.y)
    }
  }

  // Keep zoomLevel in between min and max
  public normalizeZoomLevel(zoomLevel: number): number {
    if (zoomLevel > CAMERA_MAX_ZOOM_LEVEL) { zoomLevel = CAMERA_MAX_ZOOM_LEVEL }
    if (zoomLevel < CAMERA_MIN_ZOOM_LEVEL) { zoomLevel = CAMERA_MIN_ZOOM_LEVEL }
    return zoomLevel;
  }

  // Makes the ui always show at max CAMERA_MAX_EMPTY_WINDOW_SPACE_PC percent of background while panning vertically
  public normalizeVerticalTranslation(translate: Coords, canvasHeight: number, gameMapHeight: number): Coords {
    // center the map vertically if its zoomed out very much
    if (canvasHeight > gameMapHeight) {
      translate.y = Math.floor((canvasHeight - gameMapHeight) / 2);
      return translate;
    }

    // move map up if there is too much space above the map
    const maxEmptySpace = Math.floor(canvasHeight * CAMERA_MAX_EMPTY_WINDOW_SPACE_PC / 100);
    if (translate.y > maxEmptySpace) { translate.y = maxEmptySpace; }

    // move map down if there is too much space under the map
    const minTranslate = -(gameMapHeight - canvasHeight + maxEmptySpace);
    if (minTranslate > translate.y) { translate.y = minTranslate; }

    return translate;
  }

}
