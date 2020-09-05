import {KeyCodeId} from '../../models/ui/key-code.enum';
import {UiActionId} from '../../models/ui/ui-action.enum';
import {KeyBindings} from '../../models/ui/key-bindings';

export const KEY_MODIFIER_NONE = 0;
export const KEY_MODIFIER_SHIFT = 1;
export const KEY_MODIFIER_CTRL = 2;
export const KEY_MODIFIER_ALT = 4;

export const DEFAULT_KEY_BINDINGS: KeyBindings = {
  [UiActionId.ESCAPE_VIEW]: {keyCode: KeyCodeId.Escape, modifiers: KEY_MODIFIER_NONE},
  [UiActionId.TOGGLE_TILE_YIELD]: {keyCode: KeyCodeId.KeyY, modifiers: KEY_MODIFIER_NONE},
  [UiActionId.TOGGLE_TILE_TEXT]: {keyCode: KeyCodeId.KeyI, modifiers: KEY_MODIFIER_NONE},
  [UiActionId.TOGGLE_TECH_TREE]: {keyCode: KeyCodeId.KeyT, modifiers: KEY_MODIFIER_NONE},
  [UiActionId.TOGGLE_CIVICS_TREE]: {keyCode: KeyCodeId.KeyC, modifiers: KEY_MODIFIER_NONE},
  [UiActionId.TOGGLE_MAP_EDITOR]: {keyCode: KeyCodeId.KeyM, modifiers: KEY_MODIFIER_NONE},
  [UiActionId.TOGGLE_DEV_TOOLS]: {keyCode: KeyCodeId.KeyD, modifiers: KEY_MODIFIER_NONE}
}
