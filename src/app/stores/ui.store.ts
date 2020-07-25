import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import {Ui} from '../models/ui';

@Injectable()
export class UiStore {

  readonly DEFAULT_UI: Ui = {
    devTools: true,
    yield: true
  }

  private _ui: BehaviorSubject<Ui> = new BehaviorSubject(this.DEFAULT_UI);

  public readonly ui: Observable<Ui> = this._ui.asObservable();

  public setYield(_yield: boolean) {
    this._ui.next({...this._ui.value, yield: _yield});
  }

  public setIsDevToolsShown(isDevToolsShown: boolean) {
    this._ui.next({...this._ui.value, devTools: isDevToolsShown});
  }

}
