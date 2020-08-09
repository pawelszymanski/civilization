import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import {MapTypeId, ModalId, SidebarId, TileOverlayId, Ui} from '../models/ui/ui';

import {DEFAULT_UI} from '../consts/ui/ui.const';

@Injectable()
export class UiStore {

  private _ui: BehaviorSubject<Ui> = new BehaviorSubject(DEFAULT_UI);

  public readonly ui: Observable<Ui> = this._ui.asObservable();

  // MAIN MENU
  public hideMainMenu() {
    this._ui.next({...this._ui.value, mainMenu: false});
  }

  public showMainMenu() {
    this._ui.next({...this._ui.value, mainMenu: true});
  }

  // MAP TYPE
  public setMapType(mapTypeId: MapTypeId) {
    this._ui.next({...this._ui.value, mapType: mapTypeId});
  }

  // MODALS
  public openModal(modalId: ModalId) {
    this._ui.next({...this._ui.value, modal: modalId});
  }

  public closeModal() {
    this._ui.next({...this._ui.value, modal: ModalId.NONE});
  }

  public toggleModal(modalId: ModalId) {
    const newModalId = this._ui.value.modal === modalId ? ModalId.NONE : modalId;
    this._ui.next({...this._ui.value, modal: newModalId});
  }

  // SIDEBARS
  public openSidebar(sidebarId: SidebarId) {
    this._ui.next({...this._ui.value, sidebar: sidebarId});
  }

  public closeSidebar() {
    this._ui.next({...this._ui.value, sidebar: SidebarId.NONE});
  }

  public toggleSidebar(sidebarId: SidebarId) {
    const newSidebarId = this._ui.value.sidebar === sidebarId ? SidebarId.NONE : sidebarId;
    this._ui.next({...this._ui.value, sidebar: newSidebarId});
  }

  // TILE OVERLAY
  public toggleTileOverlay(tileOverlayId: TileOverlayId) {
    const newTileOverlayId = this._ui.value.tileOverlay === tileOverlayId ? TileOverlayId.NONE : tileOverlayId;
    this._ui.next({...this._ui.value, tileOverlay: newTileOverlayId});
  }

  // OTHER
  public escapeView() {
    const ui = this._ui.value;
    if (ui.sidebar !== SidebarId.NONE) { this.closeSidebar(); return; }
    if (ui.modal !== ModalId.NONE) { this.closeModal(); return; }
    if (!ui.mainMenu) { this.openModal(ModalId.IN_GAME_MENU); return; }
  }

}
