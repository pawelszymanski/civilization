import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import {Camera} from '../models/camera';
import {Coords} from '../models/utils';

import {CAMERA_ZOOM_LEVEL_TO_TILE_SIZE_MAP, DEFAULT_CAMERA} from '../consts/camera.const';

@Injectable()
export class CameraStore {

  readonly TILE_SIZE_CSS_VAR_NAME = '--tile-size';

  private _camera: BehaviorSubject<Camera> = new BehaviorSubject(DEFAULT_CAMERA);

  public readonly camera: Observable<Camera> = this._camera.asObservable();

  constructor() {
    this.setTileSizeCssVariable();
  }

  private setTileSizeCssVariable() {
    document.documentElement.style.setProperty(this.TILE_SIZE_CSS_VAR_NAME, `${this._camera.value.tileSize}px`);
  }

  public next(camera: Camera) {
    this._camera.next(camera);
    this.setTileSizeCssVariable();
  }

  public setTileSize(tileSize: number) {
    this.next({...this._camera.value, tileSize});
  }

  public setTranslate(translate: Coords) {
    this.next({...this._camera.value, translate});
  }

  public setZoomLevel(zoomLevel: number) {
    this.next({...this._camera.value, zoomLevel, tileSize: CAMERA_ZOOM_LEVEL_TO_TILE_SIZE_MAP[zoomLevel]});
  }

  public resetAll() {
    this.next({...DEFAULT_CAMERA});
  }

}
