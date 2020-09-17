import {KeyCodeId, KeyBindings, UserActionId} from '../models/key-bindings';

export const KEY_MODIFIER_NONE = 0;
export const KEY_MODIFIER_SHIFT = 1;
export const KEY_MODIFIER_CTRL = 2;
export const KEY_MODIFIER_ALT = 4;

export const DEFAULT_KEY_BINDINGS: KeyBindings = {
  [UserActionId.ESCAPE_VIEW]: {keyCode: KeyCodeId.Escape, modifiers: KEY_MODIFIER_NONE},
  [UserActionId.TOGGLE_TILE_INFO_OVERLAY_YIELD]: {keyCode: KeyCodeId.KeyY, modifiers: KEY_MODIFIER_NONE},
  [UserActionId.TOGGLE_TILE_INFO_OVERLAY_TEXT]: {keyCode: KeyCodeId.KeyI, modifiers: KEY_MODIFIER_NONE},
  [UserActionId.TOGGLE_TILE_RESOURCE_OVERLAY_ALL]: {keyCode: KeyCodeId.KeyR, modifiers: KEY_MODIFIER_NONE},
  [UserActionId.TOGGLE_GRID]: {keyCode: KeyCodeId.KeyG, modifiers: KEY_MODIFIER_NONE},
  [UserActionId.TOGGLE_TECH_TREE]: {keyCode: KeyCodeId.KeyT, modifiers: KEY_MODIFIER_NONE},
  [UserActionId.TOGGLE_CIVICS_TREE]: {keyCode: KeyCodeId.KeyC, modifiers: KEY_MODIFIER_NONE},
  [UserActionId.TOGGLE_MAP_EDITOR]: {keyCode: KeyCodeId.KeyM, modifiers: KEY_MODIFIER_NONE},
  [UserActionId.TOGGLE_DEV_TOOLS]: {keyCode: KeyCodeId.KeyD, modifiers: KEY_MODIFIER_NONE}
}
