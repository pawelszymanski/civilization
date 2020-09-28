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
import {MapUi} from '../../models/map-ui';
import {Size} from '../../models/size';

import {CameraService} from '../../services/camera.service';
import {TileTerrainService} from '../../services/tile-terrain.service';
import {TileUiService} from '../../services/tile-ui.service';
import {MapZoomService} from '../../services/map-zoom.service';
import {WorldBuilderService} from '../../services/world-builder.service';
import {PaintMapService} from '../../services/paint-map.service';

import {UiStore} from '../../stores/ui.store';
import {MapStore} from '../../stores/map.store';
import {MapUiStore} from '../../stores/map-ui.store';
import {CameraStore} from '../../stores/camera.store';
import {SizeStore} from '../../stores/size.store';
import {SizeService} from '../../services/size.service';

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
  dragStartOffset: Coords;  // Map element x, y when mouse was pressed down
  isDragging = false;
  dragHandler: Function;

  animationFrameId: number;

  subscriptions: Subscription[] = [];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private window: Window,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private cameraService: CameraService,
    private tileTerrainService: TileTerrainService,
    private tileUiService: TileUiService,
    private mapZoomService: MapZoomService,
    private worldBuilderService: WorldBuilderService,
    private paintMapService: PaintMapService,
    private sizeService: SizeService,
    private uiStore: UiStore,
    private mapStore: MapStore,
    private mapUiStore: MapUiStore,
    private cameraStore: CameraStore,
    private sizeStore: SizeStore,
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
        this.calcTileCoordsAndVisibility();
        // this.paintMapService.paintMap(this.ctx);
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
    this.dragStartCoords = {x: event.pageX, y: event.pageY};
    this.dragStartOffset = {x: this.camera.translate.x, y: this.camera.translate.y};

    // Need to store drag handler since .bind(this) changes the reference
    this.dragHandler = this.onMousemove.bind(this);
    this.ngZone.runOutsideAngular(() => {
      this.document.addEventListener('mousemove', this.dragHandler as any);
    });
    this.isDragging = true;
  }

  onMousemove(event: MouseEvent) {
    let translate = {
      x: this.dragStartOffset.x + event.pageX - this.dragStartCoords.x,
      y: this.dragStartOffset.y + event.pageY - this.dragStartCoords.y
    }

    const normalizedTranslation = this.cameraService.normalizeTranslation(translate);
    this.cameraStore.setTranslate(normalizedTranslation);
  }

  onMouseup() {
    this.document.removeEventListener('mousemove', this.dragHandler as any);
    this.isDragging = false;
  }

  onClick(event: MouseEvent) {
    const tile = this.tileUiService.mouseEventToTile(event);

    if (this.ui.sidebar === SidebarId.WORLD_BUILDER) {
      this.worldBuilderService.handleTileClick(tile);
    }
  }

  onDblclick(event: MouseEvent) {
    // const tile = this.mouseEventToTile(event);
    //
    // if (this.ui.sidebar !== SidebarId.WORLD_BUILDER) {
    //   const currentTranslate = this.camera.translate;
    //   const mapCoordsAtScreenCenter = this.cameraService.mapCoordsAtScreenCenter(currentTranslate);
    //   const centerOfClickedTile = this.cameraService.centerOfTheTileCoords(tile); // TODO removed, use tile coords + .5 width and height
    //
    //   // The vector we need to apply to translation to move to desired position
    //   const translateVector: Coords = {
    //     x: mapCoordsAtScreenCenter.x - centerOfClickedTile.x,
    //     y: mapCoordsAtScreenCenter.y - centerOfClickedTile.y
    //   }
    //
    //   // Calculate new translate, normalize it and use
    //   const newTranslate = {
    //     x: currentTranslate.x + translateVector.x,
    //     y: currentTranslate.y + translateVector.y
    //   }
    //   const normalizedTranslate = this.cameraService.normalizeTranslation(newTranslate);
    //   this.cameraStore.setTranslate(normalizedTranslate);
    // }
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

  calcTileCoordsAndVisibility() {
    for (let tile of this.map.tiles) {
      const tileCoordsOnScreenPx = this.tileUiService.tileCoordsOnScreenPx(tile);
      if (tileCoordsOnScreenPx) { tile.px = tileCoordsOnScreenPx; }
      tile.isVisible = !!tileCoordsOnScreenPx;
    }
  }

}
