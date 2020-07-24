import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import {Camera} from '../models/camera';
import {Coords} from '../models/coords';

@Injectable()
export class CameraStore {

  readonly MAX_ZOOM_LEVEL = 10;
  readonly MIN_ZOOM_LEVEL = -10;

  readonly DEFAULT_CAMERA: Camera = {
    zoomLevel: 0,
    tileSize: 100,
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

  public setTileSize(tileSize: number) {
    this._camera.next({...this._camera.value, tileSize});
  }

  public setPerspective(perspective: number) {
    this._camera.next({...this._camera.value, perspective});
  }

  public setRotateX(rotateX: number) {
    this._camera.next({...this._camera.value, rotateX});
  }

  public setScale(scale: number) {
    this._camera.next({...this._camera.value, scale});
  }

  public resetAll() {
    this._camera.next({...this.DEFAULT_CAMERA});
  }

  private calcPerspective(zoomLevel: number): number {
    // if (zoomLevel <= 0) { return 1000 }
    // if (zoomLevel > 0) { return 1000 - zoomLevel * 40 }
    return 1000000;
  }

  private calcRotateX(zoomLevel: number): number {
    if (zoomLevel <= 0) { return 0 }
    if (zoomLevel > 0) { return zoomLevel * 4 }
    // return 0;
  }

  private calcScale(zoomLevel: number): number {
    if (zoomLevel === 0) { return 1 }
    if (zoomLevel < 0) { return 1 + zoomLevel * 0.05 }
    if (zoomLevel > 0) { return 1 + zoomLevel * 0.2 }
  }

  public setZoomLevel(zoomLevel: number) {
    if (zoomLevel > this.MAX_ZOOM_LEVEL) { zoomLevel = this.MAX_ZOOM_LEVEL }
    if (zoomLevel < this.MIN_ZOOM_LEVEL) { zoomLevel = this.MIN_ZOOM_LEVEL }

    this._camera.next({
      zoomLevel: zoomLevel,
      tileSize: this._camera.value.tileSize,
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
