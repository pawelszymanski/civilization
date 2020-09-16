import {Component, ElementRef, HostListener, ViewChild, ViewEncapsulation} from '@angular/core';
import {Subscription} from 'rxjs';

import {Camera} from '../../../../../models/camera/camera';
import {Coords} from '../../../../../models/utils/coords';
import {GameMap, GameMapTile} from '../../../../../models/game-map/game-map';
import {TerrainBaseId} from '../../../../../models/game-map/terrain';

import {CameraStore} from '../../../../../stores/camera.store';
import {GameMapStore} from '../../../../../stores/game-map.store';

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

  counter = 0;

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
    console.info(this.counter);
    this.counter = 0;

    this.ctx.clearRect(0, 0, this.CANVAS.width, this.CANVAS.height);

    this.ctx.fillStyle = 'gray';
    this.ctx.fillRect(0, 0, this.CANVAS.width, this.CANVAS.height);

    this.ctx.lineWidth = 0.5;

    for (let column = 0; column < this.gameMap.columns.length; column++) {
      for (let row = 0; row < this.gameMap.columns[column].tiles.length; row++) {
        const tile: GameMapTile = this.gameMap.columns[column].tiles[row];
        if (this.isTileInViewport(tile)) {
          this.drawTile(tile);
          this.counter++;
        }
      }
    }
  }

  tileWidth(): number {
    return this.camera.tileSize * 0.9;
  }

  tileHeight(): number {
    return this.camera.tileSize;
  }

  isOddRow(tile: GameMapTile): boolean {
    return tile.coords.y % 2 === 1;
  }

  isTileInViewport(tile: GameMapTile): boolean {
    const tileSize = { x: this.tileWidth(), y: this.tileHeight() }
    const tilePosition = this.tilePosition(tile);
    const viewportSize = { x: this.CANVAS.width, y: this.CANVAS.height }
    const cameraTranslate = this.camera.translate;

    return (cameraTranslate.x + tilePosition.x + tileSize.x >= 0) &&
           (cameraTranslate.x + tilePosition.x <= viewportSize.x) &&
           (cameraTranslate.y + tilePosition.y + tileSize.y >= 0) &&
           (cameraTranslate.y + tilePosition.y <= viewportSize.y);
  }

  tilePosition(tile: GameMapTile): Coords {
    return {
      x: ((tile.coords.x * this.tileWidth()) + (this.isOddRow(tile) ? this.tileWidth() / 2 : 0)),
      y: (tile.coords.y * this.tileHeight() * 0.75)
    };
  }

  createTilePath(tile: GameMapTile) {
    const tileWidth = this.tileWidth();
    const tileHeight = this.tileHeight();
    const tilePosition = this.tilePosition(tile);
    const cameraTranslate = this.camera.translate;

    this.ctx.beginPath();
    this.ctx.moveTo(cameraTranslate.x + tilePosition.x + tileWidth * 0.50, cameraTranslate.y + tilePosition.y);
    this.ctx.lineTo(cameraTranslate.x + tilePosition.x + tileWidth, cameraTranslate.y + tilePosition.y + tileHeight * 0.25);
    this.ctx.lineTo(cameraTranslate.x + tilePosition.x + tileWidth, cameraTranslate.y + tilePosition.y + tileHeight * 0.75);
    this.ctx.lineTo(cameraTranslate.x + tilePosition.x + tileWidth * 0.50, cameraTranslate.y + tilePosition.y + tileHeight);
    this.ctx.lineTo(cameraTranslate.x + tilePosition.x, cameraTranslate.y + tilePosition.y + tileHeight * 0.75);
    this.ctx.lineTo(cameraTranslate.x + tilePosition.x, cameraTranslate.y + tilePosition.y + tileHeight * 0.25);
    this.ctx.closePath();
  }

  tileFillStyle(tile: GameMapTile): CanvasPattern {
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
    this.ctx.fillStyle = this.tileFillStyle(tile);
    this.ctx.fill();
  }

}
