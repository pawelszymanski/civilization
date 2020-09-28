import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgZone,
  ViewEncapsulation
} from '@angular/core';
import {Subscription} from 'rxjs';

import {Map, Tile} from '../../../models/map';
import {Camera} from '../../../models/camera';
import {Coords} from '../../../models/utils';
import {SidebarId, Ui} from '../../../models/ui';
import {MapUi, TileInfoOverlayId} from '../../../models/map-ui';
import {Size} from '../../../models/size';

import {CameraService} from '../../../services/camera.service';
import {MapZoomService} from '../../../services/map-zoom.service';
import {TileTerrainService} from '../../../services/tile-terrain.service';
import {TileUiService} from '../../../services/tile-ui.service';
import {WorldBuilderService} from '../../../services/world-builder.service';

import {CameraStore} from '../../../stores/camera.store';
import {SizeStore} from '../../../stores/size.store';
import {UiStore} from '../../../stores/ui.store';
import {MapStore} from '../../../stores/map.store';
import {MapUiStore} from '../../../stores/map-ui.store';
import {
  TERRAIN_BASE_SET,
  TERRAIN_FEATURE_SET,
  TERRAIN_IMPROVEMENT_SET,
  TERRAIN_RESOURCE_SET
} from '../../../consts/terrain.const';
import {TerrainBaseId} from '../../../models/terrain';

@Component({
  selector: '.strategic-map-in-html-component',
  templateUrl: './strategic-map-in-html.component.html',
  styleUrls: ['strategic-map-in-html.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StrategicMapInHtmlComponent {

  TileInfoOverlayId = TileInfoOverlayId;

  map: Map;
  mapUi: MapUi;
  camera: Camera;
  size: Size;
  ui: Ui;

  dragStartCoords: Coords;  // Page x, y when mouse was pressed down
  dragStartOffset: Coords;  // Map element x, y when mouse was pressed down

  isDragging = false;
  dragHandler: Function;

  animationFrameId: number;

  subscriptions: Subscription[] = [];

  constructor(
    private window: Window,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private cameraService: CameraService,
    private tileTerrainService: TileTerrainService,
    private tileUiService: TileUiService,
    private mapZoomService: MapZoomService,
    private worldBuilderService: WorldBuilderService,
    private mapStore: MapStore,
    private mapUiStore: MapUiStore,
    private cameraStore: CameraStore,
    private sizeStore: SizeStore,
    private uiStore: UiStore,
  ) {}

  // INIT

  ngOnInit() {
    this.subscribeToData();
    this.ngZone.runOutsideAngular(() => {
      this.requestAnimationFrame();
    });
  }

  ngOnDestroy() {
    this.unsubscribeFromData();
    this.cancelAnimationFrame();
  }

  subscribeToData() {
    this.subscriptions.push(
      this.mapStore.map.subscribe(map => this.map = map),
      this.mapUiStore.mapUi.subscribe(mapUi => this.mapUi = mapUi),
      this.cameraStore.camera.subscribe(camera => this.camera = camera),
      this.sizeStore.size.subscribe(size => this.size = size),
      this.uiStore.ui.subscribe(ui => this.ui = ui),
    );
  }

  requestAnimationFrame() {
    this.animationFrameId = window.requestAnimationFrame(() => {
      this.requestAnimationFrame();
      for (let tile of this.map.tiles) {
        const tileCoordsOnScreenPx = this.tileUiService.tileCoordsOnScreenPx(tile);
        if (tileCoordsOnScreenPx) { tile.px = tileCoordsOnScreenPx; }
        tile.isVisible = !!tileCoordsOnScreenPx;
      }
      this.cdr.detectChanges();
    });
  }

  unsubscribeFromData() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  cancelAnimationFrame() {
    window.cancelAnimationFrame(this.animationFrameId);
  }

  // EVENTS

  onOverlayMouseDown(event: MouseEvent) {
    if (this.isDragging) { this.stopDrag(); }  // Unfortunately sometimes dragging is not disabled properly
    if (event.button === 0) {
      this.startDrag(event)
    }
  }

  onOverlayMouseUp(event: MouseEvent) {
    if (event.button === 0) {
      this.stopDrag()
    }
  }

  onOverlayWheel(event: WheelEvent) {
    this.mapZoomService.handleWheelEvent(event);
  }

  onOverlayClick(event: MouseEvent) {
    const tile = this.tileUiService.mouseEventToTile(event);

    if (this.ui.sidebar === SidebarId.WORLD_BUILDER) {
      this.worldBuilderService.handleTileClick(tile);
    }
  }

  onOverlayContextmenu(event: MouseEvent) {
    const tile = this.tileUiService.mouseEventToTile(event);

    if (this.ui.sidebar === SidebarId.WORLD_BUILDER) {
      this.worldBuilderService.handleTileContextmenu(tile);
    }
  }

  onOverlayDblclick(event: MouseEvent) {
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
    //   const normalizedTranslate = this.cameraService.normalizeVerticalTranslation(newTranslate);
    //   this.cameraStore.setTranslate(normalizedTranslate);
    // }
  }

  // OTHER

  startDrag(event: MouseEvent) {
    this.dragStartCoords = {x: event.pageX, y: event.pageY};
    this.dragStartOffset = {x: this.camera.translate.x, y: this.camera.translate.y};

    // Need to store drag handler since .bind(this) changes the reference
    this.dragHandler = this.continueDrag.bind(this);
    document.addEventListener('mousemove', this.dragHandler as any);
    this.isDragging = true;
  }

  continueDrag(event: MouseEvent): any {
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

  stopDrag() {
    this.isDragging = false;
    document.removeEventListener('mousemove', this.dragHandler as any);
  }

}
