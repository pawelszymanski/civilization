import {KeyBindings} from '../../models/ui/key-bindings';
import {KeyCodeId} from '../../models/ui/key-code';

export const DEFAULT_KEY_BINDINGS: KeyBindings = {
  toggleTileYield: KeyCodeId.KeyY,
  toggleTileText: KeyCodeId.KeyI,
  toggleTechTree: KeyCodeId.KeyT,
  toggleCivicsTree: KeyCodeId.KeyC,
  toggleMapEditor: KeyCodeId.Backquote,
  toggleDevTools: KeyCodeId.Backquote
}
