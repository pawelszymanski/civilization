import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import {MapTypeId, ModalId, SidebarId, Ui} from '../models/ui';

import {DEFAULT_UI} from '../consts/ui.const';

@Injectable()
export class UiStore {

  private _ui: BehaviorSubject<Ui> = new BehaviorSubject(DEFAULT_UI);

  public readonly ui: Observable<Ui> = this._ui.asObservable();

  // MAIN MENU
  public hideMainMenu() {
    this._ui.next({...this._ui.value, showMainMenu: false});
  }

  public showMainMenu() {
    this._ui.next({...this._ui.value, showMainMenu: true});
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

  // OTHER
  public escapeView() {
    const ui = this._ui.value;
    if (ui.sidebar !== SidebarId.NONE) { this.closeSidebar(); return; }
    if (ui.modal !== ModalId.NONE) { this.closeModal(); return; }
    if (ui.showMainMenu) { this.openModal(ModalId.EXIT_GAME_CONFIRMATION); return; }
    if (!ui.showMainMenu) { this.openModal(ModalId.IN_GAME_MENU); return; }
  }

}
