import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import {Camera} from '../models/camera';
import {Coords} from '../models/coords';

@Injectable()
export class CameraStore {

  readonly MAX_ZOOM_LEVEL = 5;
  readonly MIN_ZOOM_LEVEL = -5;

  readonly DEFAULT_CAMERA: Camera = {
    zoomLevel: -2,
    tileSize: 140,
    perspective: 1000,
    rotateX: 0,
    scale: 1,
    offset: {
      x: 0,
      y: 0
    }
  }

  private _camera: BehaviorSubject<Camera> = new BehaviorSubject(this.DEFAULT_CAMERA);

  public readonly camera: Observable<Camera> = this._camera.asObservable();

  constructor() {
    this.setCssVariables();
  }

  private setCssVariables() {
    document.documentElement.style.setProperty('--tile-size', `${this._camera.value.tileSize}px`);
  }

  private next(camera: Camera) {
    this._camera.next(camera);
    this.setCssVariables();
  }

  public setTileSize(tileSize: number) {
    this.next({...this._camera.value, tileSize});
  }

  public setPerspective(perspective: number) {
    this.next({...this._camera.value, perspective});
  }

  public setRotateX(rotateX: number) {
    this.next({...this._camera.value, rotateX});
  }

  public setScale(scale: number) {
    this.next({...this._camera.value, scale});
  }

  public resetAll() {
    this.next({...this.DEFAULT_CAMERA});
  }

  private calcTileSize(zoomLevel: number): number {
    if (zoomLevel === -5) { return 40; }
    if (zoomLevel === -4) { return 60; }
    if (zoomLevel === -3) { return 80; }
    if (zoomLevel === -2) { return 100; }
    if (zoomLevel === -1) { return 120; }
    if (zoomLevel === -0) { return 140; }
    if (zoomLevel === 1) { return 160; }
    if (zoomLevel === 2) { return 180; }
    if (zoomLevel === 3) { return 200; }
    if (zoomLevel === 4) { return 240; }
    if (zoomLevel === 5) { return 300; }
  }

  private calcPerspective(zoomLevel: number): number {
    // if (zoomLevel <= 0) { return 1000 }
    // if (zoomLevel > 0) { return 1000 - zoomLevel * 40 }
    return 1000;
  }

  private calcRotateX(zoomLevel: number): number {
    // if (zoomLevel <= 0) { return 0 }
    // if (zoomLevel > 0) { return zoomLevel * 4 }
    return 0;
  }

  private calcScale(zoomLevel: number): number {
    // if (zoomLevel === 0) { return 1 }
    // if (zoomLevel < 0) { return 1 + zoomLevel * 0.05 }
    // if (zoomLevel > 0) { return 1 + zoomLevel * 0.2 }
    return 1;
  }

  public setZoomLevel(zoomLevel: number) {
    if (zoomLevel > this.MAX_ZOOM_LEVEL) { zoomLevel = this.MAX_ZOOM_LEVEL }
    if (zoomLevel < this.MIN_ZOOM_LEVEL) { zoomLevel = this.MIN_ZOOM_LEVEL }

    this.next({
      zoomLevel: zoomLevel,
      tileSize: this.calcTileSize(zoomLevel),
      perspective: this.calcPerspective(zoomLevel),
      rotateX: this.calcRotateX(zoomLevel),
      scale: this.calcScale(zoomLevel),
      offset: {
        x: this._camera.value.offset.x,
        y: this._camera.value.offset.y
      }
    })
  }

  public setOffset(offset: Coords) {
    this._camera.next({...this._camera.value, offset});
  }

}
