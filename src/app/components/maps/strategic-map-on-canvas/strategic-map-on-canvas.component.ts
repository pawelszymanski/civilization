import {Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Subscription} from 'rxjs';

import {Camera} from '../../../models/camera';
import {Coords} from '../../../models/utils';
import {Map, Tile} from '../../../models/map';
import {MapUi} from '../../../models/map-ui';
import {Size} from '../../../models/size';
import {SidebarId, Ui} from '../../../models/ui';

import {CameraService} from '../../../services/camera.service';
import {TileTerrainService} from '../../../services/tile-terrain.service';
import {TileUiService} from '../../../services/tile-ui.service';
import {SizeService} from '../../../services/size.service';
import {PaintMapService} from '../../../services/paint-map.service';
import {MapZoomService} from '../../../services/map-zoom.service';
import {WorldBuilderService} from '../../../services/world-builder.service';

import {CameraStore} from '../../../stores/camera.store';
import {SizeStore} from '../../../stores/size.store';
import {MapStore} from '../../../stores/map.store';
import {MapUiStore} from '../../../stores/map-ui.store';
import {UiStore} from '../../../stores/ui.store';

@Component({
  selector: '.strategic-map-on-canvas-component',
  templateUrl: './strategic-map-on-canvas.component.html',
  styleUrls: ['strategic-map-on-canvas.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StrategicMapOnCanvasComponent implements OnInit, OnDestroy {

  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;

  ctx: CanvasRenderingContext2D;

  camera: Camera;
  size: Size;
  map: Map;
  mapUi: MapUi;
  ui: Ui;

  dragStartCoords: Coords;  // Page x, y when mouse was pressed down
  dragStartOffset: Coords;  // Map element x, y when mouse was pressed down
  isDragging = false;

  animationFrameId: number;

  subscriptions: Subscription[] = [];

  constructor(
    private cameraService: CameraService,
    private tileTerrainService: TileTerrainService,
    private tileUiService: TileUiService,
    private mapZoomService: MapZoomService,
    private sizeService: SizeService, // Keep it here so it initializes
    private paintMapService: PaintMapService,
    private worldBuilderService: WorldBuilderService,
    private cameraStore: CameraStore,
    private sizeStore: SizeStore,
    private mapStore: MapStore,
    private mapUiStore: MapUiStore,
    private uiStore: UiStore,
  ) {}

  // INIT

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
    this.ctx = this.canvas.nativeElement.getContext('2d');
  }

  subscribeToData() {
    this.subscriptions.push(
      this.cameraStore.camera.subscribe(camera => this.camera = camera),
      this.sizeStore.size.subscribe(size => this.size = size),
      this.mapStore.map.subscribe(map => this.map = map),
      this.mapUiStore.mapUi.subscribe(mapUi => this.mapUi = mapUi),
      this.uiStore.ui.subscribe(ui => this.ui = ui),
    );
  }

  requestAnimationFrame() {
    this.animationFrameId = window.requestAnimationFrame(() => {
      this.requestAnimationFrame();
      if (this.camera && this.size && this.map && this.mapUi) {
        this.paintMapService.paintMap(this.ctx);
      }
    });
  }

  unsubscribeFromData() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  cancelAnimationFrame() {
    window.cancelAnimationFrame(this.animationFrameId);
  }

  // EVENTS

  onCanvasMouseup() {
    this.isDragging = false;
  }

  onCanvasMousemove(event: MouseEvent) {
    if (!this.isDragging) { return; }

    // new translate without normalization
    let translate = {
      x: this.dragStartOffset.x + event.pageX - this.dragStartCoords.x,
      y: this.dragStartOffset.y + event.pageY - this.dragStartCoords.y
    }

    // normalize and set
    translate = this.cameraService.normalizeVerticalTranslation(translate);
    translate = this.cameraService.normalizeHorizontalTranslation(translate);
    this.cameraStore.setTranslate(translate);
  }

  onCanvasMousedown(event: MouseEvent) {
    this.dragStartCoords = {x: event.pageX, y: event.pageY};
    this.dragStartOffset = {x: this.camera.translate.x, y: this.camera.translate.y};
    this.isDragging = true;
  }

  onCanvasClick(event: MouseEvent) {
    const tile = this.mouseEventToTile(event);

    if (this.ui.sidebar === SidebarId.WORLD_BUILDER) {
      this.worldBuilderService.handleTileClick(tile);
    }
  }

  onCanvasContextmenu(event: MouseEvent) {
    const tile = this.mouseEventToTile(event);

    if (this.ui.sidebar === SidebarId.WORLD_BUILDER) {
      this.worldBuilderService.handleTileContextmenu(tile);
    }
  }

  onCanvasWheel(event: WheelEvent) {
    this.mapZoomService.handleWheelEvent(event);
  }

  // OTHER

  mouseEventToTile(event: MouseEvent): Tile {
    const eventOnMapCoordsPx = this.eventToMapCoordsPx(event);
    const grid = this.tileUiService.mapCoordsToGridCoords(eventOnMapCoordsPx);
    return this.map.tiles[grid.x * this.map.height + grid.y];
  }

  eventToMapCoordsPx(event: MouseEvent): Coords {
    let x = event.clientX - this.camera.translate.x;
    if (x >= this.size.row.width) { x -= this.size.row.width; }
    let y = event.clientY - this.camera.translate.y;
    return { x, y };
  }

}
