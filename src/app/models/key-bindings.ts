export enum KeyCodeId {
  Escape = 'Escape',
  F1 = 'F1',
  F2 = 'F2',
  F3 = 'F3',
  F4 = 'F4',
  F5 = 'F5',
  F6 = 'F6',
  F7 = 'F7',
  F8 = 'F8',
  F9 = 'F9',
  F10 = 'F10',
  F11 = 'F11',
  F12 = 'F11',

  Backquote = 'Backquote',
  Digit1 = 'Digit1',
  Digit2 = 'Digit2',
  Digit3 = 'Digit3',
  Digit4 = 'Digit4',
  Digit5 = 'Digit5',
  Digit6 = 'Digit6',
  Digit7 = 'Digit7',
  Digit8 = 'Digit8',
  Digit9 = 'Digit9',
  Digit10 = 'Digit10',
  Minus = 'Minus',
  Equal = 'Equal',
  Backspace = 'Backspace',

  Tab = 'Tab',
  KeyQ = 'KeyQ',
  KeyW = 'KeyW',
  KeyE = 'KeyE',
  KeyR = 'KeyR',
  KeyT = 'KeyT',
  KeyY = 'KeyY',
  KeyU = 'KeyU',
  KeyI = 'KeyI',
  KeyO = 'KeyO',
  KeyP = 'KeyP',
  BracketLeft = 'BracketLeft',
  BracketRight = 'BracketRight',
  Enter = 'Enter',

  CapsLock = 'CapsLock',
  KeyA = 'KeyA',
  KeyS = 'KeyS',
  KeyD = 'KeyD',
  KeyF = 'KeyF',
  KeyG = 'KeyG',
  KeyH = 'KeyH',
  KeyJ = 'KeyJ',
  KeyK = 'KeyK',
  KeyL = 'KeyL',
  Semicolon = 'Semicolon',
  Quote = 'Quote',
  Backslash = 'Backslash',

  ShiftLeft = 'ShiftLeft',
  IntlBackslash = 'IntlBackslash',
  KeyZ = 'KeyZ',
  KeyX = 'KeyX',
  KeyC = 'KeyC',
  KeyV = 'KeyV',
  KeyB = 'KeyB',
  KeyN = 'KeyN',
  KeyM = 'KeyM',
  Comma = 'Comma',
  Period = 'Period',
  Slash = 'Slash',
  ShiftRight = 'ShiftRight',

  ControlLeft = 'ControlLeft',
  MetaLeft = 'MetaLeft',
  AltLeft = 'AltLeft',
  Space = 'Space',
  AltRight = 'AltRight',
  ContextMenu = 'ContextMenu',
  ControlRight = 'ControlRight',

  ScrollLock = 'ScrollLock',
  Pause = 'Pause',
  Insert = 'Insert',
  Delete = 'Delete',
  Home = 'Home',
  End = 'End',
  PageUp = 'PageUp',
  PageDown = 'PageDown',

  ArrowUp = 'ArrowUp',
  ArrowLeft = 'ArrowLeft',
  ArrowDown = 'ArrowDown',
  ArrowRight = 'ArrowRight',

  NumLock = 'NumLock',
  NumpadAdd = 'NumpadAdd',
  NumpadSubtract = 'NumpadSubtract',
  NumpadMultiply = 'NumpadMultiply',
  NumpadDivide = 'NumpadDivide',
  Numpad1 = 'Numpad1',
  Numpad2 = 'Numpad2',
  Numpad3 = 'Numpad3',
  Numpad4 = 'Numpad4',
  Numpad5 = 'Numpad5',
  Numpad6 = 'Numpad6',
  Numpad7 = 'Numpad7',
  Numpad8 = 'Numpad8',
  Numpad9 = 'Numpad9',
  NumpadEnter = 'NumpadEnter',
  Numpad0 = 'Numpad0',
  NumpadDecimal = 'NumpadDecimal'
}

export enum UserActionId {
  ESCAPE_VIEW,
  TOGGLE_TILE_INFO_OVERLAY_YIELD,
  TOGGLE_TILE_INFO_OVERLAY_TEXT,
  TOGGLE_TILE_RESOURCE_OVERLAY_ALL,
  TOGGLE_MINIMAP,
  TOGGLE_GRID,
  TOGGLE_TECH_TREE,
  TOGGLE_CIVICS_TREE,
  TOGGLE_WORLD_BUILDER,
  TOGGLE_DEV_TOOLS,
}

export interface KeyBinding {
  keyCode: KeyCodeId;  // This is event.code, do not confuse with event.keyCode
  modifiers: number;   // Sum of shift, ctrl, alt flags
}

export type KeyBindings = {
  [key in UserActionId]: KeyBinding;
};
