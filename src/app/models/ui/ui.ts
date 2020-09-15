export enum MapTypeId {
  STRATEGIC_CANVAS,
  STRATEGIC_HTML,
  ISOMETRIC
}

export enum ModalId {
  NONE,
  TECHNOLOGY_TREE,
  CIVIC_TREE,
  IN_GAME_MENU,
  SAVE_GAME,
  LOAD_GAME,
  GAMEPLAY_OPTIONS_MENU,
  EXIT_GAME_CONFIRMATION
}

export enum SidebarId {
  NONE,
  WORLD_BUILDER,
  DEV_TOOLS
}

export enum TileOverlayId {
  NONE,
  YIELD,
  TEXT
}

export interface Ui {
  mainMenu: boolean;
  mapType: MapTypeId;
  tileOverlay: TileOverlayId;
  modal: ModalId;
  sidebar: SidebarId;
}
