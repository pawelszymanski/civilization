import {Component, ElementRef, HostListener, ViewChild, ViewEncapsulation} from '@angular/core';
import {Subscription} from 'rxjs';

import {Camera} from '../../../models/camera/camera';
import {Coords} from '../../../models/utils/coords';
import {GameMap, Tile} from '../../../models/game-map/game-map';
import {TerrainBaseId} from '../../../models/game-map/terrain';

import {CAMERA_ZOOM_LEVEL_TO_TILE_SIZE_MAP} from '../../../consts/camera/camera.const';

import {CameraHelperService} from '../../../services/camera/camera-helper.service';
import {MouseHelperService} from '../../../services/ui/mouse-helper.service';

import {CameraStore} from '../../../stores/camera.store';
import {GameMapStore} from '../../../stores/game-map.store';

@Component({
  selector: '.strategic-view-component',
  templateUrl: './strategic-view.component.html',
  styleUrls: ['strategic-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StrategicViewComponent {

  readonly CANVAS = {
    width: 600,
    height: 400
  };

  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;

  ctx: CanvasRenderingContext2D;

  gameMap: GameMap;
  camera: Camera;

  dragStartCoords: Coords;  // Page x, y when mouse was pressed down
  dragStartOffset: Coords;  // Map element x, y when mouse was pressed down

  isDragging = false;

  shallRedraw = false;

  animationFrameId: number;

  subscriptions: Subscription[] = [];

  constructor(
    private cameraHelperService: CameraHelperService,
    private mouseHelperService: MouseHelperService,
    private gameMapStore: GameMapStore,
    private cameraStore: CameraStore
  ) {}

  ngOnInit() {
    this.initContext();
    this.setCanvasSize();
    this.subscribeToData();
    this.requestAnimationFrame();
  }

  ngOnDestroy() {
    this.unsubscribeFromData();
    this.cancelAnimationFrame();
  }

  initContext() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.ctx.lineWidth = 1;
  }

  setCanvasSize() {
    this.CANVAS.width = window.innerWidth;
    this.CANVAS.height = window.innerHeight;
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.setCanvasSize();
    this.shallRedraw = true;
  }

  subscribeToData() {
    this.subscriptions.push(
      this.cameraStore.camera.subscribe(camera => { this.camera = camera; this.shallRedraw = true; }),
      this.gameMapStore.gameMap.subscribe(gameMap => { this.gameMap = gameMap; this.shallRedraw = true; })
    );
  }

  requestAnimationFrame() {
    this.animationFrameId = window.requestAnimationFrame(() => {
      this.requestAnimationFrame();
      if (this.gameMap && this.shallRedraw) {     // TODO remove game map check at some point
        this.drawMap();
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

  drawMap() {
    this.ctx.fillStyle = 'gray';
    this.ctx.fillRect(0, 0, this.CANVAS.width, this.CANVAS.height);

    for (const tile of this.gameMap.tiles) {
      if (this.isTileInViewport(tile)) {
        this.drawTile(tile);
      }
    }
  }

  tileWidth(): number {
    return this.camera.tileSize * 0.9;
  }

  tileHeight(): number {
    return this.camera.tileSize;
  }

  mapWidth(): number {
    return this.tileWidth() * this.gameMap.width + Math.ceil(this.tileWidth() * 0.5);
  }

  mapHeight(): number {
    return (this.tileHeight() * this.gameMap.height * 0.75) + Math.ceil(this.tileHeight() * 0.25);
  }

  isOddRow(tile: Tile): boolean {
    return tile.coords.y % 2 === 1;
  }

  isTileInViewport(tile: Tile): boolean {
    const tileSize = { x: this.tileWidth(), y: this.tileHeight() }
    const tilePosition = this.tilePosition(tile);
    const viewportSize = { x: this.CANVAS.width, y: this.CANVAS.height }
    const cameraTranslate = this.camera.translate;

    return (cameraTranslate.x + tilePosition.x + tileSize.x >= 0) &&
           (cameraTranslate.x + tilePosition.x <= viewportSize.x) &&
           (cameraTranslate.y + tilePosition.y + tileSize.y >= 0) &&
           (cameraTranslate.y + tilePosition.y <= viewportSize.y);
  }

  tilePosition(tile: Tile): Coords {
    return {
      x: ((tile.coords.x * this.tileWidth()) + (this.isOddRow(tile) ? this.tileWidth() / 2 : 0)),
      y: (tile.coords.y * this.tileHeight() * 0.75)
    };
  }

  createTilePath(tile: Tile) {
    const tileWidth = this.tileWidth();
    const tileHeight = this.tileHeight();
    const tilePosition = this.tilePosition(tile);
    const cameraTranslate = this.camera.translate;

    this.ctx.beginPath();
    this.ctx.moveTo(cameraTranslate.x + tilePosition.x + tileWidth * 0.50, cameraTranslate.y + tilePosition.y);
    this.ctx.lineTo(cameraTranslate.x + tilePosition.x + tileWidth, cameraTranslate.y + tilePosition.y + tileHeight * 0.25);
    this.ctx.lineTo(cameraTranslate.x + tilePosition.x + tileWidth, cameraTranslate.y + tilePosition.y + tileHeight * 0.75);
    this.ctx.lineTo(cameraTranslate.x + tilePosition.x + tileWidth * 0.50, cameraTranslate.y + tilePosition.y + tileHeight);
    this.ctx.lineTo(cameraTranslate.x + tilePosition.x, cameraTranslate.y + tilePosition.y + tileHeight * 0.75);
    this.ctx.lineTo(cameraTranslate.x + tilePosition.x, cameraTranslate.y + tilePosition.y + tileHeight * 0.25);
    this.ctx.closePath();
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

  drawTile(tile: Tile): void {
    this.createTilePath(tile);
    this.ctx.stroke();
    this.ctx.fillStyle = this.tileFillStyle(tile);
    this.ctx.fill();
  }

  onCanvasMousedown(event: MouseEvent) {
    this.dragStartCoords = {x: event.pageX, y: event.pageY};
    this.dragStartOffset = {x: this.camera.translate.x, y: this.camera.translate.y};
    this.isDragging = true;
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
    const normalizedTranslate = this.cameraHelperService.normalizeVerticalTranslation(translate, this.CANVAS.height, this.mapHeight());
    this.cameraStore.setTranslate(normalizedTranslate);
  }

  onCanvasWheel(event: WheelEvent) {
    // calculate new zoom level
    const step = this.mouseHelperService.wheelEventToStep(event);
    const currentZoomLevel = this.camera.zoomLevel;
    const newZoomLevel = this.cameraHelperService.normalizeZoomLevel(currentZoomLevel + step);
    if (newZoomLevel === currentZoomLevel) { return; }

    // calculate new translate
    const currentTranslate = this.camera.translate;
    const mapCoordsAtScreenCenter = this.cameraHelperService.mapCoordsAtScreenCenter(currentTranslate);
    const scale = CAMERA_ZOOM_LEVEL_TO_TILE_SIZE_MAP[newZoomLevel] / CAMERA_ZOOM_LEVEL_TO_TILE_SIZE_MAP[currentZoomLevel];

    // set zoom level first so it can used in normalization of the translation
    this.cameraStore.setZoomLevel(newZoomLevel);

    // calculate new translate, normalize then set it
    const newTranslate: Coords = {
      x: -Math.round((mapCoordsAtScreenCenter.x * scale) - (this.CANVAS.width / 2)),
      y: -Math.round((mapCoordsAtScreenCenter.y * scale) - (this.CANVAS.height / 2))
    }
    const normalizedTranslate = this.cameraHelperService.normalizeVerticalTranslation(newTranslate, this.CANVAS.height, this.mapHeight());
    this.cameraStore.setTranslate(normalizedTranslate);
  }

}
