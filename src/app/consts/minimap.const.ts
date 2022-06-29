import {TerrainBaseId} from '../models/terrain';

export const MINIMAP_WIDTH = 240;
export const MINIMAP_HEIGHT = 160;

// This is close to ocean tile color. For ocean makes nice place, for terrain adds tiny grid.
// To get rid of the grid probably needs to render bigger map and scale it down.
export const MINIMAP_BACKGROUND_STYLE = '#2b2f55';

export const VIEWPORT_LINE_STYLE = 'white';
export const VIEWPORT_LINE_WIDTH = 1;

export const TERRAIN_BASE_TO_COLOR_MAP = {
  [TerrainBaseId.GRASSLAND_FLAT]: '#708735',
  [TerrainBaseId.GRASSLAND_HILLS]: '#708735',
  [TerrainBaseId.GRASSLAND_MOUNTAIN]: '#708735',
  [TerrainBaseId.PLAINS_FLAT]: '#9fa036',
  [TerrainBaseId.PLAINS_HILLS]: '#9fa036',
  [TerrainBaseId.PLAINS_MOUNTAIN]: '#9fa036',
  [TerrainBaseId.DESERT_FLAT]: '#efca73',
  [TerrainBaseId.DESERT_HILLS]: '#efca73',
  [TerrainBaseId.DESERT_MOUNTAIN]: '#efca73',
  [TerrainBaseId.TUNDRA_FLAT]: '#918f63',
  [TerrainBaseId.TUNDRA_HILLS]: '#918f63',
  [TerrainBaseId.TUNDRA_MOUNTAIN]: '#918f63',
  [TerrainBaseId.SNOW_FLAT]: '#d2e4f5',
  [TerrainBaseId.SNOW_HILLS]: '#d2e4f5',
  [TerrainBaseId.SNOW_MOUNTAIN]: '#d2e4f5',
  [TerrainBaseId.LAKE]: '#2e5878',
  [TerrainBaseId.COAST]: '#2e5878',
  [TerrainBaseId.OCEAN]: '#2b2f55',
};
