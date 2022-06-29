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

  ngOnInit(): void {
    this.subscribeToData();
  }

  ngOnDestroy(): void {
    this.unsubscribeFromData();
  }

  subscribeToData(): void {
    this.subscriptions.push(
      this.cameraStore.camera.subscribe(camera => this.camera = camera)
    );
  }

  unsubscribeFromData(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onZoomLevelChange(zoomLevel: number): void {
    this.cameraStore.setZoomLevel(zoomLevel);
  }

  onTileSizeChange(tileSize: number): void {
    this.cameraStore.setTileSize(tileSize);
  }

  onTranslateXChange(translateX: number): void {
    this.cameraStore.setTranslate({ ...this.camera.translate, x: translateX });
  }

  onTranslateYChange(translateY: number): void {
    this.cameraStore.setTranslate({ ...this.camera.translate, y: translateY });
  }

  onResetCameraClick(): void {
    this.cameraStore.resetAll();
  }

}
