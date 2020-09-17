import {TileInfoOverlayId, MapUi, TileResourceOverlayId} from '../models/map-ui';

export const DEFAULT_MAP_UI: MapUi = {
  infoOverlay: TileInfoOverlayId.NONE,
  resourceOverlay: TileResourceOverlayId.ALL,
  showGrid: true
};
