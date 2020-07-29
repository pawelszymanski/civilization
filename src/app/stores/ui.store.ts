import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import {Ui} from '../models/ui';

import {DEFAULT_UI} from '../consts/ui.const';

@Injectable()
export class UiStore {

  private _ui: BehaviorSubject<Ui> = new BehaviorSubject(DEFAULT_UI);

  public readonly ui: Observable<Ui> = this._ui.asObservable();

  // SHOW
  public showTileYield() {
    this._ui.next({...this._ui.value, showTileYield: true});
  }

  public showTileInfo() {
    this._ui.next({...this._ui.value, showTileInfo: true});
  }

  public showTechTree() {
    this._ui.next({...this._ui.value, showTechTree: true});
  }

  public showMapEditor() {
    this._ui.next({...this._ui.value, showMapEditor: true});
  }

  public showDevTools() {
    this._ui.next({...this._ui.value, showDevTools: true});
  }

  // HIDE
  public hideTileYield() {
    this._ui.next({...this._ui.value, showTileYield: false});
  }

  public hideTileInfo() {
    this._ui.next({...this._ui.value, showTileInfo: false});
  }

  public hideTechTree() {
    this._ui.next({...this._ui.value, showTechTree: false});
  }

  public hideMapEditor() {
    this._ui.next({...this._ui.value, showMapEditor: false});
  }

  public hideDevTools() {
    this._ui.next({...this._ui.value, showDevTools: false});
  }

  // TOGGLE
  public toggleShowTileYield() {
    this._ui.next({...this._ui.value, showTileYield: !this._ui.value.showTileYield});
  }

  public toggleShowTileInfo() {
    this._ui.next({...this._ui.value, showTileInfo: !this._ui.value.showTileInfo});
  }

  public toggleShowTechTree() {
    this._ui.next({...this._ui.value, showTechTree: !this._ui.value.showTechTree});
  }

  public toggleShowMapEditor() {
    this._ui.next({...this._ui.value, showMapEditor: !this._ui.value.showMapEditor});
  }

  public toggleShowDevTools() {
    this._ui.next({...this._ui.value, showDevTools: !this._ui.value.showDevTools});
  }


}
