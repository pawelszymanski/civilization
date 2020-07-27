import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import {Camera} from '../models/camera';
import {Coords3d} from '../models/coords';

import {
  CAMERA_MAX_ZOOM_LEVEL,
  CAMERA_MIN_ZOOM_LEVEL,
  CAMERA_ZOOM_LEVEL_TO_TILE_SIZE_MAP,
  DEFAULT_CAMERA
} from '../consts/camera.const';

@Injectable()
export class CameraStore {

  private _camera: BehaviorSubject<Camera> = new BehaviorSubject(DEFAULT_CAMERA);

  public readonly camera: Observable<Camera> = this._camera.asObservable();

  constructor() {
    this.updateTileSizeCssVariable();
  }

  private updateTileSizeCssVariable() {
    document.documentElement.style.setProperty('--tile-size', `${this._camera.value.tileSize}px`);
  }

  private next(camera: Camera) {
    this._camera.next(camera);
    this.updateTileSizeCssVariable();
  }

  public setTileSize(tileSize: number) {
    this.next({...this._camera.value, tileSize});
  }

  public setTranslate(translate: Coords3d) {
    this.next({...this._camera.value, translate});
  }

  public setPerspective(perspective: number) {
    this.next({...this._camera.value, perspective});
  }

  public setRotate(rotate: Coords3d) {
    this.next({...this._camera.value, rotate});
  }

  public resetAll() {
    this.next({...DEFAULT_CAMERA});
  }


  // CAMERA CALCULATIONS
  public setZoomLevel(zoomLevel: number) {
    zoomLevel = this.normalizeZoomLevel(zoomLevel);

    this.next({
      zoomLevel: this.normalizeZoomLevel(zoomLevel),
      tileSize: this.calcTileSize(zoomLevel),
      translate: this.calcTranslate(zoomLevel),
      perspective: this.calcPerspective(zoomLevel),
      rotate: this.calcRotate(zoomLevel),
    })
  }

  public normalizeZoomLevel(zoomLevel: number): number {
    if (zoomLevel > CAMERA_MAX_ZOOM_LEVEL) { zoomLevel = CAMERA_MAX_ZOOM_LEVEL }
    if (zoomLevel < CAMERA_MIN_ZOOM_LEVEL) { zoomLevel = CAMERA_MIN_ZOOM_LEVEL }
    return zoomLevel;
  }

  private calcTileSize(zoomLevel: number): number {
    return CAMERA_ZOOM_LEVEL_TO_TILE_SIZE_MAP[zoomLevel];
  }

  private calcTranslate(zoomLevel: number): Coords3d {
    return this._camera.value.translate;
  }

  private calcPerspective(zoomLevel: number): number {
    return this._camera.value.perspective;
  }

  private calcRotate(zoomLevel: number): Coords3d {
    return this._camera.value.rotate;
  }

}
