import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Camera } from '../../../../../models/camera';

import {
  CAMERA_MIN_ZOOM_LEVEL,
  CAMERA_MAX_ZOOM_LEVEL,
  CAMERA_MIN_TILE_SIZE,
  CAMERA_MAX_TILE_SIZE,
  CAMERA_TILE_SIZE_STEP,
} from '../../../../../consts/camera.const';

import { CameraStore } from '../../../../../stores/camera.store';

@Component({
  standalone: false,
  selector: '.camera-form-component',
  templateUrl: './camera-form.component.html',
  styleUrls: ['../dev-tools-form.scss'],
})
export class CameraFormComponent implements OnInit {
  camera: Camera;

  CAMERA_MIN_ZOOM_LEVEL = CAMERA_MIN_ZOOM_LEVEL;
  CAMERA_MAX_ZOOM_LEVEL = CAMERA_MAX_ZOOM_LEVEL;

  CAMERA_MIN_TILE_SIZE = CAMERA_MIN_TILE_SIZE;
  CAMERA_MAX_TILE_SIZE = CAMERA_MAX_TILE_SIZE;

  CAMERA_TILE_SIZE_STEP = CAMERA_TILE_SIZE_STEP;

  constructor(
    private destroyRef: DestroyRef,
    private cameraStore: CameraStore
  ) {}

  ngOnInit(): void {
    this.subscribeToData();
  }

  subscribeToData(): void {
    this.cameraStore.camera.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(camera => (this.camera = camera));
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
