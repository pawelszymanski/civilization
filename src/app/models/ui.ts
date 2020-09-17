export enum MapTypeId {
  STRATEGIC,
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

export interface Ui {
  showMainMenu: boolean;
  mapType: MapTypeId;
  modal: ModalId;
  sidebar: SidebarId;
}
