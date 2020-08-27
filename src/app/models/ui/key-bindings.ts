import {KeyCodeId} from './key-code.enum';
import {UiActionId} from './ui-action.enum';

export interface KeyBinding {
  keyCode: KeyCodeId;  // This is event.code, do not confuse with event.keyCode
  modifiers: number;   // Sum of shift, ctrl, alt flags
}

export type KeyBindings = {
  [key in UiActionId]: KeyBinding;
}
