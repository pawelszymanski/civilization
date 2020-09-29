import {Injectable} from '@angular/core';

import {Tile, Map} from '../models/map';
import {MapUi, TileInfoOverlayId} from '../models/map-ui';
import {Camera} from '../models/camera';
import {Size} from '../models/size';

import {TileUiService} from './tile-ui.service';

import {MapStore} from '../stores/map.store';
import {CameraStore} from '../stores/camera.store';
import {SizeStore} from '../stores/size.store';
import {MapUiStore} from '../stores/map-ui.store';

import {TerrainBaseNamePipe} from '../pipes/terrain-base-name.pipe';
import {TerrainFeatureNamePipe} from '../pipes/terrain-feature-name.pipe';
import {TerrainImprovementNamePipe} from '../pipes/terrain-improvement-name.pipe';
import {TerrainResourceNamePipe} from '../pipes/terrain-resource-name.pipe';

@Injectable({providedIn: 'root'})
export class MapCanvasService {

  camera: Camera;
  size: Size;
  map: Map;
  mapUi: MapUi;

  ctx: CanvasRenderingContext2D;

  firstRowTiles: Tile[];
  lastRowTiles: Tile[];

  constructor(
    private tileUiService: TileUiService,
    private mapStore: MapStore,
    private cameraStore: CameraStore,
    private sizeStore: SizeStore,
    private mapUiStore: MapUiStore,
    private terrainBaseNamePipe: TerrainBaseNamePipe,
    private terrainFeatureNamePipe: TerrainFeatureNamePipe,
    private terrainImprovementNamePipe: TerrainImprovementNamePipe,
    private terrainResourceNamePipe: TerrainResourceNamePipe,
  ) {
    this.subscribeToData();
  }

  private subscribeToData(): void {
    this.cameraStore.camera.subscribe(camera => this.camera = camera);
    this.sizeStore.size.subscribe(size => this.size = size);
    this.mapStore.map.subscribe(map => {
      this.map = map;
      this.firstRowTiles = this.map.tiles.filter(t => t.grid.y === 0);
      this.lastRowTiles = this.map.tiles.filter(t => t.grid.y === this.map.height-1);
    });
    this.mapUiStore.mapUi.subscribe(mapUi => this.mapUi = mapUi);
  }

  public paintTileExtras(ctx: CanvasRenderingContext2D): void {
    this.ctx = ctx;
    this.clearCanvas();
    this.setCtxGridStrokeStyle();

    for (const tile of this.map.tiles) {
      if (tile.isVisible) {
        if (this.mapUi.infoOverlay === TileInfoOverlayId.TEXT) { this.addTileInfoTextOverlay(tile); }
        if (this.mapUi.infoOverlay === TileInfoOverlayId.YIELD) { this.addTileInfoYieldOverlay(tile); }
        if (this.mapUi.showGrid) { this.paintGridThreeSides(tile); }
      }
    }

    if (this.mapUi.showGrid) {
      for (const tile of this.firstRowTiles) { if (tile.isVisible) { this.paintGridTopLeft(tile); } }
      for (const tile of this.lastRowTiles) { if (tile.isVisible) { this.paintGridBottomLeft(tile); } }
    }
  }

  private clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  private fillTextWithShadow(text: string, textColor: string, shadowColor: string, x: number, y: number, shadowDistance = 1) {
    this.ctx.fillStyle = shadowColor;
    this.ctx.fillText(text, x + shadowDistance, y + shadowDistance);
    this.ctx.fillStyle = textColor;
    this.ctx.fillText(text, x, y);
  }

  private addTileInfoTextOverlay(tile: Tile): void {
    this.ctx.font = '10px Calibri';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'bottom';

    const tileHorizontalCenter = tile.px.x + this.size.tile.halfWidth;
    const tileBottom = tile.px.y + this.size.tile.height;

    this.fillTextWithShadow(`${tile.grid.x}, ${tile.grid.y}`, 'lightgray', 'black', tileHorizontalCenter, tileBottom - 10);
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

  private addTileInfoYieldOverlay(tile: Tile): void {
    // TODO
  }

  private setCtxGridStrokeStyle(): void {
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
  }

  private paintGridThreeSides(tile: Tile): void {
    this.ctx.beginPath();
    this.ctx.moveTo(tile.px.x + this.size.vertices[0].x, tile.px.y + this.size.vertices[0].y + 0.5);
    this.ctx.lineTo(tile.px.x + this.size.vertices[1].x, tile.px.y + this.size.vertices[1].y + 0.5);
    this.ctx.lineTo(tile.px.x + this.size.vertices[2].x, tile.px.y + this.size.vertices[2].y - 1);
    this.ctx.lineTo(tile.px.x + this.size.vertices[3].x, tile.px.y + this.size.vertices[3].y - 1);
    this.ctx.stroke();
  }

  private paintGridTopLeft(tile: Tile): void {
    this.ctx.beginPath();
    this.ctx.moveTo(tile.px.x + this.size.vertices[5].x, tile.px.y + this.size.vertices[5].y + 0.5);
    this.ctx.lineTo(tile.px.x + this.size.vertices[0].x, tile.px.y + this.size.vertices[0].y + 0.5);
    this.ctx.stroke();
  }

  private paintGridBottomLeft(tile: Tile): void {
    this.ctx.beginPath();
    this.ctx.moveTo(tile.px.x + this.size.vertices[3].x, tile.px.y + this.size.vertices[3].y - 1);
    this.ctx.lineTo(tile.px.x + this.size.vertices[4].x, tile.px.y + this.size.vertices[4].y - 1);
    this.ctx.stroke();
  }

}

// private paintMapDecoration(): void {
//   this.ctx.fillStyle = 'gray';
//   this.ctx.fillRect(0, this.camera.translate.y - 10, this.ctx.canvas.width, this.size.map.height + 20);
// }

// private createTilePath(coordsOnScreen: Coords): void {
//   this.ctx.beginPath();
//   this.ctx.moveTo(coordsOnScreen.x + this.size.vertices[0].x, coordsOnScreen.y + this.size.vertices[0].y);
//   this.ctx.lineTo(coordsOnScreen.x + this.size.vertices[1].x, coordsOnScreen.y + this.size.vertices[1].y);
//   this.ctx.lineTo(coordsOnScreen.x + this.size.vertices[2].x, coordsOnScreen.y + this.size.vertices[2].y);
//   this.ctx.lineTo(coordsOnScreen.x + this.size.vertices[3].x, coordsOnScreen.y + this.size.vertices[3].y);
//   this.ctx.lineTo(coordsOnScreen.x + this.size.vertices[4].x, coordsOnScreen.y + this.size.vertices[4].y);
//   this.ctx.lineTo(coordsOnScreen.x + this.size.vertices[5].x, coordsOnScreen.y + this.size.vertices[5].y);
//   this.ctx.closePath();
// }
