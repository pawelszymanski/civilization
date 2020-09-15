import {Component, ElementRef, HostListener, ViewChild, ViewEncapsulation} from '@angular/core';
import {Subscription} from 'rxjs';

import {Camera} from '../../../../../models/camera/camera';
import {GameMap, GameMapTile} from '../../../../../models/game-map/game-map';

import {CameraStore} from '../../../../../stores/camera.store';
import {GameMapStore} from '../../../../../stores/game-map.store';
import {Coords} from '../../../../../models/utils/coords';
import {TerrainBaseId} from '../../../../../models/game-map/terrain';

@Component({
  selector: '.strategic-view-canvas-component',
  templateUrl: './strategic-view-canvas.component.html',
  styleUrls: ['strategic-view-canvas.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StrategicViewCanvasComponent {

  readonly CANVAS = {
    width: 600,
    height: 400
  };

  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;

  ctx: CanvasRenderingContext2D;

  gameMap: GameMap;
  camera: Camera;

  shallRedraw = false;

  animationFrameId: number;

  subscriptions: Subscription[] = [];

  constructor(
    private gameMapStore: GameMapStore,
    private cameraStore: CameraStore
  ) {}

  ngOnInit() {
    this.initContext();
    this.setCanvasSize();
    this.subscribeToData();
    this.requestAnimationFrame();
  }

  ngOnDestroy() {
    this.unsubscribeFromData();
    this.cancelAnimationFrame();
  }

  initContext() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
  }

  setCanvasSize() {
    this.CANVAS.width = window.innerWidth;
    this.CANVAS.height = window.innerHeight;
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.setCanvasSize();
    this.shallRedraw = true;
  }

  subscribeToData() {
    this.subscriptions.push(
      this.cameraStore.camera.subscribe(camera => { this.camera = camera; this.shallRedraw = true; }),
      this.gameMapStore.gameMap.subscribe(gameMap => { this.gameMap = gameMap; this.shallRedraw = true; })
    );
  }

  requestAnimationFrame() {
    this.animationFrameId = window.requestAnimationFrame(() => {
      this.requestAnimationFrame();
      if (this.gameMap && this.shallRedraw) {     // TODO remove game map check at some point
        this.drawMap();
        this.shallRedraw = false;
      }
    });
  }

  unsubscribeFromData() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  cancelAnimationFrame() {
    window.cancelAnimationFrame(this.animationFrameId);
  }

  drawMap() {
    this.ctx.clearRect(0, 0, this.CANVAS.width, this.CANVAS.height);

    this.ctx.fillStyle = 'gray';
    this.ctx.fillRect(0, 0, this.CANVAS.width, this.CANVAS.height);

    this.ctx.lineWidth = 0.5;

    for (let column = 0; column < this.gameMap.columns.length; column++) {
      for (let row = 0; row < this.gameMap.columns[column].tiles.length; row++) {
        const tile: GameMapTile = this.gameMap.columns[column].tiles[row];
        this.drawTile(tile);
      }
    }
  }

  getTileOffset(tile: GameMapTile, tileWidth: number, tileHeight: number): Coords {
    const isOddRow = tile.coords.y % 2 === 1;
    return {
      x: ((tile.coords.x * tileWidth) + (isOddRow ? tileWidth / 2 : 0)),
      y: (tile.coords.y * tileHeight * 0.75)
    };
  }

  createTilePath(tile: GameMapTile) {
    const tileWidth = this.camera.tileSize * 0.9;
    const tileHeight = this.camera.tileSize;

    const offset = this.getTileOffset(tile, tileWidth, tileHeight);

    this.ctx.beginPath();
    this.ctx.moveTo(offset.x + tileWidth * 0.50, offset.y);
    this.ctx.lineTo(offset.x + tileWidth, offset.y + tileHeight * 0.25);
    this.ctx.lineTo(offset.x + tileWidth, offset.y + tileHeight * 0.75);
    this.ctx.lineTo(offset.x + tileWidth * 0.50, offset.y + tileHeight);
    this.ctx.lineTo(offset.x, offset.y + tileHeight * 0.75);
    this.ctx.lineTo(offset.x, offset.y + tileHeight * 0.25);
    this.ctx.closePath();
  }

  getTileFillStyle(tile: GameMapTile): CanvasPattern {
    let imgElemId;
    switch (tile.terrain.base.id) {
      case TerrainBaseId.GRASSLAND_FLAT:
      case TerrainBaseId.GRASSLAND_HILLS:
      case TerrainBaseId.GRASSLAND_MOUNTAIN:
        imgElemId = 'terrain-texture-grassland';
        break;
      case TerrainBaseId.PLAINS_FLAT:
      case TerrainBaseId.PLAINS_HILLS:
      case TerrainBaseId.PLAINS_MOUNTAIN:
        imgElemId = 'terrain-texture-plains';
        break;
      case TerrainBaseId.DESERT_FLAT:
      case TerrainBaseId.DESERT_HILLS:
      case TerrainBaseId.DESERT_MOUNTAIN:
        imgElemId = 'terrain-texture-desert';
        break;
      case TerrainBaseId.TUNDRA_FLAT:
      case TerrainBaseId.TUNDRA_HILLS:
      case TerrainBaseId.TUNDRA_MOUNTAIN:
        imgElemId = 'terrain-texture-tundra';
        break;
      case TerrainBaseId.SNOW_FLAT:
      case TerrainBaseId.SNOW_HILLS:
      case TerrainBaseId.SNOW_MOUNTAIN:
        imgElemId = 'terrain-texture-snow';
        break;
      case TerrainBaseId.LAKE:
      case TerrainBaseId.COAST:
        imgElemId = 'terrain-texture-coast';
        break;
      case TerrainBaseId.OCEAN:
        imgElemId = 'terrain-texture-ocean';
        break;
    }
    const imgElem = document.getElementById(imgElemId) as HTMLImageElement;
    return this.ctx.createPattern(imgElem, 'repeat');
  }

  drawTile(tile: GameMapTile): void {
    this.createTilePath(tile);
    this.ctx.stroke();
    this.ctx.fillStyle = this.getTileFillStyle(tile);
    this.ctx.fill();
  }

}
