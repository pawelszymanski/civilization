import {Injectable} from '@angular/core';

import {Map, Tile} from '../models/map';
import {Camera} from '../models/camera';
import {Coords} from '../models/utils';
import {Size} from '../models/size';

import {CameraStore} from '../stores/camera.store';
import {SizeStore} from '../stores/size.store';
import {MapStore} from '../stores/map.store';

@Injectable({providedIn: 'root'})
export class TileUiService {

  camera: Camera;
  size: Size
  map: Map;

  constructor(
    private cameraStore: CameraStore,
    private sizeStore: SizeStore,
    private mapStore: MapStore,
  ) {
    this.subscribeToData();
  }

  private subscribeToData(): void {
    this.cameraStore.camera.subscribe(camera => this.camera = camera);
    this.sizeStore.size.subscribe(size => this.size = size);
    this.mapStore.map.subscribe(map => this.map = map);
  }

  private isTileOfViewportCoordsInViewport(coordsOnCanvasPx: Coords): boolean {
    return (coordsOnCanvasPx.x + this.size.tile.width >= 0)  && (coordsOnCanvasPx.x <= this.size.viewport.width) &&
           (coordsOnCanvasPx.y + this.size.tile.height >= 0) && (coordsOnCanvasPx.y <= this.size.viewport.height);
  }

  // Coords in pixels if there would be no translation of the map
  private coordsOnMapPx(tile: Tile): Coords {
    // Indentation for tiles in odd rows
    const indentation = (tile.grid.y % 2 === 1) ? this.size.tile.halfWidth : 0;

    // This fills empty space caused by indentation filled by tiles from last column
    const firstColumnFix = (tile.grid.x === this.map.width - 1) ? -this.size.row.width : 0;

    return {
      x: (tile.grid.x * this.size.tile.width) + indentation + firstColumnFix,
      y: (tile.grid.y * this.size.row.height)  // tile.grid.y is 0-based, no need for +/- 1
    };
  }

  // Coords on map plus translation
  private coordsOnViewportPx(tile: Tile): Coords {
    const tileCoordsOnMap = this.coordsOnMapPx(tile);
    return {
      x: tileCoordsOnMap.x + this.camera.translate.x,
      y: tileCoordsOnMap.y + this.camera.translate.y
    };
  }

  public tileCoordsOnViewportPx(tile: Tile): Coords | null {
    let coordsOnViewportPx: Coords = null;

    // Try if (x, y) coords are in the viewport...
    const primaryViewportCoordsCandidate = this.coordsOnViewportPx(tile);
    if (this.isTileOfViewportCoordsInViewport(primaryViewportCoordsCandidate)) {
      coordsOnViewportPx = primaryViewportCoordsCandidate;
    }

    // ...if not on map then also try (x - mapWidth, y)
    if (!coordsOnViewportPx) {
      const alternativeViewportCoordsCandidate = Object.assign({}, primaryViewportCoordsCandidate);
      alternativeViewportCoordsCandidate.x = alternativeViewportCoordsCandidate.x + this.size.row.width;
      if (this.isTileOfViewportCoordsInViewport(alternativeViewportCoordsCandidate)) {
        coordsOnViewportPx = alternativeViewportCoordsCandidate;
      }
    }

    // Then if any was in viewport set it
    return coordsOnViewportPx;
  }

  // Visualization: https://stackoverflow.com/questions/7705228/hexagonal-grids-how-do-you-find-which-hexagon-a-point-is-in
  public mapCoordsToGridCoords(mapCoords: Coords): Coords | null {
    // Candidate Y coordinate
    const y = Math.floor(mapCoords.y / this.size.row.height);
    if ( y < 0 || y > this.map.height ) { return null; }  // clicked above or bellow the map, no need to continue

    // Candidate X coordinate
    let x = Math.floor(mapCoords.x / this.size.tile.width);
    const isOddRow = (y % 2 === 1);
    const clickedTileToLeft = ((mapCoords.x % this.size.tile.width) < this.size.tile.halfWidth);  // Clicked a left side of the tile, since the row is indented means it's the tile to the left that was clicked
    if (isOddRow && clickedTileToLeft) { x -= 1; }
    if (x < 0) { x += this.map.width; }
    if (x === this.map.width) { x -= this.map.width; }

    // Check if in the wide rectangle in the center of the hex
    const grid = { x, y };
    const tileCoords = {
      x: (mapCoords.x + this.size.tile.width + (isOddRow ? +this.size.tile.halfWidth : 0)) % this.size.tile.width,
      y: (mapCoords.y + this.size.row.height) % this.size.row.height  // make sure its row height, otherwise obob
    }

    // Check if in the wide rectangle in the center of the hex
    const isBelowOneQuarter = tileCoords.y >= this.size.tile.oneQuarterHeight;
    const isAboveThreeQuarters = tileCoords.y <= this.size.tile.threeQuarterHeight;
    if (isBelowOneQuarter && isAboveThreeQuarters) { return grid; }

    const isAboveOneQuarter = tileCoords.y < this.size.tile.oneQuarterHeight;
    const isLeft = tileCoords.x <= this.size.tile.halfWidth;

    // Check upper left and right triangles
    if (isAboveOneQuarter) {
      const slope = this.size.tile.oneQuarterHeight / this.size.tile.halfWidth;   // y = ax + b, this is a
      if (isLeft) {
        const isOutside = this.size.tile.oneQuarterHeight - (tileCoords.x * slope) > tileCoords.y;
        if (isOutside) {
          return { x: isOddRow ? grid.x : grid.x - 1, y: grid.y - 1 };
        } else {
          return grid;
        }
      } else {
        const isOutside = (tileCoords.x - this.size.tile.halfWidth) * slope > tileCoords.y;
        if (isOutside) {
          return { x: isOddRow ? grid.x + 1 : grid.x, y: grid.y - 1 };
        } else {
          return grid;
        }
      }
    }

    // Lower left and right triangles are also upper ones for tiles bellow so do not need to be checked
    return null;
  }

}
