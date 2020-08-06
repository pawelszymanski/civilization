export enum MapTypeId {
  STRATEGIC,
  ISOMETRIC
}

export enum ModalId {
  NONE,
  TECHNOLOGY_TREE,
  CIVIC_TREE,
  IN_GAME_MENU
}

export enum SidebarId {
  NONE,
  MAP_EDITOR,
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