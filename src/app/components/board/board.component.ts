import {Component, HostListener} from '@angular/core';

import {Board} from '../../models/board';
import {Camera} from '../../models/camera';
import {Coords} from '../../models/coords';

import {BoardStore} from '../../stores/board.store';
import {CameraStore} from '../../stores/camera.store';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.sass']
})
export class BoardComponent {

  board: Board = null;
  camera: Camera = null;

  dragStartCoords: Coords = null;  // Page x, y when mouse was pressed down
  dragStartOffset: Coords = null;  // Map element x, y when mouse was pressed down
  isDragging = false;

  constructor(
    private boardStoreService: BoardStore,
    private cameraStore: CameraStore
  ) {}

  ngOnInit() {
    this.boardStoreService.board.subscribe(board => this.board = board);
    this.cameraStore.camera.subscribe(camera => this.camera = camera);
  }

  get viewportElemStyle(): {[key:string]: string} {
    return {perspective: this.camera.perspective + 'px'};
  }

  get mapElemStyle(): {[key:string]: string} {
    return {
      transition: this.isDragging ? 'none' : 'all .08s linear',
      transform: `rotateX(${this.camera.rotateX}deg) scale(${this.camera.scale})`,
      left: this.camera.offset.x + 'px',
      top: this.camera.offset.y + 'px'
    };
  }

  @HostListener('wheel', ['$event.deltaY'])
  onWheel(deltaY: number) {
    let newZoomLevel = this.camera.zoomLevel - (Math.abs(deltaY) / deltaY);
    this.cameraStore.setZoomLevel(newZoomLevel);
  }

  @HostListener('mousedown', ['$event'])
  startDrag(event: MouseEvent) {
    if (event.button === 0) {
      this.dragStartCoords = {x: event.pageX, y: event.pageY};
      this.dragStartOffset = {x: this.camera.offset.x, y: this.camera.offset.y};
      this.isDragging = true;
    }
  }

  @HostListener('mousemove', ['$event'])
  drag(event: MouseEvent) {
    if (this.isDragging) {
      this.cameraStore.setOffset({
        x: this.dragStartOffset.x + event.pageX - this.dragStartCoords.x,
        y: this.dragStartOffset.y + event.pageY - this.dragStartCoords.y
      });
    }
  }

  @HostListener('mouseup', ['$event'])
  @HostListener('mouseleave', ['$event'])
  stopDrag(event: MouseEvent) {
    this.isDragging = false;
  }

}
