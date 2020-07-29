import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import {Ui} from '../models/ui';

@Injectable()
export class UiStore {

  readonly DEFAULT_UI: Ui = {
    showDevTools: false,
    showTileYield: false,
    showTileInfo: false,
    showTechTree: true
  }

  private _ui: BehaviorSubject<Ui> = new BehaviorSubject(this.DEFAULT_UI);

  public readonly ui: Observable<Ui> = this._ui.asObservable();

  public setShowTileYield(showTileYield: boolean) {
    this._ui.next({...this._ui.value, showTileYield});
  }

  public setShowTileInfo(showTileInfo: boolean) {
    this._ui.next({...this._ui.value, showTileInfo});
  }

  public setShowTechTree(showTechTree: boolean) {
    this._ui.next({...this._ui.value, showTechTree});
  }

  public setShowDevTools(showDevTools: boolean) {
    this._ui.next({...this._ui.value, showDevTools});
  }

}
