import {Injectable} from '@angular/core';

import {KeyCodeId, KeyBinding, KeyBindings, UserActionId} from '../models/key-bindings';

import {KEY_MODIFIER_ALT, KEY_MODIFIER_CTRL, KEY_MODIFIER_NONE, KEY_MODIFIER_SHIFT} from '../consts/key-bindings.const';

@Injectable({providedIn: 'root'})
export class KeyboardService {

  public keyBindingFromEvent(event: KeyboardEvent): KeyBinding {
    const keyCode = event.code as KeyCodeId;

    let modifiers = KEY_MODIFIER_NONE;
    if (event.shiftKey) { modifiers += KEY_MODIFIER_SHIFT; }
    if (event.ctrlKey) { modifiers += KEY_MODIFIER_CTRL; }
    if (event.altKey) { modifiers += KEY_MODIFIER_ALT; }

    return {keyCode, modifiers};
  }

  public findMatchingActionId(keyBindings: KeyBindings, keyBinding: KeyBinding): UserActionId {
    const userActionIds: UserActionId[] = Object.keys(keyBindings).map(id => id as undefined as UserActionId);
    for (const userActionId of userActionIds) {
      const actionKeyBinding = keyBindings[userActionId];
      if (actionKeyBinding.keyCode === keyBinding.keyCode && actionKeyBinding.modifiers === keyBinding.modifiers) {
        return userActionId;
      }
    }
  }

}
