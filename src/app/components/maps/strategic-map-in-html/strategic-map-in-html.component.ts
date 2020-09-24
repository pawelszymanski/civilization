import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {Subscription} from 'rxjs';

import {Map, Tile} from '../../../models/map';
import {Camera} from '../../../models/camera';
import {Coords} from '../../../models/utils';
import {SidebarId, Ui} from '../../../models/ui';
import {WorldBuilderUi} from '../../../models/world-builder';
import {MapUi, TileInfoOverlayId} from '../../../models/map-ui';
import {WorldBuilderToolId} from '../../../models/world-builder';

import {CAMERA_ZOOM_LEVEL_TO_TILE_SIZE_MAP} from '../../../consts/camera.const';

import {CameraService} from '../../../services/camera.service';
import {MouseService} from '../../../services/mouse.service';
import {TileService} from '../../../services/tile.service';

import {CameraStore} from '../../../stores/camera.store';
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

  map: Map = null;
  mapUi: MapUi = null;
  camera: Camera = null;
  ui: Ui;
  worldBuilderUi: WorldBuilderUi;

  @ViewChild('gameMapElem') gameMapElem: ElementRef;  // Map elem reference

  dragStartCoords: Coords;  // Page x, y when mouse was pressed down
  dragStartOffset: Coords;  // Map element x, y when mouse was pressed down

  isZooming = false;
  isDragging = false;
  dragHandler: Function;

  animationFrameId: number;

  subscriptions: Subscription[] = [];

  constructor(
    private window: Window,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private cameraService: CameraService,
    private mouseService: MouseService,
    private tileService: TileService,
    private mapStore: MapStore,
    private mapUiStore: MapUiStore,
    private cameraStore: CameraStore,
    private uiStore: UiStore,
    private worldBuilderUiStore: WorldBuilderUiStore,
  ) {}

  ngOnInit() {
    this.subscribeToData();
    this.requestAnimationFrame();
  }

  ngOnDestroy() {
    this.unsubscribeFromData();
    this.cancelAnimationFrame();
  }

  subscribeToData() {
    this.subscriptions.push(
      this.mapStore.map.subscribe(map => this.map = map),
      this.mapUiStore.mapUi.subscribe(mapUi => this.mapUi = mapUi),
      this.cameraStore.camera.subscribe(camera => {
        this.cameraService.htmlSpecific.setTileSizeCssVariable(CAMERA_ZOOM_LEVEL_TO_TILE_SIZE_MAP[camera.zoomLevel]);
        this.camera = camera
      }),
      this.uiStore.ui.subscribe(ui => this.ui = ui),
      this.worldBuilderUiStore.worldBuilderUi.subscribe(worldBuilderUi => this.worldBuilderUi = worldBuilderUi)
    );
  }

  requestAnimationFrame() {
    this.animationFrameId = window.requestAnimationFrame(() => {
      this.requestAnimationFrame();
      this.cdr.detectChanges();
    });
  }

  unsubscribeFromData() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  cancelAnimationFrame() {
    window.cancelAnimationFrame(this.animationFrameId);
  }

  normalizeVerticalTranslation(translate: Coords): Coords {
    const gameMapElemHeight = this.gameMapElem.nativeElement.offsetHeight;
    return this.cameraService.normalizeVerticalTranslation(translate, gameMapElemHeight, this.window.innerHeight);
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
    translate = this.normalizeVerticalTranslation(translate);
    this.cameraStore.setTranslate(translate);
  }

  stopDrag() {
    this.isDragging = false;
    document.removeEventListener('mousemove', this.dragHandler as any);
  }

  onTileMouseDown(event: MouseEvent) {
    if (this.isDragging) { this.stopDrag(); }  // Unfortunately sometimes dragging is not disabled properly
    if (event.button === 0) {
      this.startDrag(event)
    }
  }

  onTileMouseUp(event: MouseEvent) {
    if (event.button === 0) {
      this.stopDrag()
    }
  }

  onTileWheel(event: WheelEvent) {
    this.isZooming = true;

    // calculate new zoom level
    const step = this.mouseService.wheelEventToStep(event);
    const currentZoomLevel = this.camera.zoomLevel;
    const newZoomLevel = this.cameraService.normalizeZoomLevel(currentZoomLevel + step);
    if (newZoomLevel === currentZoomLevel) { return; }

    // calculate new translate
    const currentTranslate = this.camera.translate;
    const mapCoordsAtScreenCenter = this.cameraService.htmlSpecific.mapCoordsAtScreenCenter(currentTranslate);
    const scale = CAMERA_ZOOM_LEVEL_TO_TILE_SIZE_MAP[newZoomLevel] / CAMERA_ZOOM_LEVEL_TO_TILE_SIZE_MAP[currentZoomLevel];

    // set zoom level first so it can used in normalization of the translation
    this.cameraStore.setZoomLevel(newZoomLevel);
    this.cameraService.htmlSpecific.setTileSizeCssVariable(CAMERA_ZOOM_LEVEL_TO_TILE_SIZE_MAP[newZoomLevel]);

    // calculate new translate, normalize then set it
    const newTranslate: Coords = {
      x: -Math.round((mapCoordsAtScreenCenter.x * scale) - (this.window.innerWidth / 2)),
      y: -Math.round((mapCoordsAtScreenCenter.y * scale) - (this.window.innerHeight / 2))
    }
    const normalizedTranslate = this.normalizeVerticalTranslation(newTranslate);
    this.cameraStore.setTranslate(normalizedTranslate);

    window.setTimeout(() => {this.isZooming = false;}, 0);
  }

  onTileClick(event: MouseEvent, tile: Tile) {
    if (this.ui.sidebar === SidebarId.WORLD_BUILDER) {
      switch (this.worldBuilderUi.tool) {

        case WorldBuilderToolId.TERRAIN_BASE:
          const baseId = this.worldBuilderUi.terrainBase;
          this.mapStore.setTileTerrainBase(tile, baseId);
          break;

        case WorldBuilderToolId.TERRAIN_FEATURE:
          const featureId = this.worldBuilderUi.terrainFeature;
          if (this.tileService.canFeatureBePutOnTile(featureId, tile)) {
            this.mapStore.setTileTerrainFeature(tile, featureId);
          }
          break;

        case WorldBuilderToolId.TERRAIN_RESOURCE:
          const resourceId = this.worldBuilderUi.terrainResource;
          if (this.tileService.canResourceBePutOnTile(resourceId, tile)) {
            this.mapStore.setTileTerrainResource(tile, resourceId);
          }
          break;

        case WorldBuilderToolId.TERRAIN_IMPROVEMENT:
          const improvementId = this.worldBuilderUi.terrainImprovement;
          if (this.tileService.canImprovementBePutOnTile(improvementId, tile)) {
            this.mapStore.setTileTerrainImprovement(tile, improvementId);
          }
          break;
      }
    }
  }

  onTileDblclick(event: MouseEvent, tile: Tile) {
    if (this.ui.sidebar !== SidebarId.WORLD_BUILDER) {
      const currentTranslate = this.camera.translate;
      const mapCoordsAtScreenCenter = this.cameraService.htmlSpecific.mapCoordsAtScreenCenter(currentTranslate);
      const centerOfClickedTile = this.cameraService.htmlSpecific.centerOfTheTileCoords(tile);

      // The vector we need to apply to translation to move to desired position
      const translateVector: Coords = {
        x: mapCoordsAtScreenCenter.x - centerOfClickedTile.x,
        y: mapCoordsAtScreenCenter.y - centerOfClickedTile.y
      }

      // Calculate new translate, normalize it and use
      const newTranslate = {
        x: currentTranslate.x + translateVector.x,
        y: currentTranslate.y + translateVector.y
      }
      const normalizedTranslate = this.normalizeVerticalTranslation(newTranslate);
      this.cameraStore.setTranslate(normalizedTranslate);
    }
  }

}
