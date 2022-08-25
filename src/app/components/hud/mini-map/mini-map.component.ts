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

// General flow: Subscribe to map. When map changes send it over to worker to generate new minimap image.
// On worker message use minimap image and add the viewport rectangle locally.
@Component({
  selector: '.mini-map-component',
  templateUrl: './mini-map.component.html',
  styleUrls: ['./mini-map.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MiniMapComponent implements OnInit, OnDestroy {

  MINIMAP_WIDTH = MINIMAP_WIDTH;
  MINIMAP_HEIGHT = MINIMAP_HEIGHT;

  @ViewChild('minimap', { static: true }) minimapCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('viewport', { static: true }) viewportCanvas: ElementRef<HTMLCanvasElement>;

  minimapCtx: CanvasRenderingContext2D;
  viewportCtx: CanvasRenderingContext2D;

  camera: Camera;
  size: Size;

  isDragging = false;

  minimapCanvasWorker: Worker;
  minimapImageData: ImageData;

  isMinimapAvailable = false;

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
    this.initMinimapCanvasWorker();
    this.initMinimapCtx();
    this.initViewportCtx();
    this.subscribeToData();
    this.requestAnimationFrame();
  }

  ngOnDestroy(): void {
    this.cancelAnimationFrame();
    this.unsubscribeFromData();
    this.destroyWorker();
  }

  initMinimapCanvasWorker(): void {
    // Needs to be a type: module, https://stackoverflow.com/questions/48045569/whats-the-difference-between-a-classic-and-module-web-worker
    this.minimapCanvasWorker = new Worker(new URL('./../../../workers/minimap-canvas.worker', import.meta.url), {type: 'module'});
    this.minimapCanvasWorker.onmessage = (message) => {
      this.minimapImageData = message.data;
      this.isMinimapAvailable = true;
    };
  }

  initMinimapCtx(): void {
    this.minimapCtx = this.minimapCanvas.nativeElement.getContext('2d');
  }

  initViewportCtx(): void {
    this.viewportCtx = this.viewportCanvas.nativeElement.getContext('2d');
  }

  subscribeToData(): void {
    this.subscriptions.push(
      this.cameraStore.camera.subscribe(camera => this.onCameraUpdate(camera)),
      this.sizeStore.size.subscribe(size => this.onSizeUpdate(size)),
      this.mapStore.map.subscribe(map => this.onMapUpdate(map))
    );
  }

  onCameraUpdate(camera: Camera): void {
    this.camera = camera;
    if (this.size && this.camera) { this.drawViewport() }
  }

  onSizeUpdate(size: Size): void {
    this.size = size;
    if (this.size && this.camera) { this.drawViewport() }
  }

  onMapUpdate(map: Map): void {
    this.minimapCanvasWorker.postMessage(map);
  }

  requestAnimationFrame(): void {
    this.animationFrameId = window.requestAnimationFrame(() => {
      this.requestAnimationFrame();
      if (this.minimapImageData) {
        this.minimapCtx.putImageData(this.minimapImageData, 0, 0);
        this.minimapImageData = null;
        this.drawViewport();
      }
    });
  }

  cancelAnimationFrame(): void {
    window.cancelAnimationFrame(this.animationFrameId);
  }

  unsubscribeFromData(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  destroyWorker(): void {
    this.minimapCanvasWorker.terminate();
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
      x: Math.floor(-event.offsetX * (this.size.row.width / this.viewportCtx.canvas.width)) + this.size.screen.halfWidth,
      y: Math.floor(-event.offsetY * (this.size.map.height / this.viewportCtx.canvas.height)) + this.size.screen.halfHeight
    };
  }

  drawViewport(): void {
    const topRatio = (-this.camera.translate.y) / this.size.map.height;
    const bottomRatio = (-this.camera.translate.y + this.size.screen.height) / this.size.map.height;
    const leftRatio = (-this.camera.translate.x) / this.size.map.width;
    const rightRatio = ((-this.camera.translate.x + this.size.screen.width) % this.size.map.width / this.size.map.width);

    const top = this.viewportCtx.canvas.height * topRatio;
    const bottom = this.viewportCtx.canvas.height * bottomRatio;
    const left = this.viewportCtx.canvas.width * leftRatio;
    const right = this.viewportCtx.canvas.width * rightRatio;

    this.viewportCtx.clearRect(0, 0, MINIMAP_WIDTH, MINIMAP_HEIGHT);
    this.viewportCtx.strokeStyle = VIEWPORT_LINE_STYLE;
    this.viewportCtx.lineWidth = VIEWPORT_LINE_WIDTH;

    this.drawLine(left, top, left, bottom);
    this.drawLine(right, top, right, bottom);

    if (right > left) {
      this.drawLine(left, top, right, top);
      this.drawLine(left, bottom, right, bottom);
    } else {
      this.drawLine(right, top, 0, top);
      this.drawLine(right, bottom, 0, bottom);
      this.drawLine(left, top, this.viewportCtx.canvas.width, top);
      this.drawLine(left, bottom, this.viewportCtx.canvas.width, bottom);
    }
  }

  drawLine(x1: number, y1: number, x2: number, y2: number): void {
    this.viewportCtx.beginPath();
    this.viewportCtx.moveTo(x1, y1);
    this.viewportCtx.lineTo(x2, y2);
    this.viewportCtx.stroke();
  }

}
