import {Component} from '@angular/core';

import {Camera} from '../../../../../models/camera';

import {
  CAMERA_MIN_ZOOM_LEVEL,
  CAMERA_MAX_ZOOM_LEVEL,
  CAMERA_MIN_TILE_SIZE,
  CAMERA_MAX_TILE_SIZE,
  CAMERA_TILE_SIZE_STEP
} from '../../../../../consts/camera.const';

import {CameraStore} from '../../../../../stores/camera.store';

@Component({
  selector: '.camera-form-component',
  templateUrl: './camera-form.component.html',
  styleUrls: ['../dev-tools-form.scss']
})
export class CameraFormComponent {

  camera: Camera;

  CAMERA_MIN_ZOOM_LEVEL = CAMERA_MIN_ZOOM_LEVEL;
  CAMERA_MAX_ZOOM_LEVEL = CAMERA_MAX_ZOOM_LEVEL;

  CAMERA_MIN_TILE_SIZE = CAMERA_MIN_TILE_SIZE;
  CAMERA_MAX_TILE_SIZE = CAMERA_MAX_TILE_SIZE;

  CAMERA_TILE_SIZE_STEP = CAMERA_TILE_SIZE_STEP;

  constructor(
    private cameraStore: CameraStore
  ) {}

  ngOnInit() {
    this.cameraStore.camera.subscribe(camera => this.camera = camera);
  }

  onZoomLevelChange(zoomLevel: number) {
    this.cameraStore.setZoomLevel(zoomLevel);
  }

  onTileSizeChange(tileSize: number) {
    this.cameraStore.setTileSize(tileSize);
  }

  onTranslateXChange(translateX: number) {
    this.cameraStore.setTranslate({ ...this.camera.translate, x: translateX });
  }

  onTranslateYChange(translateY: number) {
    this.cameraStore.setTranslate({ ...this.camera.translate, y: translateY });
  }

  onResetCameraClick() {
    this.cameraStore.resetAll();
  }

}