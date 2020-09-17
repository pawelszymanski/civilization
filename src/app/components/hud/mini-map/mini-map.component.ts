import {Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Subscription} from 'rxjs';

import {Camera} from '../../../models/camera';
import {Map} from '../../../models/map';

import {CameraStore} from '../../../stores/camera.store';
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

  map: Map;
  camera: Camera;

  shallRedraw = false;

  animationFrameId: number;

  subscriptions: Subscription[] = [];

  constructor(
    private cameraStore: CameraStore,
    private mapStore: MapStore
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
  }

  subscribeToData() {
    this.subscriptions.push(
      this.cameraStore.camera.subscribe(camera => { this.camera = camera; this.shallRedraw = true; }),
      this.mapStore.map.subscribe(map => { this.map = map; this.shallRedraw = true; })
    );
  }

  requestAnimationFrame() {
    this.animationFrameId = window.requestAnimationFrame(() => {
      this.requestAnimationFrame();
      if (this.map && this.shallRedraw) {     // TODO remove game map check at some point
        this.drawMinimap();
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

  drawMinimap() {
    this.clearMinimap();
    // this.drawTiles();
    // this.drawViewport();
  }

  clearMinimap() {
    this.ctx.fillStyle = 'gray';
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  drawTiles() {

  }

  drawViewport() {

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
