// import {
//   ChangeDetectionStrategy,
//   ChangeDetectorRef,
//   Component,
//   ElementRef,
//   NgZone,
//   ViewChild,
//   ViewEncapsulation
// } from '@angular/core';
//
// import {GameMap, GameMapTile} from '../../app/models/game-map/game-map';
// import {Camera} from '../../app/models/camera/camera';
// import {Coords} from '../../app/models/utils/coords';
// import {SidebarId, TileOverlayId, Ui} from '../../app/models/ui/ui';
// import {WorldBuilderUi} from '../../app/models/world-builder/world-builder';
//
// import {CAMERA_ZOOM_LEVEL_TO_TILE_SIZE_MAP} from '../../app/consts/camera/camera.const';
//
// import {CameraHelperService} from '../../app/services/camera/camera-helper.service';
//
// import {CameraStore} from '../../app/stores/camera.store';
// import {GameMapStore} from '../../app/stores/game-map.store';
// import {UiStore} from '../../app/stores/ui.store';
// import {WorldBuilderUiStore} from '../../app/stores/world-builder-ui.store';
// import {WorldBuilderToolId} from '../../app/models/world-builder/world-builder-tool.enum';
// import {Subscription} from 'rxjs';
//
// @Component({
//   selector: '.strategic-view-html-component',
//   templateUrl: './strategic-view-html.component.html',
//   styleUrls: ['strategic-view-html.component.scss'],
//   encapsulation: ViewEncapsulation.None,
//   changeDetection: ChangeDetectionStrategy.OnPush
// })
// export class StrategicViewHtmlComponent {
//
//   TileOverlayId = TileOverlayId;
//
//   gameMap: GameMap = null;
//   camera: Camera = null;
//   ui: Ui;
//   worldBuilderUi: WorldBuilderUi;
//
//   @ViewChild('gameMapElem') gameMapElem: ElementRef;  // Map elem reference
//
//   dragStartCoords: Coords;  // Page x, y when mouse was pressed down
//   dragStartOffset: Coords;  // Map element x, y when mouse was pressed down
//
//   isZooming = false;
//   isDragging = false;
//   dragHandler: Function;
//
//   animationFrameId: number;
//
//   subscriptions: Subscription[] = [];
//
//   constructor(
//     private window: Window,
//     private ngZone: NgZone,
//     private cdr: ChangeDetectorRef,
//     private cameraHelperService: CameraHelperService,
//     private gameMapStore: GameMapStore,
//     private cameraStore: CameraStore,
//     private uiStore: UiStore,
//     private worldBuilderUiStore: WorldBuilderUiStore,
//   ) {}
//
//   ngOnInit() {
//     this.subscribeToData();
//     this.requestAnimationFrame();
//   }
//
//   ngOnDestroy() {
//     this.cancelAnimationFrame();
//   }
//
//   subscribeToData() {
//     this.subscriptions.push(
//       this.gameMapStore.gameMap.subscribe(gameMap => this.gameMap = gameMap),
//       this.cameraStore.camera.subscribe(camera => this.camera = camera),
//       this.uiStore.ui.subscribe(ui => this.ui = ui),
//       this.worldBuilderUiStore.worldBuilderUi.subscribe(worldBuilderUi => this.worldBuilderUi = worldBuilderUi)
//     );
//   }
//
//   requestAnimationFrame() {
//     this.animationFrameId = window.requestAnimationFrame(() => {
//       this.requestAnimationFrame();
//       this.cdr.detectChanges();
//     });
//   }
//
//   cancelAnimationFrame() {
//     window.cancelAnimationFrame(this.animationFrameId);
//   }
//
//   calcColumnStyleLeft(colNumber: number): number {
//     const tileSize = this.cameraHelperService.getTileSizeCssVariable();
//     const gameMapElemWidth = tileSize * this.gameMap.columns.length;
//     return 0;
//   }
//
//   normalizeVerticalTranslation(translate: Coords): Coords {
//     const gameMapElemHeight = this.gameMapElem.nativeElement.offsetHeight;
//     return this.cameraHelperService.normalizeVerticalTranslation(translate, gameMapElemHeight);
//   }
//
//   startDrag(event: MouseEvent) {
//     this.dragStartCoords = {x: event.pageX, y: event.pageY};
//     this.dragStartOffset = {x: this.camera.translate.x, y: this.camera.translate.y};
//
//     // Need to store drag handler since .bind(this) changes the reference
//     this.dragHandler = this.continueDrag.bind(this);
//     document.addEventListener('mousemove', this.dragHandler as any);
//     this.isDragging = true;
//   }
//
//   continueDrag(event: MouseEvent): any {
//     // new translate without normalization
//     let translate = {
//       x: this.dragStartOffset.x + event.pageX - this.dragStartCoords.x,
//       y: this.dragStartOffset.y + event.pageY - this.dragStartCoords.y
//     }
//
//     // normalize and set
//     translate = this.normalizeVerticalTranslation(translate);
//     this.cameraStore.setTranslate(translate);
//   }
//
//   stopDrag() {
//     this.isDragging = false;
//     document.removeEventListener('mousemove', this.dragHandler as any);
//   }
//
//   onTileMouseDown(event: MouseEvent) {
//     if (this.isDragging) { this.stopDrag(); }  // Unfortunately sometimes dragging is not disabled properly
//     if (event.button === 0) {
//       this.startDrag(event)
//     }
//   }
//
//   onTileMouseUp(event: MouseEvent) {
//     if (event.button === 0) {
//       this.stopDrag()
//     }
//   }
//
//   onTileWheel(event: WheelEvent) {
//     this.isZooming = true;
//
//     // calculate new zoom level
//     const step = this.cameraHelperService.wheelEventToStep(event);
//     const currentZoomLevel = this.camera.zoomLevel;
//     const newZoomLevel = this.cameraHelperService.normalizeZoomLevel(currentZoomLevel + step);
//     if (newZoomLevel === currentZoomLevel) { return; }
//
//     // calculate new translate
//     const currentTranslate = this.camera.translate;
//     const mapCoordsAtScreenCenter = this.cameraHelperService.mapCoordsAtScreenCenter(currentTranslate);
//     const scale = CAMERA_ZOOM_LEVEL_TO_TILE_SIZE_MAP[newZoomLevel] / CAMERA_ZOOM_LEVEL_TO_TILE_SIZE_MAP[currentZoomLevel];
//
//     // set zoom level first so it can used in normalization of the translation
//     this.cameraStore.setZoomLevel(newZoomLevel);
//
//     // calculate new translate, normalize then set it
//     const newTranslate: Coords = {
//       x: -Math.round((mapCoordsAtScreenCenter.x * scale) - (this.window.innerWidth / 2)),
//       y: -Math.round((mapCoordsAtScreenCenter.y * scale) - (this.window.innerHeight / 2))
//     }
//     const normalizedTranslate = this.normalizeVerticalTranslation(newTranslate);
//     this.cameraStore.setTranslate(normalizedTranslate);
//
//     window.setTimeout(() => {this.isZooming = false;}, 0);
//   }
//
//   onTileClick(event: MouseEvent, tile: GameMapTile) {
//     if (this.ui.sidebar === SidebarId.WORLD_BUILDER) {
//       switch (this.worldBuilderUi.tool) {
//         case WorldBuilderToolId.TERRAIN_BASE:
//           this.gameMapStore.setTileTerrainBase(tile.coords, this.worldBuilderUi.terrainBase);
//           break;
//         case WorldBuilderToolId.TERRAIN_FEATURE:
//           this.gameMapStore.setTileTerrainFeature(tile.coords, this.worldBuilderUi.terrainFeature);
//           break;
//         case WorldBuilderToolId.TERRAIN_RESOURCE:
//           this.gameMapStore.setTileTerrainResource(tile.coords, this.worldBuilderUi.terrainResource);
//           break;
//         case WorldBuilderToolId.TERRAIN_IMPROVEMENT:
//           this.gameMapStore.setTileTerrainImprovement(tile.coords, this.worldBuilderUi.terrainImprovement);
//           break;
//       }
//     }
//   }
//
//   onTileDblclick(event: MouseEvent, tile: GameMapTile) {
//     if (this.ui.sidebar !== SidebarId.WORLD_BUILDER) {
//       const currentTranslate = this.camera.translate;
//       const mapCoordsAtScreenCenter = this.cameraHelperService.mapCoordsAtScreenCenter(currentTranslate);
//       const centerOfClickedTile = this.cameraHelperService.centerOfTheTileCoords(tile);
//
//       // The vector we need to apply to translation to move to desired position
//       const translateVector: Coords = {
//         x: mapCoordsAtScreenCenter.x - centerOfClickedTile.x,
//         y: mapCoordsAtScreenCenter.y - centerOfClickedTile.y
//       }
//
//       // Calculate new translate, normalize it and use
//       const newTranslate = {
//         x: currentTranslate.x + translateVector.x,
//         y: currentTranslate.y + translateVector.y
//       }
//       const normalizedTranslate = this.normalizeVerticalTranslation(newTranslate);
//       this.cameraStore.setTranslate(normalizedTranslate);
//     }
//   }
//
//   onTileContextmenu(event: MouseEvent, tile: GameMapTile) {
//     //
//   }
//
// }
