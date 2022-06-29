import {Component, ElementRef, HostBinding, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Subscription} from 'rxjs';

import {Camera} from '../../../models/camera';
import {Map} from '../../../models/map';
import {Size} from '../../../models/size';
import {Coords} from '../../../models/utils';

import {VIEWPORT_LINE_STYLE, VIEWPORT_LINE_WIDTH, MINIMAP_WIDTH, MINIMAP_HEIGHT} from '../../../consts/minimap.const';

import {CameraStore} from '../../../stores/camera.store';
import {SizeStore} from '../../../stores/size.store';
import {MapStore} from '../../../stores/map.store';

// General flow: Subscribe to map. When map changes send it over to worker to generate new minimap.
// On worker message combine map form worker (and cache it) with the viewport added locally.
@Component({
  selector: '.mini-map-component',
  templateUrl: './mini-map.component.html',
  styleUrls: ['./mini-map.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MiniMapComponent implements OnInit, OnDestroy {

  MINIMAP_WIDTH = MINIMAP_WIDTH;
  MINIMAP_HEIGHT = MINIMAP_HEIGHT;

  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;

  ctx: CanvasRenderingContext2D;

  camera: Camera;
  size: Size;
  map: Map;

  isDragging = false;

  canvasWorker: Worker;
  cachedMinimapImageData: ImageData;

  animationFrameId: number;

  subscriptions: Subscription[] = [];

  // Without this minimap renders not 0, but +4px to the bottom, no clue why
  @HostBinding('style.top') public hostTop: string = 'calc(100% - ' + MINIMAP_HEIGHT + 'px)';

  constructor(
    private cameraStore: CameraStore,
    private sizeStore: SizeStore,
    private mapStore: MapStore,
  ) {}

  ngOnInit(): void {
    this.createCanvasWorker();
    this.initContext();
    this.subscribeToData();
    this.requestAnimationFrame();
  }

  ngOnDestroy(): void {
    this.unsubscribeFromData();
    this.cancelAnimationFrame();
  }

  createCanvasWorker(): void {
    // Needs to be a type: module, https://stackoverflow.com/questions/48045569/whats-the-difference-between-a-classic-and-module-web-worker
    this.canvasWorker = new Worker('./../../../workers/minimap-canvas.worker', {type: 'module'});
    this.canvasWorker.onmessage = (message) => { this.cachedMinimapImageData = message.data; };
  }

  initContext(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
  }

  subscribeToData(): void {
    this.subscriptions.push(
      this.cameraStore.camera.subscribe(camera => this.camera = camera),
      this.sizeStore.size.subscribe(size => this.size = size),
      this.mapStore.map.subscribe(map => {
        this.map = map;
        if (this.map) { this.canvasWorker.postMessage(map); }
      })
    );
  }

  requestAnimationFrame(): void {
    this.animationFrameId = window.requestAnimationFrame(() => {
      this.requestAnimationFrame();
      if (this.cachedMinimapImageData) {
        this.pasteCachedMinimap();
        this.drawViewport();
      }
    });
  }

  unsubscribeFromData(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  cancelAnimationFrame(): void {
    window.cancelAnimationFrame(this.animationFrameId);
  }

  // EVENTS

  onMousedown(event: MouseEvent): void {
    const mapCoords = this.eventToMapCoords(event);
    this.cameraStore.setTranslate(mapCoords);
    this.isDragging = true;
  }

  onMousemove(event: MouseEvent): void {
    if (this.isDragging) {
      const mapCoords = this.eventToMapCoords(event);
      this.cameraStore.setTranslate(mapCoords);
    }
  }

  onMouseup(): void {
    this.isDragging = false;
  }

  // OTHER

  eventToMapCoords(event: MouseEvent): Coords {
    return {
      x: Math.floor(-event.offsetX * (this.size.row.width / this.ctx.canvas.width)) + this.size.screen.halfWidth,
      y: Math.floor(-event.offsetY * (this.size.map.height / this.ctx.canvas.height)) + this.size.screen.halfHeight
    };
  }

  pasteCachedMinimap(): void {
    this.ctx.putImageData(this.cachedMinimapImageData, 0, 0);
  }

  drawViewport(): void {
    const topRatio = (-this.camera.translate.y) / this.size.map.height;
    const bottomRatio = (-this.camera.translate.y + this.size.screen.height) / this.size.map.height;
    const leftRatio = (-this.camera.translate.x) / this.size.map.width;
    const rightRatio = ((-this.camera.translate.x + this.size.screen.width) % this.size.map.width / this.size.map.width);

    const top = this.ctx.canvas.height * topRatio;
    const bottom = this.ctx.canvas.height * bottomRatio;
    const left = this.ctx.canvas.width * leftRatio;
    const right = this.ctx.canvas.width * rightRatio;

    this.ctx.strokeStyle = VIEWPORT_LINE_STYLE;
    this.ctx.lineWidth = VIEWPORT_LINE_WIDTH;

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

  drawLine(x1: number, y1: number, x2: number, y2: number): void {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  }

}
