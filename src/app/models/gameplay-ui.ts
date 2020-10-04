export enum TileInfoOverlayId {
  NONE,
  YIELD,
  TEXT
}

export enum TileResourceOverlayId {
  NONE,
  ALL,
  BONUS,
  STRATEGIC,
  LUXURY
}

export interface GameplayUi {
  infoOverlay: TileInfoOverlayId;
  resourceOverlay: TileResourceOverlayId
  showGrid: boolean;
  showMinimap: boolean;
}
