import {Component, ElementRef, HostListener, ViewChild, ViewEncapsulation} from '@angular/core';
import {Subscription} from 'rxjs';

import {Camera} from '../../models/camera';
import {Coords} from '../../models/utils';
import {Map, Tile} from '../../models/map';
import {TerrainBaseId} from '../../models/terrain';
import {MapUi, TileInfoOverlayId} from '../../models/map-ui';

import {CAMERA_ZOOM_LEVEL_TO_TILE_SIZE_MAP} from '../../consts/camera.const';

import {CameraService} from '../../services/camera.service';
import {MouseService} from '../../services/mouse.service';
import {TileService} from '../../services/tile.service';

import {CameraStore} from '../../stores/camera.store';
import {MapStore} from '../../stores/map.store';
import {MapUiStore} from '../../stores/map-ui.store';

import {TerrainBaseNamePipe} from '../../pipes/terrain-base-name.pipe';
import {TerrainFeatureNamePipe} from '../../pipes/terrain-feature-name.pipe';
import {TerrainResourceNamePipe} from '../../pipes/terrain-resource-name.pipe';
import {TerrainImprovementNamePipe} from '../../pipes/terrain-improvement-name.pipe';

@Component({
  selector: '.map-component',
  templateUrl: './map.component.html',
  styleUrls: ['map.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MapComponent {

  readonly CANVAS = {
    width: 600,
    height: 400
  };

  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;

  ctx: CanvasRenderingContext2D;

  camera: Camera;
  map: Map;
  mapUi: MapUi;

  dragStartCoords: Coords;  // Page x, y when mouse was pressed down
  dragStartOffset: Coords;  // Map element x, y when mouse was pressed down
  isDragging = false;

  tileWidth: number;
  tileHeight: number;
  mapWidth: number;
  mapHeight: number;

  shallRedraw = false;      // Changed to true on data and window size changes, changed to false on redraw

  animationFrameId: number;

  subscriptions: Subscription[] = [];

  constructor(
    private cameraService: CameraService,
    private tileService: TileService,
    private mouseService: MouseService,
    private cameraStore: CameraStore,
    private mapStore: MapStore,
    private mapUiStore: MapUiStore,
    private terrainBaseNamePipe: TerrainBaseNamePipe,
    private terrainFeatureNamePipe: TerrainFeatureNamePipe,
    private terrainImprovementNamePipe: TerrainImprovementNamePipe,
    private terrainResourceNamePipe: TerrainResourceNamePipe,
  ) {}

  ngOnInit() {
    this.initContext();
    this.matchCanvasSizeToWindowSize();
    this.subscribeToData();
    this.requestAnimationFrame();
  }

  ngOnDestroy() {
    this.unsubscribeFromData();
    this.cancelAnimationFrame();
  }

  initContext() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
  }

  matchCanvasSizeToWindowSize() {
    this.CANVAS.width = window.innerWidth;
    this.CANVAS.height = window.innerHeight;
  }

  subscribeToData() {
    this.subscriptions.push(
      this.cameraStore.camera.subscribe(camera => this.onCameraNext(camera)),
      this.mapStore.map.subscribe(map => this.onMapNext(map)),
      this.mapUiStore.mapUi.subscribe(mapUi => this.onMapUiNext(mapUi))
    );
  }

  onCameraNext(camera: Camera) {
    this.camera = camera;
    this.checkIfToRedraw();
  }

  onMapNext(map: Map) {
    this.map = map;
    this.checkIfToRedraw();
  }

  onMapUiNext(mapUi: MapUi) {
    this.mapUi = mapUi;
    this.checkIfToRedraw();
  }

  checkIfToRedraw() {
    if (this.map) { this.shallRedraw = true; }
  }

  requestAnimationFrame() {
    this.animationFrameId = window.requestAnimationFrame(() => {
      this.requestAnimationFrame();
      if (this.shallRedraw) {
        this.fullRepaint();
        this.shallRedraw = false;
      }
    });
  }

  unsubscribeFromData() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  cancelAnimationFrame() {
    window.cancelAnimationFrame(this.animationFrameId);
  }

  // EVENTS

  @HostListener('window:resize')
  onWindowResize() {
    this.matchCanvasSizeToWindowSize();
    this.checkIfToRedraw();
  }

  onCanvasMouseup(event: MouseEvent) {
    this.isDragging = false;
  }

  onCanvasMousemove(event: MouseEvent) {
    if (!this.isDragging) { return; }

    // new translate without normalization
    let translate = {
      x: this.dragStartOffset.x + event.pageX - this.dragStartCoords.x,
      y: this.dragStartOffset.y + event.pageY - this.dragStartCoords.y
    }

    // normalize and set
    const normalizedTranslate = this.cameraService.normalizeVerticalTranslation(translate, this.CANVAS.height, this.mapHeight);
    this.cameraStore.setTranslate(normalizedTranslate);
  }

  onCanvasWheel(event: WheelEvent) {
    // calculate new zoom level
    const step = this.mouseService.wheelEventToStep(event);
    const currentZoomLevel = this.camera.zoomLevel;
    const newZoomLevel = this.cameraService.normalizeZoomLevel(currentZoomLevel + step);
    if (newZoomLevel === currentZoomLevel) { return; }

    // calculate new translate
    const currentTranslate = this.camera.translate;
    const canvasCoordsAtScreenCenter = {
      x: Math.floor((this.CANVAS.width / 2) - currentTranslate.x),
      y: Math.floor((this.CANVAS.height / 2) - currentTranslate.y)
    };

    const scale = CAMERA_ZOOM_LEVEL_TO_TILE_SIZE_MAP[newZoomLevel] / CAMERA_ZOOM_LEVEL_TO_TILE_SIZE_MAP[currentZoomLevel];

    // set zoom level first so it can used in normalization of the translation
    this.cameraStore.setZoomLevel(newZoomLevel);

    // calculate new translate, normalize then set it
    const newTranslate: Coords = {
      x: -Math.round((canvasCoordsAtScreenCenter.x * scale) - (this.CANVAS.width / 2)),
      y: -Math.round((canvasCoordsAtScreenCenter.y * scale) - (this.CANVAS.height / 2))
    }
    const normalizedTranslate = this.cameraService.normalizeVerticalTranslation(newTranslate, this.CANVAS.height, this.mapHeight);
    this.cameraStore.setTranslate(normalizedTranslate);
  }

  onCanvasMousedown(event: MouseEvent) {
    this.dragStartCoords = {x: event.pageX, y: event.pageY};
    this.dragStartOffset = {x: this.camera.translate.x, y: this.camera.translate.y};
    this.isDragging = true;
  }

  // DRAWING MAP

  fullRepaint() {
    this.updateSizeVariables();
    this.paintBackground();
    this.paintMapDecoration();
    this.paintTiles();
  }

  updateSizeVariables() {
    this.tileWidth = this.camera.tileSize * 0.9;
    this.tileHeight = this.camera.tileSize;
    this.mapWidth = this.tileWidth * this.map.width + Math.ceil(this.tileWidth * 0.5);
    this.mapHeight = (this.tileHeight * this.map.height * 0.75) + Math.ceil(this.tileHeight * 0.25) - this.map.height + 1;  // this.map.height is 1-based, need +1
  }


  paintBackground() {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  paintMapDecoration() {
    this.ctx.fillStyle = 'gray';
    this.ctx.fillRect(0, this.camera.translate.y - 10, this.ctx.canvas.width, this.mapHeight + 20);
  }

  paintTiles() {
    for (const tile of this.map.tiles) {
      const tileCoords = this.tileCoords(tile);
      if (this.isTileInViewport(tileCoords)) {
        this.drawTile(tile, tileCoords);
      }
    }
  }

  isTileInViewport(tileCoords: Coords): boolean {
    return (tileCoords.x + this.tileWidth >= 0) && (tileCoords.x <= this.ctx.canvas.width) &&
           (tileCoords.y + this.tileHeight >= 0) && (tileCoords.y <= this.ctx.canvas.height);
  }

  tileCoords(tile: Tile): Coords {
    return {
      x: (((tile.coords.x * this.tileWidth) + (this.tileService.isTileInOddRow(tile) ? this.tileWidth / 2 : 0))) + this.camera.translate.x,
      y: ((tile.coords.y * this.tileHeight * 0.75) - tile.coords.y) + this.camera.translate.y  // tile.coords.y is 0-based, no  need for +/- 1
    };
  }

  createTilePath(tileCoords: Coords) {
    this.ctx.beginPath();
    this.ctx.moveTo(tileCoords.x + this.tileWidth * 0.50, tileCoords.y);
    this.ctx.lineTo(tileCoords.x + this.tileWidth, tileCoords.y + this.tileHeight * 0.25);
    this.ctx.lineTo(tileCoords.x + this.tileWidth, tileCoords.y + this.tileHeight * 0.75);
    this.ctx.lineTo(tileCoords.x + this.tileWidth * 0.50, tileCoords.y + this.tileHeight);
    this.ctx.lineTo(tileCoords.x, tileCoords.y + this.tileHeight * 0.75);
    this.ctx.lineTo(tileCoords.x, tileCoords.y + this.tileHeight * 0.25);
    this.ctx.closePath();
  }

  fillTerrainBase(tile: Tile) {
    this.ctx.fillStyle = this.tileFillStyle(tile);
    this.ctx.fill();
  }

  tileFillStyle(tile: Tile): CanvasPattern {
    let imgElemId;
    switch (tile.terrain.base.id) {
      case TerrainBaseId.GRASSLAND_FLAT:
      case TerrainBaseId.GRASSLAND_HILLS:
      case TerrainBaseId.GRASSLAND_MOUNTAIN:
        imgElemId = 'terrain-texture-grassland';
        break;
      case TerrainBaseId.PLAINS_FLAT:
      case TerrainBaseId.PLAINS_HILLS:
      case TerrainBaseId.PLAINS_MOUNTAIN:
        imgElemId = 'terrain-texture-plains';
        break;
      case TerrainBaseId.DESERT_FLAT:
      case TerrainBaseId.DESERT_HILLS:
      case TerrainBaseId.DESERT_MOUNTAIN:
        imgElemId = 'terrain-texture-desert';
        break;
      case TerrainBaseId.TUNDRA_FLAT:
      case TerrainBaseId.TUNDRA_HILLS:
      case TerrainBaseId.TUNDRA_MOUNTAIN:
        imgElemId = 'terrain-texture-tundra';
        break;
      case TerrainBaseId.SNOW_FLAT:
      case TerrainBaseId.SNOW_HILLS:
      case TerrainBaseId.SNOW_MOUNTAIN:
        imgElemId = 'terrain-texture-snow';
        break;
      case TerrainBaseId.LAKE:
      case TerrainBaseId.COAST:
        imgElemId = 'terrain-texture-coast';
        break;
      case TerrainBaseId.OCEAN:
        imgElemId = 'terrain-texture-ocean';
        break;
    }
    const imgElem = document.getElementById(imgElemId) as HTMLImageElement;
    return this.ctx.createPattern(imgElem, 'repeat');
  }

  fillTextWithShadow(text: string, textColor: string, shadowColor: string, x: number, y: number, shadowDistance = 1) {
    this.ctx.fillStyle = shadowColor;
    this.ctx.fillText(text, x + shadowDistance, y + shadowDistance);
    this.ctx.fillStyle = textColor;
    this.ctx.fillText(text, x, y);
  }

  addTileInfoTextOverlay(tile: Tile, tileCoords: Coords) {
    this.ctx.font = '10px Calibri';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'bottom';

    const tileHorizontalCenter = tileCoords.x + (this.tileWidth / 2);
    const tileBottom = tileCoords.y + this.tileHeight;

    this.fillTextWithShadow(`${tile.coords.x}, ${tile.coords.y}`, 'lightgray', 'black', tileHorizontalCenter, tileBottom - 10);
    if (this.tileWidth > 120) {
      const terrainBaseName = this.terrainBaseNamePipe.transform(tile.terrain.base.id).toUpperCase();
      const terrainFeatureName = this.terrainFeatureNamePipe.transform(tile.terrain.feature.id).toUpperCase();
      const terrainResourceName = this.terrainResourceNamePipe.transform(tile.terrain.resourceId).toUpperCase();
      const terrainImprovementName = this.terrainImprovementNamePipe.transform(tile.terrain.improvementId).toUpperCase();
      this.fillTextWithShadow(terrainImprovementName, 'lightgray', 'black', tileHorizontalCenter, tileBottom - 20);
      this.fillTextWithShadow(terrainResourceName, 'lightgray', 'black', tileHorizontalCenter, tileBottom - 30);
      this.fillTextWithShadow(terrainFeatureName, 'lightgray', 'black', tileHorizontalCenter, tileBottom - 40);
      this.fillTextWithShadow(terrainBaseName, 'lightgray', 'black', tileHorizontalCenter, tileBottom - 50);
    }
  }

  addTileInfoYieldOverlay(tile: Tile, tileCoords: Coords) {

  }

  drawTile(tile: Tile, tileCoords: Coords): void {
    this.createTilePath(tileCoords);
    this.fillTerrainBase(tile);
    if (this.mapUi.infoOverlay === TileInfoOverlayId.TEXT) { this.addTileInfoTextOverlay(tile, tileCoords) }
    if (this.mapUi.infoOverlay === TileInfoOverlayId.YIELD) { this.addTileInfoYieldOverlay(tile, tileCoords) }
    if (this.mapUi.showGrid) { this.ctx.stroke() }
  }

}
