import {Injectable} from '@angular/core';

import {Tile, Map, TileHighlightId} from '../models/map';
import {MapUi, TileInfoOverlayId} from '../models/map-ui';
import {Camera} from '../models/camera';
import {Size} from '../models/size';

import {
  GRID_LINE_STYLE,
  GRID_LINE_WIDTH,
  TILE_INFO_TEXT_FONT,
  TILE_INFO_TEXT_SIZE,
  TILE_INFO_TEXT_STYLE,
  TILE_HIGHLIGHT_ID_TO_COLOR_MAP,
  TILE_INFO_TEXT_MIN_TILE_WIDTH
} from '../consts/map-style.const';

import {TileUiService} from './tile-ui.service';

import {MapStore} from '../stores/map.store';
import {CameraStore} from '../stores/camera.store';
import {SizeStore} from '../stores/size.store';
import {MapUiStore} from '../stores/map-ui.store';
import {WorldBuilderHoveredTilesStore} from '../stores/world-builder-hovered-tiles.store';

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
  wbHoveredTiles: Tile[] = [];

  ctx: CanvasRenderingContext2D;

  firstRowTiles: Tile[];
  lastRowTiles: Tile[];

  constructor(
    private tileUiService: TileUiService,
    private mapStore: MapStore,
    private cameraStore: CameraStore,
    private sizeStore: SizeStore,
    private mapUiStore: MapUiStore,
    private worldBuilderHoveredTilesStore: WorldBuilderHoveredTilesStore,
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
    this.worldBuilderHoveredTilesStore.wbHoveredTiles.subscribe(wbHoveredTiles => this.wbHoveredTiles = wbHoveredTiles);
  }

  private setCommonStyles(): void {
    this.ctx.lineWidth = GRID_LINE_WIDTH;
    this.ctx.strokeStyle = GRID_LINE_STYLE;

    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'bottom';
    this.ctx.font = `${TILE_INFO_TEXT_SIZE}px ${TILE_INFO_TEXT_FONT}`;
    this.ctx.fillStyle = TILE_INFO_TEXT_STYLE;
  }

  public paintCanvas(ctx: CanvasRenderingContext2D): void {
    if (!this.ctx) { this.ctx = ctx; }  // All public methods need to check if cts is bound to this as those might m
    this.setCommonStyles();
    this.clearCanvas(ctx);

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

    this.wbHoveredTiles.forEach(tile => {
      if (tile.isVisible) { this.paintTileHighlight(tile, TileHighlightId.WB_TERRAIN_PLACEMENT) }
    });
  }

  public clearCanvas(ctx: CanvasRenderingContext2D): void {
    if (!this.ctx) { this.ctx = ctx; }  // All public methods need to check if cts is bound to this
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  private createTilePath(tile: Tile): void {
    this.ctx.beginPath();
    this.ctx.moveTo(tile.px.x + this.size.vertices[0].x, tile.px.y + this.size.vertices[0].y);
    this.ctx.lineTo(tile.px.x + this.size.vertices[1].x, tile.px.y + this.size.vertices[1].y);
    this.ctx.lineTo(tile.px.x + this.size.vertices[2].x, tile.px.y + this.size.vertices[2].y);
    this.ctx.lineTo(tile.px.x + this.size.vertices[3].x, tile.px.y + this.size.vertices[3].y);
    this.ctx.lineTo(tile.px.x + this.size.vertices[4].x, tile.px.y + this.size.vertices[4].y);
    this.ctx.lineTo(tile.px.x + this.size.vertices[5].x, tile.px.y + this.size.vertices[5].y);
    this.ctx.closePath();
  }

  private paintTileInfoText(tile: Tile): void {
    const tileHorizontalCenter = tile.px.x + this.size.tile.halfWidth;
    const tileBottom = tile.px.y + this.size.tile.height;

    this.ctx.fillText(`${tile.grid.x}, ${tile.grid.y}`, tileHorizontalCenter, tileBottom - TILE_INFO_TEXT_SIZE);
    if (this.size.tile.width >= TILE_INFO_TEXT_MIN_TILE_WIDTH) {
      const terrainBaseName = this.terrainBaseNamePipe.transform(tile.terrain.base.id).toUpperCase();
      const terrainFeatureName = this.terrainFeatureNamePipe.transform(tile.terrain.feature.id).toUpperCase();
      const terrainResourceName = this.terrainResourceNamePipe.transform(tile.terrain.resourceId).toUpperCase();
      const terrainImprovementName = this.terrainImprovementNamePipe.transform(tile.terrain.improvementId).toUpperCase();
      this.ctx.fillText(terrainImprovementName, tileHorizontalCenter, tileBottom - ((2 * TILE_INFO_TEXT_SIZE) + 2));
      this.ctx.fillText(terrainResourceName, tileHorizontalCenter, tileBottom - ((3 * TILE_INFO_TEXT_SIZE) + 4));
      this.ctx.fillText(terrainFeatureName, tileHorizontalCenter, tileBottom - ((4 * TILE_INFO_TEXT_SIZE) + 6));
      this.ctx.fillText(terrainBaseName, tileHorizontalCenter, tileBottom - ((5 * TILE_INFO_TEXT_SIZE) + 8));
    }
  }

  private paintTileInfoYield(tile: Tile): void {
    // TODO
  }

  private paintTileHighlight(tile: Tile, tileHighlight: TileHighlightId): void {
    this.ctx.save();
    this.ctx.fillStyle = TILE_HIGHLIGHT_ID_TO_COLOR_MAP[tileHighlight];
    this.createTilePath(tile);
    this.ctx.fill();
    this.ctx.restore();
  }

  private paintRightSideEdges(tile: Tile): void {
    this.ctx.beginPath();
    this.ctx.moveTo(tile.px.x + this.size.vertices[0].x, tile.px.y + this.size.vertices[0].y);
    this.ctx.lineTo(tile.px.x + this.size.vertices[1].x, tile.px.y + this.size.vertices[1].y);
    this.ctx.lineTo(tile.px.x + this.size.vertices[2].x, tile.px.y + this.size.vertices[2].y);
    this.ctx.lineTo(tile.px.x + this.size.vertices[3].x, tile.px.y + this.size.vertices[3].y);
    this.ctx.stroke();
  }

  private paintTopLeftEdge(tile: Tile): void {
    this.ctx.beginPath();
    this.ctx.moveTo(tile.px.x + this.size.vertices[5].x, tile.px.y + this.size.vertices[5].y);
    this.ctx.lineTo(tile.px.x + this.size.vertices[0].x, tile.px.y + this.size.vertices[0].y);
    this.ctx.stroke();
  }

  private paintBottomLeftEdge(tile: Tile): void {
    this.ctx.beginPath();
    this.ctx.moveTo(tile.px.x + this.size.vertices[3].x, tile.px.y + this.size.vertices[3].y);
    this.ctx.lineTo(tile.px.x + this.size.vertices[4].x, tile.px.y + this.size.vertices[4].y);
    this.ctx.stroke();
  }

}

// private paintMapDecoration(): void {
//   this.ctx.fillStyle = 'gray';
//   this.ctx.fillRect(0, this.camera.translate.y - 10, this.ctx.canvas.width, this.size.map.height + 20);
// }

// private setCtxShadow(color: string, blur: number, offsetX: number, offsetY: number): void {
//   this.ctx.shadowColor = color;
//   this.ctx.shadowBlur = blur;
//   this.ctx.shadowOffsetX = offsetX;
//   this.ctx.shadowOffsetY = offsetY;
// }
