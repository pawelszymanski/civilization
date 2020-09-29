import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef, Inject,
  NgZone,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {Subscription} from 'rxjs';

import {Map, Tile} from '../../models/map';
import {Camera} from '../../models/camera';
import {Coords} from '../../models/utils';
import {SidebarId, Ui} from '../../models/ui';
import {MapUi, TileInfoOverlayId} from '../../models/map-ui';
import {Size} from '../../models/size';

import {TileTerrainService} from '../../services/tile-terrain.service';
import {TileUiService} from '../../services/tile-ui.service';
import {MapZoomService} from '../../services/map-zoom.service';
import {WorldBuilderService} from '../../services/world-builder.service';
import {MapCanvasService} from '../../services/map-canvas.service';
import {SizeService} from '../../services/size.service';

import {UiStore} from '../../stores/ui.store';
import {MapStore} from '../../stores/map.store';
import {MapUiStore} from '../../stores/map-ui.store';
import {CameraStore} from '../../stores/camera.store';
import {SizeStore} from '../../stores/size.store';
import {WorldBuilderHoveredTilesStore} from '../../stores/world-builder-hovered-tiles.store';

@Component({
  selector: '.map-component',
  templateUrl: './map.component.html',
  styleUrls: ['map.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent {

  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;

  ctx: CanvasRenderingContext2D;

  ui: Ui;
  map: Map;
  mapUi: MapUi;
  camera: Camera;
  size: Size;

  dragStartCoords: Coords;  // Page x, y when mouse was pressed down
  dragStartTranslate: Coords;  // Map element x, y when mouse was pressed down
  isDragging = false;
  dragHandlerRef: Function;

  animationFrameId: number;

  subscriptions: Subscription[] = [];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private window: Window,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private tileTerrainService: TileTerrainService,
    private tileUiService: TileUiService,
    private mapZoomService: MapZoomService,
    private worldBuilderService: WorldBuilderService,
    private mapCanvasService: MapCanvasService,
    private sizeService: SizeService,
    private uiStore: UiStore,
    private mapStore: MapStore,
    private mapUiStore: MapUiStore,
    private cameraStore: CameraStore,
    private sizeStore: SizeStore,
    private worldBuilderHoveredTilesStore: WorldBuilderHoveredTilesStore,
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
      this.uiStore.ui.subscribe(ui => this.ui = ui),
      this.mapStore.map.subscribe(map => this.map = map),
      this.mapUiStore.mapUi.subscribe(mapUi => this.mapUi = mapUi),
      this.cameraStore.camera.subscribe(camera => this.camera = camera),
      this.sizeStore.size.subscribe(size => this.size = size),
    );
  }

  requestAnimationFrame() {
    this.animationFrameId = this.window.requestAnimationFrame(() => {
      this.requestAnimationFrame();
      if (!!this.camera && !!this.size && !!this.map && !!this.mapUi) {
        this.updateTilesUiData();
        this.isCanvasInUse() ? this.mapCanvasService.paintCanvas(this.ctx) : this.mapCanvasService.clearCanvas();
        this.cdr.detectChanges();
      }
    });
  }

  unsubscribeFromData() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  cancelAnimationFrame() {
    this.window.cancelAnimationFrame(this.animationFrameId);
  }

  // EVENTS

  onMousedown(event: MouseEvent) {
    if (this.isDragging) { this.stopDrag(); }  // Unfortunately sometimes dragging is not disabled properly, ie try dragging out of the window, release button and come back
    this.startDrag(event);
  }

  onMousemove(event: MouseEvent) {  // Intended for the hover effects
    const isPlacingTerrain = (this.ui.sidebar === SidebarId.WORLD_BUILDER) && !this.isDragging;
    const tiles = isPlacingTerrain ? this.tileUiService.circleOfTiles(this.tileUiService.mouseEventToTile(event), 2) : [];
    this.worldBuilderHoveredTilesStore.next(tiles);
  }

  onMouseup(event: MouseEvent) {
    this.stopDrag();

    const dragDistance = this.vectorLength({x: event.pageX, y: event.pageY}, this.dragStartCoords);
    if (dragDistance === 0)  { this.onClick(event); }  // With no excessive dragging count as a click
  }

  onClick(event: MouseEvent) {  // artificial, comes after decision making in onMouseup
    const tile = this.tileUiService.mouseEventToTile(event);

    if (this.ui.sidebar === SidebarId.WORLD_BUILDER) {
      this.worldBuilderService.handleTileClick(tile);
    }
  }

  onContextmenu(event: MouseEvent) {
    const tile = this.tileUiService.mouseEventToTile(event);

    if (this.ui.sidebar === SidebarId.WORLD_BUILDER) {
      this.worldBuilderService.handleTileContextmenu(tile);
    }
  }

  onWheel(event: WheelEvent) {
    this.mapZoomService.handleWheelEvent(event);
  }

  // OTHER

  vectorLength(vector1: Coords, vector2: Coords): number {
    return Math.sqrt( (vector1.x - vector2.x) ** 2 + (vector1.y - vector2.y) ** 2 );
  }

  updateTilesUiData() {
    for (let tile of this.map.tiles) {
      const tileCoordsOnScreenPx = this.tileUiService.tileCoordsOnScreenPx(tile);
      if (tileCoordsOnScreenPx) { tile.px = tileCoordsOnScreenPx; }
      tile.isVisible = !!tileCoordsOnScreenPx;
    }
  }

  startDrag(event: MouseEvent) {
    this.dragStartCoords = {x: event.pageX, y: event.pageY};
    this.dragStartTranslate = {x: this.camera.translate.x, y: this.camera.translate.y};

    // Need to store drag handler since .bind(this) changes the reference
    // ngZone.runOutsideAngular to avoid change detection ov every mousemove event
    this.dragHandlerRef = this.dragHandler.bind(this);
    this.ngZone.runOutsideAngular(() => {
      this.document.addEventListener('mousemove', this.dragHandlerRef as any);
    });
    this.isDragging = true;
  }

  dragHandler(event: MouseEvent) {
    let translate = {
      x: this.dragStartTranslate.x + event.pageX - this.dragStartCoords.x,
      y: this.dragStartTranslate.y + event.pageY - this.dragStartCoords.y
    }
    this.cameraStore.setTranslate(translate);
  }

  stopDrag() {
    this.document.removeEventListener('mousemove', this.dragHandlerRef as any);
    this.isDragging = false;
  }

  isCanvasInUse(): boolean {
    return this.ui.sidebar === SidebarId.WORLD_BUILDER ||
           this.mapUi.showGrid ||
           this.mapUi.infoOverlay !== TileInfoOverlayId.NONE;
  }

}

// onDblclick(event: MouseEvent) {
//   const tile = this.mouseEventToTile(event);
//
//   if (this.ui.sidebar !== SidebarId.WORLD_BUILDER) {
//     const currentTranslate = this.camera.translate;
//     const mapCoordsAtScreenCenter = this.cameraService.mapCoordsAtScreenCenter(currentTranslate);
//     const centerOfClickedTile = this.cameraService.centerOfTheTileCoords(tile); // TODO removed, use tile coords + .5 width and height
//
//     // The vector we need to apply to translation to move to desired position
//     const translateVector: Coords = {
//       x: mapCoordsAtScreenCenter.x - centerOfClickedTile.x,
//       y: mapCoordsAtScreenCenter.y - centerOfClickedTile.y
//     }
//
//     // Calculate new translate, normalize it and use
//     const newTranslate = {
//       x: currentTranslate.x + translateVector.x,
//       y: currentTranslate.y + translateVector.y
//     }
//     this.cameraStore.setTranslate(normalizedTranslate);
//   }
// }
