import {Component} from '@angular/core';

import {Camera} from '../../../../../../models/camera/camera';

import {
  CAMERA_MIN_ZOOM_LEVEL,
  CAMERA_MAX_ZOOM_LEVEL,
  CAMERA_MIN_TILE_SIZE,
  CAMERA_MAX_TILE_SIZE,
  CAMERA_TILE_SIZE_STEP
} from '../../../../../../consts/camera/camera.const';

import {CameraStore} from '../../../../../../stores/camera.store';

@Component({
  selector: 'camera-form',
  templateUrl: './camera-form.component.html'
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

  onTranslateZChange(translateZ: number) {
    this.cameraStore.setTranslate({ ...this.camera.translate, z: translateZ });
  }

  onPerspectiveChange(perspective: number) {
    this.cameraStore.setPerspective(perspective);
  }

  onRotateXChange(rotateX: number) {
    this.cameraStore.setRotate({ ...this.camera.rotate, x: rotateX });
  }

  onRotateYChange(rotateY: number) {
    this.cameraStore.setRotate({ ...this.camera.rotate, y: rotateY });
  }

  onRotateZChange(rotateZ: number) {
    this.cameraStore.setRotate({ ...this.camera.rotate, z: rotateZ });
  }

  onResetCameraClick() {
    this.cameraStore.resetAll();
  }

}
