export enum ScreenId {
  MAIN_MENU,
  GAMEPLAY,
}

export enum ModalId {
  NONE,
  TECH_TREE,
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
  screen: ScreenId;
  modal: ModalId;
  sidebar: SidebarId;
}
