import {Injectable} from '@angular/core';

import {Coords, Step} from '../models/utils';
import {Camera} from '../models/camera';
import {Size} from '../models/size';

import {CAMERA_ZOOM_LEVEL_TO_TILE_SIZE_MAP} from '../consts/camera.const';

import {TileYieldService} from './tile-yield.service';
import {CameraService} from './camera.service';

import {CameraStore} from '../stores/camera.store';
import {SizeStore} from '../stores/size.store';

@Injectable({providedIn: 'root'})
export class MapZoomService {

  camera: Camera;
  size: Size;

  constructor(
    private cameraService: CameraService,
    private tileYieldService: TileYieldService,
    private cameraStore: CameraStore,
    private sizeStore: SizeStore,
  ) {
    this.subscribeToData();
  }

  private subscribeToData(): void {
    this.cameraStore.camera.subscribe(camera => this.camera = camera);
    this.sizeStore.size.subscribe(size => this.size = size);
  }

  // +1 for zooming in (roll forward), -1 for zooming out (roll backward)
  private wheelEventToStep(wheelEvent: WheelEvent): Step {
    return -(Math.abs(wheelEvent.deltaY) / wheelEvent.deltaY) as Step;
  }

  public handleWheelEvent(event: WheelEvent) {
    // calculate new zoom level
    const step = this.wheelEventToStep(event);
    const currentZoomLevel = this.camera.zoomLevel;
    const newZoomLevel = this.cameraService.normalizeZoomLevel(currentZoomLevel + step);
    if (newZoomLevel === currentZoomLevel) { return; }

    // calculate new translate
    const currentTranslate = this.camera.translate;
    const canvasCoordsAtScreenCenter = {
      x: Math.floor((this.size.screen.width / 2) - currentTranslate.x),
      y: Math.floor((this.size.screen.height / 2) - currentTranslate.y)
    };

    const scale = CAMERA_ZOOM_LEVEL_TO_TILE_SIZE_MAP[newZoomLevel] / CAMERA_ZOOM_LEVEL_TO_TILE_SIZE_MAP[currentZoomLevel];

    // set zoom level first so it can used in normalization of the translation
    this.cameraStore.setZoomLevel(newZoomLevel);

    // calculate new translate, normalize then set it
    const newTranslate: Coords = {
      x: -Math.round((canvasCoordsAtScreenCenter.x * scale) - (this.size.screen.width / 2)),
      y: -Math.round((canvasCoordsAtScreenCenter.y * scale) - (this.size.screen.height / 2))
    }
    const normalizedTranslate = this.cameraService.normalizeTranslation(newTranslate);
    this.cameraStore.setTranslate(normalizedTranslate);
  }

}



