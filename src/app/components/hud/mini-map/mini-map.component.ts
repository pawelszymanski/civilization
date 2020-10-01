import {Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Subscription} from 'rxjs';

import {Camera} from '../../../models/camera';
import {Map} from '../../../models/map';
import {Size} from '../../../models/size';

import {CameraStore} from '../../../stores/camera.store';
import {SizeStore} from '../../../stores/size.store';
import {MapStore} from '../../../stores/map.store';

@Component({
  selector: '.mini-map-component',
  templateUrl: './mini-map.component.html',
  styleUrls: ['./mini-map.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MiniMapComponent implements OnInit, OnDestroy {

  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;

  ctx: CanvasRenderingContext2D;

  camera: Camera;
  size: Size;
  map: Map;

  animationFrameId: number;

  subscriptions: Subscription[] = [];

  constructor(
    private cameraStore: CameraStore,
    private sizeStore: SizeStore,
    private mapStore: MapStore,
  ) {}

  ngOnInit() {
    this.initContext();
    this.subscribeToData();
    this.requestAnimationFrame();
  }

  ngOnDestroy() {
    this.unsubscribeFromData();
    this.cancelAnimationFrame();
  }

  initContext() {
    this.ctx = this.canvas.nativeElement.getContext('2d')
    this.ctx.strokeStyle = 'white';
    this.ctx.lineWidth = 1;
  }

  subscribeToData() {
    this.subscriptions.push(
      this.cameraStore.camera.subscribe(camera => this.camera = camera),
      this.sizeStore.size.subscribe(size => this.size = size),
      this.mapStore.map.subscribe(map => this.map = map),
    );
  }

  requestAnimationFrame() {
    this.animationFrameId = window.requestAnimationFrame(() => {
      this.requestAnimationFrame();
      if (this.map) { this.drawMinimap(); }
    });
  }

  unsubscribeFromData() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  cancelAnimationFrame() {
    window.cancelAnimationFrame(this.animationFrameId);
  }

  drawMinimap() {
    this.clearMinimap();
    // this.drawTiles();
    this.drawViewport();
  }

  clearMinimap() {
    this.ctx.fillStyle = 'gray';
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  drawTiles() {

  }

  drawViewport() {
    const topRatio = (-this.camera.translate.y) / this.size.map.height;
    const bottomRatio = (-this.camera.translate.y + this.size.screen.height) / this.size.map.height;
    const leftRatio = (-this.camera.translate.x) / this.size.map.width;
    const rightRatio = ((-this.camera.translate.x + this.size.screen.width) % this.size.map.width / this.size.map.width);

    const top = this.ctx.canvas.height * topRatio;
    const bottom = this.ctx.canvas.height * bottomRatio;
    const left = this.ctx.canvas.width * leftRatio;
    const right = this.ctx.canvas.width * rightRatio;

    this.drawLine(left, top, left, bottom);
    this.drawLine(right, top, right, bottom);

    if (right > left) {
      this.drawLine(left, top, right, top);
      this.drawLine(left, bottom, right, bottom);
    } else {
      this.drawLine(right, top, 0, top);
      this.drawLine(right, bottom, 0, bottom);
      this.drawLine(left, top, this.ctx.canvas.width, top);
      this.drawLine(left, bottom, this.ctx.canvas.width, bottom);
    }
  }

  drawLine(x1: number, y1: number, x2: number, y2: number) {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  }

}

// this.ctx.beginPath();
// this.ctx.moveTo(0, CANVAS.HEIGHT * 0.25 + .5);
// this.ctx.lineTo(CANVAS.WIDTH, CANVAS.HEIGHT * 0.25 + .5);
// this.ctx.moveTo(0, CANVAS.HEIGHT * 0.50 + .5);
// this.ctx.lineTo(CANVAS.WIDTH, CANVAS.HEIGHT * 0.50 + .5);
// this.ctx.moveTo(0, CANVAS.HEIGHT * 0.75 + .5);
// this.ctx.lineTo(CANVAS.WIDTH, CANVAS.HEIGHT * 0.75 + .5);
// this.ctx.stroke();
//
// this.ctx.font = CANVAS.LEGEND_FONT;
// this.ctx.fillStyle = CANVAS.LEGEND_FILL_STYLE;
