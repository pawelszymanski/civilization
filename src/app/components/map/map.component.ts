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

import {Map} from '../../models/map';
import {Camera} from '../../models/camera';
import {Coords} from '../../models/utils';
import {SidebarId, Ui} from '../../models/ui';
import {GameplayUi, TileInfoOverlayId} from '../../models/gameplay-ui';
import {Size} from '../../models/size';
import {WorldBuilderUi} from '../../models/world-builder';

import {TileTerrainService} from '../../services/tile-terrain.service';
import {TileUiService} from '../../services/tile-ui.service';
import {MapZoomService} from '../../services/map-zoom.service';
import {WorldBuilderService} from '../../services/world-builder.service';
import {MapCanvasService} from '../../services/map-canvas.service';
import {SizeService} from '../../services/size.service';

import {UiStore} from '../../stores/ui.store';
import {MapStore} from '../../stores/map.store';
import {GameplayUiStore} from '../../stores/gameplay-ui.store';
import {CameraStore} from '../../stores/camera.store';
import {SizeStore} from '../../stores/size.store';
import {WorldBuilderHoveredTilesStore} from '../../stores/world-builder-hovered-tiles.store';
import {WorldBuilderUiStore} from '../../stores/world-builder-ui.store';

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
  gameplayUi: GameplayUi;
  camera: Camera;
  size: Size;
  worldBuilderUi: WorldBuilderUi;

  dragStartCoords: Coords;  // Page x, y when mouse was pressed down
  dragStartTranslate: Coords;  // Map element x, y when mouse was pressed down
  isDragging = false;
  dragHandlerRef: () => void;

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
    private gameplayUiStore: GameplayUiStore,
    private cameraStore: CameraStore,
    private sizeStore: SizeStore,
    private worldBuilderHoveredTilesStore: WorldBuilderHoveredTilesStore,
    private worldBuilderUiStore: WorldBuilderUiStore,
  ) {}

  // INIT

  ngOnInit(): void {
    this.initContext();
    this.subscribeToData();
    this.requestAnimationFrame();
  }

  ngOnDestroy(): void {
    this.unsubscribeFromData();
    this.cancelAnimationFrame();
  }

  initContext(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.mapCanvasService.setContextRef(this.ctx);
  }

  subscribeToData(): void {
    this.subscriptions.push(
      this.uiStore.ui.subscribe(ui => this.ui = ui),
      this.mapStore.map.subscribe(map => this.map = map),
      this.gameplayUiStore.gameplayUi.subscribe(gameplayUi => this.gameplayUi = gameplayUi),
      this.cameraStore.camera.subscribe(camera => this.camera = camera),
      this.sizeStore.size.subscribe(size => this.size = size),
      this.worldBuilderUiStore.worldBuilderUi.subscribe(worldBuilderUi => this.worldBuilderUi = worldBuilderUi),
    );
  }

  requestAnimationFrame(): void {
    this.animationFrameId = this.window.requestAnimationFrame(() => {
      this.requestAnimationFrame();
      if (!!this.camera && !!this.size && !!this.map && !!this.gameplayUi) {
        this.updateTilesUiData();
        this.isCanvasInUse() ? this.mapCanvasService.paintCanvas() : this.mapCanvasService.clearCanvas();
        this.cdr.detectChanges();
      }
    });
  }

  unsubscribeFromData(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  cancelAnimationFrame(): void {
    this.window.cancelAnimationFrame(this.animationFrameId);
  }

  // EVENTS
  onMousedown(event: MouseEvent): void {
    // TODO: BUG: Unfortunately sometimes dragging is not disabled properly, ie try dragging out of the window, release button and come back
    if (this.isDragging) { this.stopDrag(); }
    this.startDrag(event);
  }

  onMousemove(event: MouseEvent): void {  // Intended for the hover effects
    if (this.ui.sidebar === SidebarId.WORLD_BUILDER && !this.isDragging) {
      const hoveredTile = this.tileUiService.mouseEventToTile(event);
      if (hoveredTile) {
        const tilesInRadius = this.tileUiService.tilesInRadius(hoveredTile, this.worldBuilderUi.brushSize);
        this.worldBuilderHoveredTilesStore.next(tilesInRadius);
      } else {
        this.worldBuilderHoveredTilesStore.next([]);
      }
    }
  }

  onMouseup(event: MouseEvent): void {
    this.stopDrag();

    const dragDistance = this.vectorLength({x: event.pageX, y: event.pageY}, this.dragStartCoords);
    if (dragDistance < 3)  { this.onClick(event); }  // With no excessive dragging count as a click
  }

  onClick(event: MouseEvent): void {  // artificial, comes after decision-making in onMouseup
    const tile = this.tileUiService.mouseEventToTile(event);
    if (!tile) { return; }

    if (this.ui.sidebar === SidebarId.WORLD_BUILDER) {
      this.worldBuilderService.handleTileClick();
    }
  }

  onContextmenu(event: MouseEvent): void {
    const tile = this.tileUiService.mouseEventToTile(event);
    if (!tile) { return; }

    if (this.ui.sidebar === SidebarId.WORLD_BUILDER) {
      this.worldBuilderService.handleTileContextmenu();
    }
  }

  onWheel(event: WheelEvent): void {
    this.mapZoomService.handleWheelEvent(event);
  }

  // OTHER

  vectorLength(vector1: Coords, vector2: Coords): number {
    return Math.sqrt( (vector1.x - vector2.x) ** 2 + (vector1.y - vector2.y) ** 2 );
  }

  updateTilesUiData(): void {
    for (const tile of this.map.tiles) {
      const tileCoordsOnScreenPx = this.tileUiService.tileCoordsOnScreenPx(tile);
      if (tileCoordsOnScreenPx) { tile.px = tileCoordsOnScreenPx; }
      tile.isVisible = !!tileCoordsOnScreenPx;
    }
  }

  startDrag(event: MouseEvent): void {
    this.dragStartCoords = {x: event.pageX, y: event.pageY};
    this.dragStartTranslate = {x: this.camera.translate.x, y: this.camera.translate.y};

    // Need to store drag handler since .bind(this) changes the reference
    // ngZone.runOutsideAngular is to avoid change detection ov every mousemove event
    this.dragHandlerRef = this.dragHandler.bind(this);
    this.ngZone.runOutsideAngular(() => {
      this.document.addEventListener('mousemove', this.dragHandlerRef as any);
    });
    this.isDragging = true;
  }

  dragHandler(event: MouseEvent): void {
    const translate = {
      x: this.dragStartTranslate.x + event.pageX - this.dragStartCoords.x,
      y: this.dragStartTranslate.y + event.pageY - this.dragStartCoords.y
    };
    this.cameraStore.setTranslate(translate);
  }

  stopDrag(): void {
    this.document.removeEventListener('mousemove', this.dragHandlerRef as any);
    this.isDragging = false;
  }

  isCanvasInUse(): boolean {
    return this.ui.sidebar === SidebarId.WORLD_BUILDER ||             // drawing hovered tiles
           this.gameplayUi.showGrid ||                                // grid
           this.gameplayUi.infoOverlay !== TileInfoOverlayId.NONE;    // tile overlay of any kind
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
