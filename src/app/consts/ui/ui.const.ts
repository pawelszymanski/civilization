import {MapTypeId, ModalId, SidebarId, TileOverlayId, Ui} from '../../models/ui/ui';

export const DEFAULT_UI: Ui = {
  mainMenu: true,
  mapType: MapTypeId.STRATEGIC,
  tileOverlay: TileOverlayId.NONE,
  modal: ModalId.NONE,
  sidebar: SidebarId.NONE
};
