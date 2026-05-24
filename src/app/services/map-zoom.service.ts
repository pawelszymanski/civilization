import { Injectable } from '@angular/core';

import { Coords, Step } from '../models/utils';
import { Camera } from '../models/camera';
import { Size } from '../models/size';

import { TileYieldService } from './tile-yield.service';
import { CameraService } from './camera.service';

import { CameraStore } from '../stores/camera.store';
import { SizeStore } from '../stores/size.store';

@Injectable({ providedIn: 'root' })
export class MapZoomService {
  camera: Camera;
  size: Size;

  // Fractional part of the translation discarded by Math.round on the previous zoom step.
  // Carried forward and re-applied to restore sub-pixel canvas precision next step.
  // Reset to zero when the translation is moved externally (e.g. by dragging).
  private compensation: Coords = { x: 0, y: 0 };
  private lastRoundedTranslate: Coords | null = null;

  constructor(
    private cameraService: CameraService,
    private tileYieldService: TileYieldService,
    private cameraStore: CameraStore,
    private sizeStore: SizeStore
  ) {
    this.subscribeToData();
  }

  private subscribeToData(): void {
    this.cameraStore.camera.subscribe(camera => (this.camera = camera));
    this.sizeStore.size.subscribe(size => (this.size = size));
  }

  // +1 for zooming in (roll forward), -1 for zooming out (roll backward)
  private wheelEventToStep(wheelEvent: WheelEvent): Step {
    return -(Math.abs(wheelEvent.deltaY) / wheelEvent.deltaY) as Step;
  }

  public handleWheelEvent(event: WheelEvent): void {
    // calculate new zoom level
    const step = this.wheelEventToStep(event);
    const currentZoomLevel = this.camera.zoomLevel;
    const newZoomLevel = this.cameraService.normalizeZoomLevel(currentZoomLevel + step);
    if (newZoomLevel === currentZoomLevel) {
      return;
    }

    // calculate new translate
    const currentTranslate = this.camera.translate;
    const screenCenterX = this.size.screen.width / 2;
    const screenCenterY = this.size.screen.height / 2;

    // Re-apply the compensation saved from the previous zoom step to recover the sub-pixel
    // canvas position that was discarded by rounding. Skip it if the translation has changed
    // since then (e.g. the user dragged), because the saved value belongs to the old position.
    const last = this.lastRoundedTranslate;
    const translateChangedSinceLastZoom = !last || currentTranslate.x !== last.x || currentTranslate.y !== last.y;
    const prevCompensation: Coords = translateChangedSinceLastZoom ? { x: 0, y: 0 } : this.compensation;

    // Canvas coordinate = pixel offset from the map's top-left corner.
    // Adding prevCompensation recovers the true sub-pixel offset before we scale it.
    const canvasCoordsAtScreenCenter: Coords = {
      x: screenCenterX - (currentTranslate.x + prevCompensation.x),
      y: screenCenterY - (currentTranslate.y + prevCompensation.y),
    };

    // Capture per-axis dimensions before setZoomLevel updates this.size.
    // X scales by tileWidth (= tileSize * 0.9, exact for all zoom-level tile sizes).
    // Y must use rowHeight (= tileSize * 0.75 − 1), not tileSize directly — the −1 offset
    // breaks the proportionality: rowHeight_new / rowHeight_old ≠ tileSize_new / tileSize_old.
    const oldTileWidth = this.size.tile.width;
    const oldRowHeight = this.size.row.height;

    // Calling setZoomLevel synchronously propagates through SizeService → SizeStore,
    // so this.size already reflects the new tile dimensions by the time we read it below.
    this.cameraStore.setZoomLevel(newZoomLevel);

    // Scale the canvas center point by the exact per-axis ratio to find where it lands
    // after zoom, then solve for the translation that puts it back at the screen center.
    const exactTranslate: Coords = {
      x: -(canvasCoordsAtScreenCenter.x * (this.size.tile.width / oldTileWidth) - screenCenterX),
      y: -(canvasCoordsAtScreenCenter.y * (this.size.row.height / oldRowHeight) - screenCenterY),
    };

    // Round to integer pixels for CSS positioning.
    // Save the discarded remainder so the next zoom step can restore precision before scaling —
    // error diffusion: the rounding error is fed back in rather than allowed to accumulate.
    const roundedTranslate: Coords = { x: Math.round(exactTranslate.x), y: Math.round(exactTranslate.y) };
    this.compensation = { x: exactTranslate.x - roundedTranslate.x, y: exactTranslate.y - roundedTranslate.y };
    this.lastRoundedTranslate = { ...roundedTranslate };

    this.cameraStore.setTranslate(roundedTranslate);
  }
}
