import {Camera} from '../models/camera';

export const CAMERA_MIN_ZOOM_LEVEL = -5;
export const CAMERA_MAX_ZOOM_LEVEL = 5;

export const CAMERA_DEFAULT_ZOOM_LEVEL = -2;

export const CAMERA_ZOOM_LEVEL_TO_TILE_SIZE_MAP = {
  '-5': 60,
  '-4': 80,
  '-3': 100,
  '-2': 120,
  '-1': 140,
  0: 160,
  1: 200,
  2: 240,
  3: 280,
  4: 340,
  5: 420
};

export const CAMERA_MIN_TILE_SIZE = 20;
export const CAMERA_MAX_TILE_SIZE = 600;

export const CAMERA_TILE_SIZE_STEP = 1;

export const DEFAULT_CAMERA: Camera = {
  zoomLevel: CAMERA_DEFAULT_ZOOM_LEVEL,
  tileSize: CAMERA_ZOOM_LEVEL_TO_TILE_SIZE_MAP[CAMERA_DEFAULT_ZOOM_LEVEL],
  translate: {x: 0, y: 0}
};

export const CAMERA_MAX_EMPTY_WINDOW_SPACE_PC = 45;
