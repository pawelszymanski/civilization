import {Map, Tile} from '../models/map';
import {Coords} from '../models/utils';

import {TERRAIN_BASE_SET} from '../consts/terrain.const';
import {MINIMAP_HEIGHT, MINIMAP_WIDTH, MINIMAP_BACKGROUND_STYLE} from '../consts/minimap.const';

new class MinimapCanvas {

  // True: render perfect rectangle. False: Render map with top and bottom hexes fully displayed.
  readonly CUT_TOP_AND_BOTTOM_HEXES = true;

  // Workers can't access DOM and can't use types from DOM
  canvas: any; // OffscreenCanvas
  ctx: any;    // CanvasRenderingContext2D

  constructor() {
    this.initCanvas();
    this.addEventListener();
  }

  initCanvas(): void {
    this.canvas = new OffscreenCanvas(MINIMAP_WIDTH, MINIMAP_HEIGHT);
    this.ctx = this.canvas.getContext('2d');
  }

  addEventListener(): void {
    addEventListener('message', message => this.onMessage(message));
  }

  onMessage(message: MessageEvent): void {
    const map: Map = message.data;
    this.paintBackground();
    this.paintTiles(map);
    const imageData = this.ctx.getImageData(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    postMessage(imageData);
  }

  isOddRow(tile: Tile): boolean {
    return tile.grid.y % 2 === 1;
  }

  calcTileSize(map: Map): Coords {
    const tileWidth = this.ctx.canvas.width / map.width;

    // * 3: rows overlap, so every tile takes 3/4 of it's height on the map
    // -1: is to not count very top and very bottom triangles (to keep output a rectangle). To include them use +1.
    const heightFourths = (map.height * 3) + (this.CUT_TOP_AND_BOTTOM_HEXES ? -1 : 1);
    const oneFourth = this.ctx.canvas.height / heightFourths;
    const tileHeight = oneFourth * 4;

    return { x: tileWidth, y: tileHeight }
  }

  calcTileCoords(tile: Tile, tileSize: Coords): Coords {
    // Y need to address overlapping of the rows and cutting top and bottom triangles out
    const oddRowFix = this.isOddRow(tile) ? (tileSize.x / 2) : 0;
    const topAndBottomHexesFix = this.CUT_TOP_AND_BOTTOM_HEXES ? (-tileSize.y * 0.25) : 0;
    return {
      x: tile.grid.x * tileSize.x + oddRowFix,
      y: (tile.grid.y * tileSize.y * 0.75) + topAndBottomHexesFix
    }
  }

  paintBackground(): void {
    this.ctx.fillStyle = MINIMAP_BACKGROUND_STYLE;
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  paintTiles(map: Map): void {
    const tileSize = this.calcTileSize(map);

    for (let tile of map.tiles) {
      const coordsPx = this.calcTileCoords(tile, tileSize);
      const color = TERRAIN_BASE_SET[tile.terrain.base.id].ui.color;

      this.paintTile(coordsPx, tileSize, color);

      // Paint odd row tiles in the last column also on the left edge of the map
      if (tile.grid.x === map.width-1 && this.isOddRow(tile)) {
        coordsPx.x -= map.width * tileSize.x;
        this.paintTile(coordsPx, tileSize, color);
      }
    }
  }

  paintTile(coordsPx: Coords, tileSize:Coords, color: string): void {
    this.ctx.beginPath();
    this.ctx.moveTo( coordsPx.x + (tileSize.x * 0.50), coordsPx.y );
    this.ctx.lineTo( coordsPx.x + tileSize.x, coordsPx.y + (tileSize.y * 0.25) );
    this.ctx.lineTo( coordsPx.x + tileSize.x, coordsPx.y + (tileSize.y * 0.75) );
    this.ctx.lineTo( coordsPx.x + (tileSize.x * 0.50), coordsPx.y + tileSize.y );
    this.ctx.lineTo( coordsPx.x, coordsPx.y + (tileSize.y * 0.75) );
    this.ctx.lineTo( coordsPx.x, coordsPx.y + (tileSize.y * 0.25) );
    this.ctx.closePath();
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }

}
