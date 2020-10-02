import {Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Subscription} from 'rxjs';

import {Camera} from '../../../models/camera';
import {Map} from '../../../models/map';
import {Size} from '../../../models/size';
import {Coords} from '../../../models/utils';

import {CameraStore} from '../../../stores/camera.store';
import {SizeStore} from '../../../stores/size.store';
import {MapStore} from '../../../stores/map.store';
import {TERRAIN_BASE_SET} from '../../../consts/terrain.const';

@Component({
  selector: '.mini-map-component',
  templateUrl: './mini-map.component.html',
  styleUrls: ['./mini-map.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MiniMapComponent implements OnInit, OnDestroy {

  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;

  ctx: CanvasRenderingContext2D;

  vertices: Coords[];

  camera: Camera;
  size: Size;
  map: Map;

  isDragging = false;

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

  // EVENTS

  onClick(event: MouseEvent) {
    const m = this.eventToMapCoords(event);
    this.cameraStore.setTranslate(m);
  }

  onMousedown() {
    this.isDragging = true;
  }

  onMousemove(event: MouseEvent) {
    if (this.isDragging) {
      const m = this.eventToMapCoords(event);
      this.cameraStore.setTranslate(m);
    }
  }

  onMouseup() {
    this.isDragging = false;
  }

  // OTHER

  eventToMapCoords(event: MouseEvent): Coords {
    return {
      x: Math.floor(-event.offsetX * (this.size.row.width/this.ctx.canvas.width)) + this.size.screen.halfWidth,
      y: Math.floor(-event.offsetY * (this.size.map.height/this.ctx.canvas.height)) + this.size.screen.halfHeight
    };
  }

  drawMinimap() {
    this.clearMinimap();
    this.drawTiles();
    this.drawViewport();
  }

  clearMinimap() {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  drawTiles() {
    const scale = { x: this.size.row.width / this.ctx.canvas.width, y: this.size.map.height / this.ctx.canvas.width };
    for (let tile of this.map.tiles) {
      this.ctx.beginPath();
      this.ctx.moveTo((tile.px.x + this.size.vertices[0].x) * scale.x, (tile.px.y + this.size.vertices[0].y) * scale.y);
      this.ctx.lineTo((tile.px.x + this.size.vertices[1].x) * scale.x, (tile.px.y + this.size.vertices[1].y) * scale.y);
      this.ctx.lineTo((tile.px.x + this.size.vertices[2].x) * scale.x, (tile.px.y + this.size.vertices[2].y) * scale.y);
      this.ctx.lineTo((tile.px.x + this.size.vertices[3].x) * scale.x, (tile.px.y + this.size.vertices[3].y) * scale.y);
      this.ctx.lineTo((tile.px.x + this.size.vertices[4].x) * scale.x, (tile.px.y + this.size.vertices[4].y) * scale.y);
      this.ctx.lineTo((tile.px.x + this.size.vertices[5].x) * scale.x, (tile.px.y + this.size.vertices[5].y) * scale.y);
      this.ctx.closePath();
      this.ctx.fillStyle = TERRAIN_BASE_SET[tile.terrain.base.id].ui.color;
      this.ctx.fill();
    }
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
