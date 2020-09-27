import {Injectable} from '@angular/core';

import {Map} from '../models/map';
import {Camera} from '../models/camera';
import {FullSize, HalfSize, QuarterSize} from '../models/size';

import {MapStore} from '../stores/map.store';
import {CameraStore} from '../stores/camera.store';
import {SizeStore} from '../stores/size.store';
import {Coords} from '../models/utils';

@Injectable({providedIn: 'root'})
export class SizeService {

  camera: Camera;
  map: Map;

  constructor(
    private cameraStore: CameraStore,
    private mapStore: MapStore,
    private sizeStore: SizeStore,
    private window: Window,
  ) {
    this.subscribeToData();
    this.initWindowResizeEvent();
    this.updateViewport();
  }

  private subscribeToData(): void {
    this.cameraStore.camera.subscribe(camera => this.onCameraNext(camera));
    this.mapStore.map.subscribe(map => this.onMapNext(map));
  }

  private onCameraNext(camera: Camera): void {
    this.camera = camera;
    this.updateAll();
  }

  private onMapNext(map: Map): void {
    this.map = map;
    this.updateAll();
  }

  private initWindowResizeEvent(): void {
    window.addEventListener('resize', () => {
      this.updateViewport();
    });
  }

  private calcTile(): FullSize & HalfSize & QuarterSize {
    return {
      width: Math.floor(this.camera.tileSize * 0.9),
      height: Math.floor(this.camera.tileSize),
      halfWidth: Math.floor(this.camera.tileSize * 0.9 * 0.50),
      halfHeight: Math.floor(this.camera.tileSize * 0.50),
      oneQuarterWidth: Math.floor(this.camera.tileSize * 0.9 * 0.25),
      oneQuarterHeight: Math.floor(this.camera.tileSize * 0.25),
      threeQuarterWidth: Math.floor(this.camera.tileSize * 0.9 * 0.75),
      threeQuarterHeight: Math.floor(this.camera.tileSize * 0.75)
    }
  }

  private calcRow(tile: FullSize & HalfSize): FullSize {
    return {
      width: tile.width * this.map.width,
      height: Math.floor(tile.height * 0.75) - 1
    }
  }

  private calcMap(tile: FullSize & HalfSize, row: FullSize): FullSize {
    return {
      width: (tile.width * this.map.width) + tile.halfWidth,
      height: (row.height * this.map.height) + Math.floor(tile.height * 0.25) + 1  // this.map.height is 1-based, need -1
    }
  }

  private calcViewport(): FullSize & HalfSize {
    return {
      width: this.window.innerWidth,
      height: this.window.innerHeight,
      halfWidth: Math.floor(this.window.innerWidth / 2),
      halfHeight: Math.floor(this.window.innerHeight / 2)
    }
  }

  private calcVertices(tile: FullSize & HalfSize & QuarterSize): Coords[] {
    return [
      { x: tile.halfWidth, y: 0 },
      { x: tile.width, y: tile.oneQuarterHeight },
      { x: tile.width, y: tile.threeQuarterHeight },
      { x: tile.halfWidth, y: tile.height },
      { x: 0, y: tile.threeQuarterHeight },
      { x: 0, y: tile.oneQuarterHeight }
    ];
  }

  private updateViewport(): void {
    const viewport = this.calcViewport();
    this.sizeStore.setViewportSize(viewport);
  }

  private updateAll(): void {
    if (this.camera && this.map) {

      const tile = this.calcTile();
      const row = this.calcRow(tile);
      const map = this.calcMap(tile, row);
      const viewport = this.calcViewport();
      const vertices = this.calcVertices(tile);

      this.sizeStore.next({ tile, row, map, viewport, vertices });
    }
  }

}
