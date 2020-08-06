import {Component, HostListener, ViewEncapsulation} from '@angular/core';

import {GameMap, GameMapTile} from '../../../../../models/game-map/game-map';
import {Camera} from '../../../../../models/camera/camera';
import {Coords} from '../../../../../models/utils/coords';
import {Step} from '../../../../../models/utils/step';
import {SidebarId, Ui, TileOverlayId} from '../../../../../models/ui/ui';

import {CameraStore} from '../../../../../stores/camera.store';
import {GameMapStore} from '../../../../../stores/game-map.store';
import {UiStore} from '../../../../../stores/ui.store';

@Component({
  selector: '.strategic-view-component',
  templateUrl: './strategic-view.component.html',
  styleUrls: ['strategic-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StrategicViewComponent {

  TileOverlayId = TileOverlayId;

  gameMap: GameMap = null;
  camera: Camera = null;
  ui: Ui;

  dragStartCoords: Coords = null;  // Page x, y when mouse was pressed down
  dragStartOffset: Coords = null;  // Map element x, y when mouse was pressed down

  isDragging = false;
  dragHandler: Function;

  constructor(
    private gameMapStoreService: GameMapStore,
    private cameraStore: CameraStore,
    private uiStore: UiStore
  ) {}

  subscribeToData() {
    this.gameMapStoreService.gameMap.subscribe(gameMap => this.gameMap = gameMap);
    this.cameraStore.camera.subscribe(camera => this.camera = camera);
    this.uiStore.ui.subscribe(ui => this.ui = ui);
  }

  ngOnInit() {
    this.subscribeToData();
  }

  get gameMapElemStyle(): Record<string, string> {
    return {transform: `translate(${this.camera.translate.x}px, ${this.camera.translate.y}px`};
  }

  startDrag(event: MouseEvent) {
    this.dragStartCoords = {x: event.pageX, y: event.pageY};
    this.dragStartOffset = {x: this.camera.translate.x, y: this.camera.translate.y};

    // Need to store drag handler since .bind(this) changes the reference
    this.isDragging = true;
    this.dragHandler = this.continueDrag.bind(this);
    document.addEventListener('mousemove', this.dragHandler as any);
  }

  continueDrag(event: MouseEvent): any {
    this.cameraStore.setTranslate({
      x: this.dragStartOffset.x + event.pageX - this.dragStartCoords.x,
      y: this.dragStartOffset.y + event.pageY - this.dragStartCoords.y,
      z: 0
    });
  }

  stopDrag() {
    this.isDragging = false;
    document.removeEventListener('mousemove', this.dragHandler as any);
  }

  changeZoomLevel(event: WheelEvent) {
    const step = (Math.abs(event.deltaY) / event.deltaY);
    let newZoomLevel = this.camera.zoomLevel - step;
    this.cameraStore.setZoomLevel(newZoomLevel);
  }

  manipulateTile(event: WheelEvent, tile: GameMapTile) {
    const step = (Math.abs(event.deltaY) / event.deltaY) as Step;
    const shift = event.shiftKey;
    const ctrl = event.ctrlKey;
    const alt = event.altKey;
    if (shift && !ctrl && !alt) { this.gameMapStoreService.cycleTileTerrainBase(tile, step); }
    if (shift && ctrl && !alt) { this.gameMapStoreService.cycleTileTerrainFeature(tile, step); }
    if (shift && !ctrl && alt) { this.gameMapStoreService.cycleTileTerrainResource(tile, step); }
    if (!shift && ctrl && alt) { this.gameMapStoreService.cycleTileTerrainImprovement(tile, step); }
    if (shift && ctrl && alt) { this.gameMapStoreService.randomizeTileTerrain(tile); }
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    if (this.isDragging) { this.stopDrag(); }  // Unfortunately sometimes dragging is not disabled properly
    if (event.button === 0) {
      this.startDrag(event)
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    if (event.button === 0) {
      this.stopDrag()
    }
  }

  onTileWheel(event: WheelEvent, tile: GameMapTile) {
    if (this.ui.sidebar === SidebarId.DEV_TOOLS && (event.shiftKey || event.ctrlKey || event.altKey)) {
      this.manipulateTile(event, tile)
    } else {
      this.changeZoomLevel(event)
    }
  }

}
