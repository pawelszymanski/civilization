import {KeyBindings} from '../../models/ui/key-bindings';
import {KeyboardEventCodeId} from '../../models/ui/keyboard-event-code';

export const DEFAULT_KEY_BINDINGS: KeyBindings = {
  toggleTileYield: KeyboardEventCodeId.KeyY,
  toggleTileText: KeyboardEventCodeId.KeyI,
  toggleTechTree: KeyboardEventCodeId.KeyT,
  toggleCivicsTree: KeyboardEventCodeId.KeyC,
  toggleMapEditor: KeyboardEventCodeId.Backquote,
  toggleDevTools: KeyboardEventCodeId.Backquote
}
