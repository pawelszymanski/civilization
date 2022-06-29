import {TileInfoOverlayId, GameplayUi, TileResourceOverlayId} from '../models/gameplay-ui';

export const DEFAULT_GAMEPLAY_UI: GameplayUi = {
  infoOverlay: TileInfoOverlayId.NONE,
  resourceOverlay: TileResourceOverlayId.ALL,
  showGrid: true,
  showMinimap: true,
};
