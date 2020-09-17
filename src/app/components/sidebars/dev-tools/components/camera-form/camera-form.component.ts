import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';

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
export class CameraFormComponent implements OnInit, OnDestroy {

  camera: Camera;

  CAMERA_MIN_ZOOM_LEVEL = CAMERA_MIN_ZOOM_LEVEL;
  CAMERA_MAX_ZOOM_LEVEL = CAMERA_MAX_ZOOM_LEVEL;

  CAMERA_MIN_TILE_SIZE = CAMERA_MIN_TILE_SIZE;
  CAMERA_MAX_TILE_SIZE = CAMERA_MAX_TILE_SIZE;

  CAMERA_TILE_SIZE_STEP = CAMERA_TILE_SIZE_STEP;

  subscriptions: Subscription[] = [];

  constructor(
    private cameraStore: CameraStore
  ) {}

  ngOnInit() {
    this.subscribeToData();
  }

  ngOnDestroy() {
    this.unsubscribeFromData();
  }

  subscribeToData() {
    this.subscriptions.push(
      this.cameraStore.camera.subscribe(camera => this.camera = camera)
    );
  }

  unsubscribeFromData() {
    this.subscriptions.forEach(s => s.unsubscribe());
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
