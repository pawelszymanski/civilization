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

  private setCtxShadow(color: string, blur: number, offsetX: number, offsetY: number): void {
    this.ctx.shadowColor = color;
    this.ctx.shadowBlur = blur;
    this.ctx.shadowOffsetX = offsetX;
    this.ctx.shadowOffsetY = offsetY;
  }

  private setCommonStyles(): void {
    // grid
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';

    // tile text
    this.ctx.font = '12px Calibri';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'bottom';
    this.ctx.fillStyle = 'white';

    this.setCtxShadow('black', 2, 0, 0);
  }

  public paintCanvas(ctx: CanvasRenderingContext2D): void {
    this.ctx = ctx;
    this.setCommonStyles();
    this.clearCanvas();

    for (const tile of this.map.tiles) {
      if (tile.isVisible) {
        if (this.mapUi.infoOverlay === TileInfoOverlayId.TEXT) { this.paintTileInfoText(tile); }
        if (this.mapUi.infoOverlay === TileInfoOverlayId.YIELD) { this.paintTileInfoYield(tile); }
        if (this.mapUi.showGrid) { this.paintRightSideEdges(tile); }
      }
    }

    if (this.mapUi.showGrid) {
      for (const tile of this.firstRowTiles) { if (tile.isVisible) { this.paintTopLeftEdge(tile); } }
      for (const tile of this.lastRowTiles) { if (tile.isVisible) { this.paintBottomLeftEdge(tile); } }
    }
  }

  public clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  private paintTileInfoText(tile: Tile): void {
    const tileHorizontalCenter = tile.px.x + this.size.tile.halfWidth;
    const tileBottom = tile.px.y + this.size.tile.height;

    this.ctx.fillText(`${tile.grid.x}, ${tile.grid.y}`, tileHorizontalCenter, tileBottom - 12);
    if (this.size.tile.width >= 130) {
      const terrainBaseName = this.terrainBaseNamePipe.transform(tile.terrain.base.id).toUpperCase();
      const terrainFeatureName = this.terrainFeatureNamePipe.transform(tile.terrain.feature.id).toUpperCase();
      const terrainResourceName = this.terrainResourceNamePipe.transform(tile.terrain.resourceId).toUpperCase();
      const terrainImprovementName = this.terrainImprovementNamePipe.transform(tile.terrain.improvementId).toUpperCase();
      this.ctx.fillText(terrainImprovementName, tileHorizontalCenter, tileBottom - 26);
      this.ctx.fillText(terrainResourceName, tileHorizontalCenter, tileBottom - 40);
      this.ctx.fillText(terrainFeatureName, tileHorizontalCenter, tileBottom - 54);
      this.ctx.fillText(terrainBaseName, tileHorizontalCenter, tileBottom - 68);
    }
  }

  private paintTileInfoYield(tile: Tile): void {
    // TODO
  }

  private paintRightSideEdges(tile: Tile): void {
    this.ctx.beginPath();
    this.ctx.moveTo(tile.px.x + this.size.vertices[0].x, tile.px.y + this.size.vertices[0].y + 0.5);
    this.ctx.lineTo(tile.px.x + this.size.vertices[1].x, tile.px.y + this.size.vertices[1].y + 0.5);
    this.ctx.lineTo(tile.px.x + this.size.vertices[2].x, tile.px.y + this.size.vertices[2].y - 1);
    this.ctx.lineTo(tile.px.x + this.size.vertices[3].x, tile.px.y + this.size.vertices[3].y - 1);
    this.ctx.stroke();
  }

  // Paints top left  three right sides of the tile
  private paintTopLeftEdge(tile: Tile): void {
    this.ctx.beginPath();
    this.ctx.moveTo(tile.px.x + this.size.vertices[5].x, tile.px.y + this.size.vertices[5].y + 0.5);
    this.ctx.lineTo(tile.px.x + this.size.vertices[0].x, tile.px.y + this.size.vertices[0].y + 0.5);
    this.ctx.stroke();
  }

  private paintBottomLeftEdge(tile: Tile): void {
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
