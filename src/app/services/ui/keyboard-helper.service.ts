import {Injectable} from '@angular/core';

import {KeyCodeId} from '../../models/ui/key-code.enum';
import {UiActionId} from '../../models/ui/ui-action.enum';
import {KeyBinding, KeyBindings} from '../../models/ui/key-bindings';

import {KEY_MODIFIER_ALT, KEY_MODIFIER_CTRL, KEY_MODIFIER_NONE, KEY_MODIFIER_SHIFT} from '../../consts/ui/key-bindings.const';

@Injectable({providedIn: 'root'})
export class KeyboardHelperService {

  public keyBindingFromEvent(event: KeyboardEvent): KeyBinding {
    const keyCode = event.code as KeyCodeId;

    let modifiers = KEY_MODIFIER_NONE;
    if (event.shiftKey) {modifiers += KEY_MODIFIER_SHIFT}
    if (event.ctrlKey) {modifiers += KEY_MODIFIER_CTRL}
    if (event.altKey) {modifiers += KEY_MODIFIER_ALT}

    return {keyCode, modifiers}
  }

  public findMatchingActionId(keyBindings: KeyBindings, keyBinding: KeyBinding): UiActionId {
    const uiActionIds: UiActionId[] = Object.keys(keyBindings).map(id => id as undefined as UiActionId);
    for (let uiActionId of uiActionIds) {
      const actionKeyBinding = keyBindings[uiActionId];
      if (actionKeyBinding.keyCode === keyBinding.keyCode && actionKeyBinding.modifiers === keyBinding.modifiers) {
        return uiActionId;
      }
    }
  }

}
