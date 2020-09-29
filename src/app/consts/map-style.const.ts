import {TileHighlightId} from '../models/map';

export const GRID_LINE_WIDTH = 2;
export const GRID_LINE_STYLE = 'rgba(0, 0, 0, 0.10)';

export const TILE_INFO_TEXT_SIZE = 12;
export const TILE_INFO_TEXT_FONT = 'Calibri';
export const TILE_INFO_TEXT_STYLE = 'white';

export const TILE_INFO_TEXT_MIN_TILE_WIDTH = 130;

export const TILE_HIGHLIGHT_ID_TO_COLOR_MAP = {
  [TileHighlightId.WB_TERRAIN_PLACEMENT]: 'rgba(171, 227, 0, 0.5)',
};

// [TileHighlightId.TERRAIN_PLACEMENT_OK]: 'rgba(171, 227, 0, 0.5)',
// [TileHighlightId.TERRAIN_PLACEMENT_ERROR]: 'rgba(255, 0, 25, 0.5)',
