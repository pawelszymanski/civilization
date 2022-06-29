// import {Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
// import {Subscription} from 'rxjs';
//
// import {Camera} from '../../app/models/camera';
// import {Coords} from '../../app/models/utils';
// import {Map, Tile} from '../../app/models/map';
// import {GameplayUi} from '../../app/models/gameplay-ui';
// import {Size} from '../../app/models/size';
// import {SidebarId, Ui} from '../../app/models/ui';
//
// import {CameraService} from '../../app/services/camera.service';
// import {TileTerrainService} from '../../app/services/tile-terrain.service';
// import {TileUiService} from '../../app/services/tile-ui.service';
// import {SizeService} from '../../app/services/size.service';
// import {StrategicMapCanvasService} from '../../app/services/paint-map.service';
// import {MapZoomService} from '../../app/services/map-zoom.service';
// import {WorldBuilderService} from '../../app/services/world-builder.service';
//
// import {CameraStore} from '../../app/stores/camera.store';
// import {SizeStore} from '../../app/stores/size.store';
// import {MapStore} from '../../app/stores/map.store';
// import {GameplayUiStore} from '../../app/stores/gameplay-ui.store';
// import {UiStore} from '../../app/stores/ui.store';
//
// @Component({
//   selector: '.strategic-map-on-canvas-component',
//   templateUrl: './strategic-map-on-canvas.component.html',
//   styleUrls: ['strategic-map-on-canvas.component.scss'],
//   encapsulation: ViewEncapsulation.None
// })
// export class StrategicMapOnCanvasComponent implements OnInit, OnDestroy {
//
//   @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
//
//   ctx: CanvasRenderingContext2D;
//
//   camera: Camera;
//   size: Size;
//   map: Map;
//   gameplayUi: GameplayUi;
//   ui: Ui;
//
//   dragStartCoords: Coords;  // Page x, y when mouse was pressed down
//   dragStartOffset: Coords;  // Map element x, y when mouse was pressed down
//   isDragging = false;
//
//   animationFrameId: number;
//
//   subscriptions: Subscription[] = [];
//
//   constructor(
//     private cameraService: CameraService,
//     private tileTerrainService: TileTerrainService,
//     private tileUiService: TileUiService,
//     private mapZoomService: MapZoomService,
//     private sizeService: SizeService, // Keep it here so it initializes
//     private paintMapService: StrategicMapCanvasService,
//     private worldBuilderService: WorldBuilderService,
//     private cameraStore: CameraStore,
//     private sizeStore: SizeStore,
//     private mapStore: MapStore,
//     private gameplayUiStore: GameplayUiStore,
//     private uiStore: UiStore,
//   ) {}
//
//   // INIT
//
//   ngOnInit() {
//     this.initContext();
//     this.subscribeToData();
//     this.requestAnimationFrame();
//   }
//
//   ngOnDestroy() {
//     this.unsubscribeFromData();
//     this.cancelAnimationFrame();
//   }
//
//   initContext() {
//     this.ctx = this.canvas.nativeElement.getContext('2d');
//   }
//
//   subscribeToData() {
//     // this.subscriptions.push(
//     //   this.cameraStore.camera.subscribe(camera => this.camera = camera),
//     //   this.sizeStore.size.subscribe(size => this.size = size),
//     //   this.mapStore.map.subscribe(map => this.map = map),
//     //   this.gameplayUiStore.gameplayUi.subscribe(gameplayUi => this.gameplayUi = gameplayUi),
//     //   this.uiStore.ui.subscribe(ui => this.ui = ui),
//     // );
//   }
//
//   requestAnimationFrame() {
//     this.animationFrameId = window.requestAnimationFrame(() => {
//       this.requestAnimationFrame();
//       if (this.camera && this.size && this.map && this.gameplayUi) {
//         this.paintMapService.paintTileExtras(this.ctx);
//       }
//     });
//   }
//
//   unsubscribeFromData() {
//     // this.subscriptions.forEach(s => s.unsubscribe());
//   }
//
//   cancelAnimationFrame() {
//     // window.cancelAnimationFrame(this.animationFrameId);
//   }
//
//   // EVENTS
//
//   onCanvasMousedown(event: MouseEvent) {
//     // this.dragStartCoords = {x: event.pageX, y: event.pageY};
//     // this.dragStartOffset = {x: this.camera.translate.x, y: this.camera.translate.y};
//     // this.isDragging = true;
//   }
//
//   onCanvasMouseup() {
//     // this.isDragging = false;
//   }
//
//   onCanvasMousemove(event: MouseEvent) {
//     // if (!this.isDragging) { return; }
//     //
//     // // new translate without normalization
//     // let translate = {
//     //   x: this.dragStartOffset.x + event.pageX - this.dragStartCoords.x,
//     //   y: this.dragStartOffset.y + event.pageY - this.dragStartCoords.y
//     // }
//     //
//     // // normalize and set
//     // translate = this.cameraService.normalizeVerticalTranslation(translate);
//     // translate = this.cameraService.normalizeHorizontalTranslation(translate);
//     // this.cameraStore.setTranslate(translate);
//   }
//
//   onCanvasClick(event: MouseEvent) {
//     // const tile = this.tileUiService.mouseEventToTile(event);
//     //
//     // if (this.ui.sidebar === SidebarId.WORLD_BUILDER) {
//     //   this.worldBuilderService.handleTileClick(tile);
//     // }
//   }
//
//   onCanvasContextmenu(event: MouseEvent) {
//     // const tile = this.tileUiService.mouseEventToTile(event);
//     //
//     // if (this.ui.sidebar === SidebarId.WORLD_BUILDER) {
//     //   this.worldBuilderService.handleTileContextmenu(tile);
//     // }
//   }
//
//   onCanvasWheel(event: WheelEvent) {
//     // this.mapZoomService.handleWheelEvent(event);
//   }
//
//   // OTHER
//
// }
