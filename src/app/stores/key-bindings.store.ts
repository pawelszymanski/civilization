import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import {KeyBindings} from '../models/ui/key-bindings';

import {DEFAULT_KEY_BINDINGS} from '../consts/ui/key-bindings.const';

@Injectable()
export class KeyBindingsStore {

  private _keyBindings: BehaviorSubject<KeyBindings> = new BehaviorSubject(DEFAULT_KEY_BINDINGS);

  public readonly keyBindings: Observable<KeyBindings> = this._keyBindings.asObservable();

}
