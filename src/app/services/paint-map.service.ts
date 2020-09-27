import {Injectable} from '@angular/core';

import {Coords} from '../models/utils';
import {Tile, Map} from '../models/map';
import {MapUi, TileInfoOverlayId} from '../models/map-ui';
import {Camera} from '../models/camera';
import {Size} from '../models/size';

import {TERRAIN_BASE_SET} from '../consts/terrain.const';

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
export class PaintMapService {

  camera: Camera;
  size: Size;
  map: Map;
  mapUi: MapUi;

  ctx: CanvasRenderingContext2D;

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

  private subscribeToData() {
    this.cameraStore.camera.subscribe(camera => this.camera = camera);
    this.sizeStore.size.subscribe(size => this.size = size);
    this.mapStore.map.subscribe(map => this.map = map);
    this.mapUiStore.mapUi.subscribe(mapUi => this.mapUi = mapUi);
  }

  public paintMap(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.paintBackground();
    this.paintMapDecoration();
    this.paintTiles();
  }

  private paintBackground() {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  private paintMapDecoration() {
    this.ctx.fillStyle = 'gray';
    this.ctx.fillRect(0, this.camera.translate.y - 10, this.ctx.canvas.width, this.size.map.height + 20);
  }

  private paintTiles() {
    for (const tile of this.map.tiles) {
      const tileCoordsOnViewportPx = this.tileUiService.tileCoordsOnViewportPx(tile);
      const isInViewport = !!tileCoordsOnViewportPx;
      if (isInViewport) {
        this.paintTile(tile, tileCoordsOnViewportPx);
      }
    }
  }

  private createTilePath(tileCoordsOnViewport: Coords) {
    this.ctx.beginPath();
    this.ctx.moveTo(tileCoordsOnViewport.x + this.size.vertices[0].x, tileCoordsOnViewport.y + this.size.vertices[0].y);
    this.ctx.lineTo(tileCoordsOnViewport.x + this.size.vertices[1].x, tileCoordsOnViewport.y + this.size.vertices[1].y);
    this.ctx.lineTo(tileCoordsOnViewport.x + this.size.vertices[2].x, tileCoordsOnViewport.y + this.size.vertices[2].y);
    this.ctx.lineTo(tileCoordsOnViewport.x + this.size.vertices[3].x, tileCoordsOnViewport.y + this.size.vertices[3].y);
    this.ctx.lineTo(tileCoordsOnViewport.x + this.size.vertices[4].x, tileCoordsOnViewport.y + this.size.vertices[4].y);
    this.ctx.lineTo(tileCoordsOnViewport.x + this.size.vertices[5].x, tileCoordsOnViewport.y + this.size.vertices[5].y);
    this.ctx.closePath();
  }

  private paintTerrain(tile: Tile, tileCoords: Coords) {
    this.createTilePath(tileCoords);
    this.ctx.fillStyle = TERRAIN_BASE_SET[tile.terrain.base.id].ui.color;
    this.ctx.fill();
  }

  private fillTextWithShadow(text: string, textColor: string, shadowColor: string, x: number, y: number, shadowDistance = 1) {
    this.ctx.fillStyle = shadowColor;
    this.ctx.fillText(text, x + shadowDistance, y + shadowDistance);
    this.ctx.fillStyle = textColor;
    this.ctx.fillText(text, x, y);
  }

  private addTileInfoTextOverlay(tile: Tile, tileCoords: Coords) {
    this.ctx.font = '10px Calibri';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'bottom';

    const tileHorizontalCenter = tileCoords.x + this.size.tile.halfWidth;
    const tileBottom = tileCoords.y + this.size.tile.height;

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

  private addTileInfoYieldOverlay(tile: Tile) {
    // TODO
  }

  private paintGrid(tile: Tile, tileCoords: Coords) {
    this.createTilePath(tileCoords);
    this.ctx.stroke();
  }

  private paintTile(tile: Tile, tileCoords: Coords): void {
    this.paintTerrain(tile, tileCoords)
    if (this.mapUi.infoOverlay === TileInfoOverlayId.TEXT) { this.addTileInfoTextOverlay(tile, tileCoords) }
    if (this.mapUi.infoOverlay === TileInfoOverlayId.YIELD) { this.addTileInfoYieldOverlay(tile) }
    if (this.mapUi.showGrid) { this.paintGrid(tile, tileCoords) }
  }

}
