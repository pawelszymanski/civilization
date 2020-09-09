import {Component, ElementRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {Subscription} from 'rxjs';

import {Camera} from '../../../../../models/camera/camera';
import {GameMap} from '../../../../../models/game-map/game-map';

import {CameraStore} from '../../../../../stores/camera.store';
import {GameMapStore} from '../../../../../stores/game-map.store';
import {Coords} from '../../../../../models/utils/coords';

@Component({
  selector: '.isometric-view-component',
  templateUrl: './isometric-view.component.html',
  styleUrls: ['isometric-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IsometricViewComponent {

  readonly CANVAS = {
    width: 600,
    height: 400
  }

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
    this.ctx = this.canvas.nativeElement.getContext('2d')
  }

  setCanvasSize() {
    this.CANVAS.width = window.innerWidth;
    this.CANVAS.height = window.innerHeight;
    this.shallRedraw = true;
  }

  subscribeToData() {
    this.subscriptions.push(
      this.cameraStore.camera.subscribe(camera => {this.camera = camera; this.shallRedraw = true;}),
      this.gameMapStore.gameMap.subscribe(gameMap => {this.gameMap = gameMap; this.shallRedraw = true;})
    );
  }

  requestAnimationFrame() {
    this.animationFrameId = window.requestAnimationFrame(() => {
      this.requestAnimationFrame();
      if (this.shallRedraw) {
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
    const offset = {x: 100, y: 100};
    const tileWidth = this.camera.tileSize * 0.9;
    const tileHeight = this.camera.tileSize;

    this.ctx.fillStyle = 'gray';
    this.ctx.fillRect(0, 0, this.CANVAS.width, this.CANVAS.height);

    this.ctx.fillStyle = 'red';
    this.drawHex(offset, tileWidth, tileHeight);
  }

  drawHex(offset: Coords, tileWidth: number, tileHeight: number) {
    this.ctx.beginPath();
    this.ctx.moveTo(offset.x + tileWidth * 0.50, offset.y);
    this.ctx.lineTo(offset.x + tileWidth, offset.y + tileHeight * 0.25);
    this.ctx.lineTo(offset.x + tileWidth, offset.y + tileHeight * 0.75);
    this.ctx.lineTo(offset.x + tileWidth * 0.50, offset.y + tileHeight);
    this.ctx.lineTo(offset.x, offset.y + tileHeight * 0.75);
    this.ctx.lineTo(offset.x, offset.y + tileHeight * 0.25);
    this.ctx.closePath();
    this.ctx.fill();
    // clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  }


}

// Camera {
//   zoomLevel: number;       // Primary variable, affected by mouse wheel
//   tileSize: number;        // Secondary variable, calculated based on the zoomLevel
//   translate: Coords;       // Secondary variable, calculated based on the zoomLevel
// }
