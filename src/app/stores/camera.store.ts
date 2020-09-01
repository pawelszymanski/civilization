import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import {Camera} from '../models/camera/camera';
import {Coords} from '../models/utils/coords';

import {CAMERA_ZOOM_LEVEL_TO_TILE_SIZE_MAP, DEFAULT_CAMERA} from '../consts/camera/camera.const';

import {CameraHelperService} from '../services/camera/camera-helper.service';

@Injectable()
export class CameraStore {

  private _camera: BehaviorSubject<Camera> = new BehaviorSubject(DEFAULT_CAMERA);

  public readonly camera: Observable<Camera> = this._camera.asObservable();

  constructor(
    private cameraHelperService: CameraHelperService
  ) {
    this.cameraHelperService.setTileSizeCssVariable(DEFAULT_CAMERA.tileSize);
  }

  public next(camera: Camera) {
    this._camera.next(camera);
    this.cameraHelperService.setTileSizeCssVariable(camera.tileSize);
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
