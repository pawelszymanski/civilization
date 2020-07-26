import {Component} from '@angular/core';

import {Camera} from '../../../models/camera';

import {CameraStore} from '../../../stores/camera.store';

@Component({
  selector: 'camera-form',
  templateUrl: './camera-form.component.html'
})
export class CameraFormComponent {

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
