export enum ScreenId {
  MAIN_MENU,
  STRATEGIC_VIEW,
  ISOMETRIC_VIEW
}

export enum ModalId {
  NONE,
  TECH_TREE,
  CIVICS_TREE,
  GAME_OPTIONS
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
  screen: ScreenId;
  modal: ModalId;
  sidebar: SidebarId;
  tileOverlay: TileOverlayId;
}
