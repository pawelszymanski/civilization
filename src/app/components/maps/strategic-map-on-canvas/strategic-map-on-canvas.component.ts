import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Subscription} from 'rxjs';

import {Camera} from '../../../models/camera';
import {Coords} from '../../../models/utils';
import {Map, Tile} from '../../../models/map';
import {MapUi, TileInfoOverlayId} from '../../../models/map-ui';

import {CAMERA_ZOOM_LEVEL_TO_TILE_SIZE_MAP} from '../../../consts/camera.const';
import {TERRAIN_BASE_SET} from '../../../consts/terrain.const';

import {CameraService} from '../../../services/camera.service';
import {MouseService} from '../../../services/mouse.service';
import {TileService} from '../../../services/tile.service';

import {CameraStore} from '../../../stores/camera.store';
import {MapStore} from '../../../stores/map.store';
import {MapUiStore} from '../../../stores/map-ui.store';

import {TerrainBaseNamePipe} from '../../../pipes/terrain-base-name.pipe';
import {TerrainFeatureNamePipe} from '../../../pipes/terrain-feature-name.pipe';
import {TerrainResourceNamePipe} from '../../../pipes/terrain-resource-name.pipe';
import {TerrainImprovementNamePipe} from '../../../pipes/terrain-improvement-name.pipe';

@Component({
  selector: '.strategic-map-on-canvas-component',
  templateUrl: './strategic-map-on-canvas.component.html',
  styleUrls: ['strategic-map-on-canvas.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StrategicMapOnCanvasComponent implements OnInit, OnDestroy {

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

  hoveredTile: Tile;

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
    this.hoveredTile = this.eventTargetTile(event);
    this.checkIfToRedraw();

    if (!this.isDragging) { return; }

    // new translate without normalization
    let translate = {
      x: this.dragStartOffset.x + event.pageX - this.dragStartCoords.x,
      y: this.dragStartOffset.y + event.pageY - this.dragStartCoords.y
    }

    // normalize and set
    translate = this.cameraService.normalizeVerticalTranslation(translate, this.mapHeight, this.CANVAS.height);
    translate = this.cameraService.normalizeHorizontalTranslation(translate, this.mapWidth, this.tileWidth);
    this.cameraStore.setTranslate(translate);
  }

  onCanvasMousedown(event: MouseEvent) {
    this.dragStartCoords = {x: event.pageX, y: event.pageY};
    this.dragStartOffset = {x: this.camera.translate.x, y: this.camera.translate.y};
    this.isDragging = true;
  }

  onCanvasClick(event: MouseEvent) {
    // const tile = this.findClickedTile(event);
    // this.selectedTile = tile;
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
    const normalizedTranslate = this.cameraService.normalizeVerticalTranslation(newTranslate, this.mapHeight, this.CANVAS.height);
    this.cameraStore.setTranslate(normalizedTranslate);
  }

  // OTHER

  eventTargetTile(event: MouseEvent): Tile {
    const mapCoords: Coords = {x: event.pageX - this.camera.translate.x, y: event.pageY - this.camera.translate.y};
    let y = -1; while (mapCoords.y + y > (y+1) * this.tileHeight * 0.75) {y++}
    let x = -1; while (mapCoords.x > (x+1) * this.tileWidth) {x++}
    if ((y % 2 === 1) && ((mapCoords.x % this.tileWidth) < (this.tileWidth / 2))) {x--}
    return this.map.tiles.find(t => t.coords.x === x && t.coords.y === y);
    // const candidateAndNeighbours = this.map.tiles.filter(t => t.coords.x >= x-1 && t.coords.x <= x+1 && t.coords.y >= y-1 && t.coords.y <= y+1);
    // candidateAndNeighbours.forEach(tile => tile.distance = this.distance(mapCoords, this.tileCenterCoords(tile)));
    // return candidateAndNeighbours.sort( (a, b) => {return a.distance > b.distance ? -1 : a.distance < b.distance ? 1 : 0}).pop();
  }

  isTileInViewport(tileCoordsOnCanvas: Coords): boolean {
    return (tileCoordsOnCanvas.x + this.tileWidth >= 0) && (tileCoordsOnCanvas.x <= this.ctx.canvas.width) &&
      (tileCoordsOnCanvas.y + this.tileHeight >= 0) && (tileCoordsOnCanvas.y <= this.ctx.canvas.height);
  }

  tileCoordsOnMap(tile: Tile): Coords {
    // move tiles in the last column to "-1 column" to wrap the map; tiles in odd rows to be indented;
    const oddRowFix = this.tileService.isTileInOddRow(tile) ? this.tileWidth / 2 : 0;
    const lastColumnFix = (tile.coords.x + 1 === this.map.width) ? -this.mapWidth + this.tileWidth / 2 : 0;

    return {
      x: (tile.coords.x * this.tileWidth) + oddRowFix + lastColumnFix,
      y: ((tile.coords.y * this.tileHeight * 0.75) - tile.coords.y)  // tile.coords.y is 0-based, no need for +/- 1
    };
  }

  tileCoordsOnCanvas(tile: Tile): Coords {
    const tileCoordsOnMap = this.tileCoordsOnMap(tile);
    return {
      x: tileCoordsOnMap.x + this.camera.translate.x,
      y: tileCoordsOnMap.y + this.camera.translate.y
    };
  }

  // DRAWING MAP

  fullRepaint() {
    this.updateSizeVariables();
    this.paintBackground();
    this.paintMapDecoration();
    this.iterateTilesAndPainVisible();
  }

  updateSizeVariables() {
    this.tileWidth = this.camera.tileSize * 0.9;
    this.tileHeight = this.camera.tileSize;
    this.mapWidth = this.tileWidth * this.map.width + Math.ceil(this.tileWidth * 0.5);
    this.mapHeight = (this.tileHeight * this.map.height * 0.75) + Math.ceil(this.tileHeight * 0.25) - (this.map.height - 1);  // this.map.height is 1-based, need -1
  }

  paintBackground() {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  paintMapDecoration() {
    this.ctx.fillStyle = 'gray';
    this.ctx.fillRect(0, this.camera.translate.y - 10, this.ctx.canvas.width, this.mapHeight + 20);
  }

  iterateTilesAndPainVisible() {
    for (const tile of this.map.tiles) {
      let tileCoordsOnCanvas: Coords = null;

      // Try basic (x, y) coords - if not on map then also try (x - mapWidth, y). Then if in viewport paint it.
      const primaryCoordsCandidate = this.tileCoordsOnCanvas(tile);
      if (this.isTileInViewport(primaryCoordsCandidate)) { tileCoordsOnCanvas = primaryCoordsCandidate; }

      if (!tileCoordsOnCanvas) {
        const alternativeCoordsCandidate = Object.assign({}, primaryCoordsCandidate);
        alternativeCoordsCandidate.x = alternativeCoordsCandidate.x + (this.mapWidth - (this.tileWidth / 2));
        if (this.isTileInViewport(alternativeCoordsCandidate)) { tileCoordsOnCanvas = alternativeCoordsCandidate; }
      }

      if (tileCoordsOnCanvas) {
        this.paintTile(tile, tileCoordsOnCanvas);
      }
    }
  }

  createTilePathOnCtx(tileCoordsOnCanvas: Coords) {
    this.ctx.beginPath();
    this.ctx.moveTo(tileCoordsOnCanvas.x + this.tileWidth * 0.50, tileCoordsOnCanvas.y);
    this.ctx.lineTo(tileCoordsOnCanvas.x + this.tileWidth, tileCoordsOnCanvas.y + this.tileHeight * 0.25);
    this.ctx.lineTo(tileCoordsOnCanvas.x + this.tileWidth, tileCoordsOnCanvas.y + this.tileHeight * 0.75);
    this.ctx.lineTo(tileCoordsOnCanvas.x + this.tileWidth * 0.50, tileCoordsOnCanvas.y + this.tileHeight);
    this.ctx.lineTo(tileCoordsOnCanvas.x, tileCoordsOnCanvas.y + this.tileHeight * 0.75);
    this.ctx.lineTo(tileCoordsOnCanvas.x, tileCoordsOnCanvas.y + this.tileHeight * 0.25);
    this.ctx.closePath();
  }

  paintTerrain(tile: Tile, tileCoordsOnCanvas: Coords) {
    this.createTilePathOnCtx(tileCoordsOnCanvas);
    this.ctx.fillStyle = TERRAIN_BASE_SET[tile.terrain.base.id].ui.color;
    this.ctx.fill();
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
    if (this.camera.zoomLevel >= 0) {
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
    // TODO
  }

  paintGrid(tileCoordsOnCanvas: Coords) {
    this.createTilePathOnCtx(tileCoordsOnCanvas);
    this.ctx.stroke()
  }

  paintTile(tile: Tile, tileCoordsOnCanvas: Coords): void {
    this.paintTerrain(tile, tileCoordsOnCanvas)
    if (this.mapUi.infoOverlay === TileInfoOverlayId.TEXT) { this.addTileInfoTextOverlay(tile, tileCoordsOnCanvas) }
    if (this.mapUi.infoOverlay === TileInfoOverlayId.YIELD) { this.addTileInfoYieldOverlay(tile, tileCoordsOnCanvas) }
    if (this.mapUi.showGrid) { this.paintGrid(tileCoordsOnCanvas) }
    if (this.hoveredTile && this.hoveredTile.coords.x === tile.coords.x && this.hoveredTile.coords.y === tile.coords.y) {
      this.ctx.fillStyle = 'rgba(15, 15, 15, 15)';
      this.ctx.fill()
    }
  }

}
