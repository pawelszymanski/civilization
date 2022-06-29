import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import {KeyBindings} from '../models/key-bindings';

import {DEFAULT_KEY_BINDINGS} from '../consts/key-bindings.const';

@Injectable()
export class KeyBindingsStore {

  // tslint:disable-next-line:variable-name
  private _keyBindings: BehaviorSubject<KeyBindings> = new BehaviorSubject(DEFAULT_KEY_BINDINGS);

  public readonly keyBindings: Observable<KeyBindings> = this._keyBindings.asObservable();

}
