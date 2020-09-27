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

  private subscribeToData() {
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
  public mapCoordsToGridCoords(eventCoords: Coords): Coords | null {
    const y = Math.floor(eventCoords.y / this.size.row.height);
    if ( (y < 0) || (y > this.map.height) ) { return null; }  // clicked above or bellow the map, no need to continue

    let x = Math.floor(eventCoords.x / this.size.tile.width);
    const isOddRow = (y % 2 === 1);
    const clickedTileToLeft = ((eventCoords.x % this.size.tile.width) < this.size.tile.halfWidth);
    if (isOddRow && clickedTileToLeft) { x -= 1; }
    if (x < 0) { x += this.map.width; }
    if (x === this.map.width) { x -= this.map.width; }

    console.info(eventCoords.x, eventCoords.y, ' ==> ', x, y);
    return;
  }

}

// eventTargetTile(event: MouseEvent) {
//   // const mapCoords: Coords = {x: event.pageX - this.camera.translate.x, y: event.pageY - this.camera.translate.y};
//   // let y = -1; while (mapCoords.y + y > (y+1) * this.size.tile.height * 0.75) {y++}
//   // let x = -1; while (mapCoords.x > (x+1) * this.size.tile.width) {x++}
//   // if ((y % 2 === 1) && ((mapCoords.x % this.size.tile.width) < (this.size.tile.halfWidth))) {x--}
//   // return this.map.tiles.find(t => t.grid.x === x && t.grid.y === y);
//   // const candidateAndNeighbours = this.map.tiles.filter(t => t.coords.x >= x-1 && t.coords.x <= x+1 && t.coords.y >= y-1 && t.coords.y <= y+1);
//   // candidateAndNeighbours.forEach(tile => tile.distance = this.distance(mapCoords, this.tileCenterCoords(tile)));
//   // return candidateAndNeighbours.sort( (a, b) => {return a.distance > b.distance ? -1 : a.distance < b.distance ? 1 : 0}).pop();
// }
