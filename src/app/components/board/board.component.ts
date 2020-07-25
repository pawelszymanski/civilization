import {Component, HostListener, ViewEncapsulation} from '@angular/core';

import {Board, BoardTile} from '../../models/board';
import {Camera} from '../../models/camera';
import {Coords} from '../../models/coords';
import {Ui} from '../../models/ui';

import {BoardStore} from '../../stores/board.store';
import {CameraStore} from '../../stores/camera.store';
import {UiStore} from '../../stores/ui.store';
import {TERRAIN_BASE_ID_LENGTH, TERRAIN_FEATURE_ID_LENGTH, TERRAIN_RESOURCE_ID_LENGTH, TERRAIN_IMPROVEMENT_ID_LENGTH} from '../../models/terrain';
import {Step} from '../../models/step';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class BoardComponent {

  board: Board = null;
  camera: Camera = null;
  ui: Ui;

  dragStartCoords: Coords = null;  // Page x, y when mouse was pressed down
  dragStartOffset: Coords = null;  // Map element x, y when mouse was pressed down

  isDragging = false;
  dragHandler: Function;

  constructor(
    private boardStoreService: BoardStore,
    private cameraStore: CameraStore,
    private uiStore: UiStore
  ) {}

  subscribeToData() {
    this.boardStoreService.board.subscribe(board => this.board = board);
    this.cameraStore.camera.subscribe(camera => this.camera = camera);
    this.uiStore.ui.subscribe(ui => this.ui = ui);
  }

  ngOnInit() {
    this.subscribeToData();
  }

  get viewportElemStyle(): Record<string, string> {
    return {perspective: this.camera.perspective + 'px'};
  }

  get boardElemStyle(): Record<string, string> {
    return {
      transition: this.isDragging ? 'none' : 'all .08s linear',
      transform: `rotateX(${this.camera.rotateX}deg) scale(${this.camera.scale})`,
      left: this.camera.offset.x + 'px',
      top: this.camera.offset.y + 'px'
    };
  }

  startDrag(event: MouseEvent) {
    this.dragStartCoords = {x: event.pageX, y: event.pageY};
    this.dragStartOffset = {x: this.camera.offset.x, y: this.camera.offset.y};

    // Need to store drag handler since .bind(this) changes the reference
    this.isDragging = true;
    this.dragHandler = this.continueDrag.bind(this);
    document.addEventListener('mousemove', this.dragHandler as any);
  }

  continueDrag(event: MouseEvent): any {
    this.cameraStore.setOffset({
      x: this.dragStartOffset.x + event.pageX - this.dragStartCoords.x,
      y: this.dragStartOffset.y + event.pageY - this.dragStartCoords.y
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

  manipulateTile(event: WheelEvent, tile: BoardTile) {
    const step = (Math.abs(event.deltaY) / event.deltaY) as Step;
    if (event.shiftKey && !event.ctrlKey) { this.boardStoreService.cycleTileTerrainBase(tile, step); }
    if (event.ctrlKey && !event.shiftKey) { this.boardStoreService.cycleTileTerrainFeature(tile, step); }
    if (event.shiftKey && event.ctrlKey)  { this.boardStoreService.cycleTileTerrainResource(tile, step); }
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
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

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    if (!this.ui.devTools) {
      this.changeZoomLevel(event)
    }
  }

  onTileWheel(event: WheelEvent, tile: BoardTile) {
    if (this.ui.devTools && (event.shiftKey || event.ctrlKey)) {
      this.manipulateTile(event, tile)
    } else {
      this.changeZoomLevel(event)
    }
  }

}
