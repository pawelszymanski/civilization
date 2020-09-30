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

  // Checks if tile needs to be drawn, counts in tiles partially visible too
  public isTileOfScreenCoordsOnScreen(coordsOnCanvasPx: Coords): boolean {
    return (coordsOnCanvasPx.x + this.size.tile.width >= 0)  && (coordsOnCanvasPx.x <= this.size.screen.width) &&
           (coordsOnCanvasPx.y + this.size.tile.height >= 0) && (coordsOnCanvasPx.y <= this.size.screen.height);
  }

  // Coords on the screen in pixels
  private coordsOnScreenPx(tile: Tile): Coords {
    // Indentation for tiles in odd rows
    const indentation = (tile.grid.y % 2 === 1) ? this.size.tile.halfWidth : 0;

    // This fills empty space caused by indentation filled by tiles from last column
    const firstColumnFix = (tile.grid.x === this.map.width - 1) ? -this.size.row.width : 0;

    return {
      x: (tile.grid.x * this.size.tile.width) + this.camera.translate.x + indentation + firstColumnFix,
      y: (tile.grid.y * this.size.row.height) + this.camera.translate.y
    };
  }

  // Coords on map plus translation
  public tileCoordsOnScreenPx(tile: Tile): Coords | null {
    let coordsOnScreenPx: Coords = null;

    // Try if (x, y) coords are in the viewport...
    const primaryScreenCoordsCandidate = this.coordsOnScreenPx(tile);
    if (this.isTileOfScreenCoordsOnScreen(primaryScreenCoordsCandidate)) {
      coordsOnScreenPx = primaryScreenCoordsCandidate;
    }

    // ...if not on map then also try (x - mapWidth, y)
    if (!coordsOnScreenPx) {
      const alternativeScreenCoordsCandidate = Object.assign({}, primaryScreenCoordsCandidate);
      alternativeScreenCoordsCandidate.x = alternativeScreenCoordsCandidate.x + this.size.row.width;
      if (this.isTileOfScreenCoordsOnScreen(alternativeScreenCoordsCandidate)) {
        coordsOnScreenPx = alternativeScreenCoordsCandidate;
      }
    }

    // Then if any was in viewport set it
    return coordsOnScreenPx;
  }

  private verifyGridCoordsOutOfBounds(gridCoords: Coords): Coords | null {
    return (gridCoords.y >= 0 && gridCoords.y < this.map.height) ? gridCoords : null;
  }

  // Visualization: https://stackoverflow.com/questions/7705228/hexagonal-grids-how-do-you-find-which-hexagon-a-point-is-in
  private mapCoordsToGridCoords(mapCoords: Coords): Coords | null {
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
    if (isBelowOneQuarter && isAboveThreeQuarters) { return this.verifyGridCoordsOutOfBounds(grid); }

    const isAboveOneQuarter = tileCoords.y < this.size.tile.oneQuarterHeight;
    const isLeft = tileCoords.x <= this.size.tile.halfWidth;

    // Check upper left and right triangles
    if (isAboveOneQuarter) {
      const slope = this.size.tile.oneQuarterHeight / this.size.tile.halfWidth;   // y = ax + b, this is a
      if (isLeft) {
        const isOutside = this.size.tile.oneQuarterHeight - (tileCoords.x * slope) > tileCoords.y;
        const candidate = isOutside ? { x: isOddRow ? grid.x : grid.x - 1, y: grid.y - 1 } : grid;
        return this.verifyGridCoordsOutOfBounds(candidate);
      } else {
        const isOutside = (tileCoords.x - this.size.tile.halfWidth) * slope > tileCoords.y;
        const candidate = isOutside ? { x: isOddRow ? grid.x + 1 : grid.x, y: grid.y - 1 } : grid;
        return this.verifyGridCoordsOutOfBounds(candidate);
      }
    }

    // Lower left and right triangles are also upper ones for tiles bellow so do not need to be checked
    return null;
  }

  private eventToMapCoordsPx(event: MouseEvent): Coords {
    let x = event.clientX - this.camera.translate.x;
    if (x >= this.size.row.width) { x -= this.size.row.width; }
    let y = event.clientY - this.camera.translate.y;
    return { x, y };
  }

  // Returns Tile for a given mouse event. MIGHT BE NULL since this.mapCoordsToGridCoords might be null
  public mouseEventToTile(event: MouseEvent): Tile | null {
    const eventOnMapCoordsPx = this.eventToMapCoordsPx(event);
    const gridCoords = this.mapCoordsToGridCoords(eventOnMapCoordsPx);
    return gridCoords ? this.map.tiles[gridCoords.x * this.map.height + gridCoords.y] : null;
  }

  // Returns all tiles in the distance equal or lower to radius from the center tile (a bigger hexagon), normalized for existence
  public tilesInRadius(centerTile: Tile, radius: number = 0): Tile[] {
    if (radius === 0) { return [centerTile]; }

    let candidateCoords = [];
    const isCenterOddRow = centerTile.grid.y % 2 === 1;
    for (let y = -radius; y <= radius; y++) {
      const yDelta = Math.abs(y);
      const fromX = -radius + (isCenterOddRow ? Math.ceil(yDelta/2) : Math.floor(yDelta/2));
      const toX = fromX + 2*radius - yDelta;
      for (let x = fromX; x <= toX; x++) {
        candidateCoords.push( { x: centerTile.grid.x + x, y: centerTile.grid.y + y } );
      }
    }

    return candidateCoords
      .filter(coords => ( (coords.y >= 0) && (coords.y < this.map.height) ))
      .map(coords => this.map.tiles[((coords.x + this.map.width) % this.map.width) * this.map.height + coords.y] )
  }

}
