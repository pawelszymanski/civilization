import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import {Ui} from '../models/ui';

@Injectable()
export class UiStore {

  readonly DEFAULT_UI: Ui = {
    showDevTools: true,
    showTileYield: false,
    showTileInfo: false
  }

  private _ui: BehaviorSubject<Ui> = new BehaviorSubject(this.DEFAULT_UI);

  public readonly ui: Observable<Ui> = this._ui.asObservable();

  public setShowTileYield(_yield: boolean) {
    this._ui.next({...this._ui.value, showTileYield: _yield});
  }

  public setShowTileInfo(_yield: boolean) {
    this._ui.next({...this._ui.value, showTileInfo: _yield});
  }

  public setShowDevTools(showDevTools: boolean) {
    this._ui.next({...this._ui.value, showDevTools: showDevTools});
  }

}
