import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import {ModalId, ScreenId, SidebarId, TileOverlayId, Ui} from '../models/ui/ui';

import {DEFAULT_UI} from '../consts/ui/ui.const';

@Injectable()
export class UiStore {

  private _ui: BehaviorSubject<Ui> = new BehaviorSubject(DEFAULT_UI);

  public readonly ui: Observable<Ui> = this._ui.asObservable();

  // TOGGLE

  public setScreen(screenId: ScreenId) {
    this._ui.next({...this._ui.value, screen: screenId});
  }

  public toggleModal(modalId: ModalId) {
    const newModalId = this._ui.value.modal === modalId ? ModalId.NONE : modalId;
    this._ui.next({...this._ui.value, modal: newModalId});
  }

  public closeModal() {
    this._ui.next({...this._ui.value, modal: ModalId.NONE});
  }

  public toggleSidebar(sidebarId: SidebarId) {
    const newSidebarId = this._ui.value.sidebar === sidebarId ? SidebarId.NONE : sidebarId;
    this._ui.next({...this._ui.value, sidebar: newSidebarId});
  }

  public closeSidebar() {
    this._ui.next({...this._ui.value, sidebar: SidebarId.NONE});
  }

  public toggleTileOverlay(tileOverlayId) {
    const newTileOverlayId = this._ui.value.tileOverlay === tileOverlayId ? TileOverlayId.NONE : tileOverlayId;
    this._ui.next({...this._ui.value, tileOverlay: newTileOverlayId});
  }

}
