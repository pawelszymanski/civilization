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
import {WorldBuilderToolId, WorldBuilderUi} from '../../../models/world-builder';
import {MapUi, TileInfoOverlayId} from '../../../models/map-ui';
import {TerrainBaseId, TerrainFeatureId, TerrainImprovementId, TerrainResourceId} from '../../../models/terrain';
import {Size} from '../../../models/size';

import {CameraService} from '../../../services/camera.service';
import {MapZoomService} from '../../../services/map-zoom.service';
import {TileTerrainService} from '../../../services/tile-terrain.service';
import {TileUiService} from '../../../services/tile-ui.service';

import {CameraStore} from '../../../stores/camera.store';
import {SizeStore} from '../../../stores/size.store';
import {UiStore} from '../../../stores/ui.store';
import {MapStore} from '../../../stores/map.store';
import {MapUiStore} from '../../../stores/map-ui.store';
import {WorldBuilderUiStore} from '../../../stores/world-builder-ui.store';

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
  worldBuilderUi: WorldBuilderUi;

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
    private mapStore: MapStore,
    private mapUiStore: MapUiStore,
    private cameraStore: CameraStore,
    private sizeStore: SizeStore,
    private uiStore: UiStore,
    private worldBuilderUiStore: WorldBuilderUiStore,
  ) {}

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
      this.worldBuilderUiStore.worldBuilderUi.subscribe(worldBuilderUi => this.worldBuilderUi = worldBuilderUi)
    );
  }

  requestAnimationFrame() {
    this.animationFrameId = window.requestAnimationFrame(() => {
      this.requestAnimationFrame();
      this.cdr.markForCheck();
    });
  }

  unsubscribeFromData() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  cancelAnimationFrame() {
    window.cancelAnimationFrame(this.animationFrameId);
  }

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
    this.cameraStore.setTranslate(translate);
  }

  stopDrag() {
    this.isDragging = false;
    document.removeEventListener('mousemove', this.dragHandler as any);
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
    const eventOnMapCoordsPx = { x: event.offsetX, y: event.offsetY }
    this.tileUiService.mapCoordsToGridCoords(eventOnMapCoordsPx);

    // if (this.ui.sidebar === SidebarId.WORLD_BUILDER) {
    //   switch (this.worldBuilderUi.tool) {
    //     case WorldBuilderToolId.TERRAIN_BASE:
    //       const baseId = this.worldBuilderUi.terrainBase;
    //       this.mapStore.setTileTerrainBase(tile, baseId);
    //       break;
    //     case WorldBuilderToolId.TERRAIN_FEATURE:
    //       const featureId = this.worldBuilderUi.terrainFeature;
    //       if (this.tileTerrainService.canFeatureBePutOnTile(featureId, tile)) {
    //         this.mapStore.setTileTerrainFeature(tile, featureId);
    //       }
    //       break;
    //     case WorldBuilderToolId.TERRAIN_RESOURCE:
    //       const resourceId = this.worldBuilderUi.terrainResource;
    //       if (this.tileTerrainService.canResourceBePutOnTile(resourceId, tile)) {
    //         this.mapStore.setTileTerrainResource(tile, resourceId);
    //       }
    //       break;
    //     case WorldBuilderToolId.TERRAIN_IMPROVEMENT:
    //       const improvementId = this.worldBuilderUi.terrainImprovement;
    //       if (this.tileTerrainService.canImprovementBePutOnTile(improvementId, tile)) {
    //         this.mapStore.setTileTerrainImprovement(tile, improvementId);
    //       }
    //       break;
    //   }
    // }
  }

  onOverlayContextmenu(event: MouseEvent) {
    // if (this.ui.sidebar === SidebarId.WORLD_BUILDER) {
    //   switch (this.worldBuilderUi.tool) {
    //     case WorldBuilderToolId.TERRAIN_BASE:
    //       this.mapStore.setTileTerrainBase(tile, TerrainBaseId.OCEAN);
    //       break;
    //     case WorldBuilderToolId.TERRAIN_FEATURE:
    //       this.mapStore.setTileTerrainFeature(tile, TerrainFeatureId.NONE);
    //       break;
    //     case WorldBuilderToolId.TERRAIN_RESOURCE:
    //       this.mapStore.setTileTerrainResource(tile, TerrainResourceId.NONE);
    //       break;
    //     case WorldBuilderToolId.TERRAIN_IMPROVEMENT:
    //       this.mapStore.setTileTerrainImprovement(tile, TerrainImprovementId.NONE);
    //       break;
    //   }
    // }
  }

  onOverlayDblclick(event: MouseEvent) {
    // if (this.ui.sidebar !== SidebarId.WORLD_BUILDER) {
    //   const currentTranslate = this.camera.translate;
    //   const mapCoordsAtScreenCenter = this.cameraService.htmlSpecific.mapCoordsAtScreenCenter(currentTranslate);
    //   const centerOfClickedTile = this.cameraService.htmlSpecific.centerOfTheTileCoords(tile); // TODO removed, use tile coords + .5 width and height
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
    //   const normalizedTranslate = this.normalizeVerticalTranslation(newTranslate);
    //   this.cameraStore.setTranslate(normalizedTranslate);
    // }
  }

}
