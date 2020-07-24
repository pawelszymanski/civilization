import {Component} from '@angular/core';

import {Camera} from '../../models/camera';

import {CameraStore} from '../../stores/camera.store';

@Component({
  selector: 'dev-tools-camera-controller',
  templateUrl: './dev-tools-camera-controller.component.html'
})
export class DevToolsCameraControllerComponent {

  camera: Camera;

  constructor(
    private cameraStore: CameraStore
  ) {}

  ngOnInit() {
    this.cameraStore.camera.subscribe(camera => this.camera = camera);
  }

  onTileSizeChange(tileSize: number) {
    this.cameraStore.setTileSize(tileSize);
  }

  onPerspectiveChange(perspective: number) {
    this.cameraStore.setPerspective(perspective);
  }

  onRotateXChange(rotateX: number) {
    this.cameraStore.setRotateX(rotateX);
  }

  onScaleChange(scale: number) {
    this.cameraStore.setScale(scale);
  }

  onResetCameraClick() {
    this.cameraStore.resetAll();
  }

}
