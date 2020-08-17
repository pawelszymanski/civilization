import {Camera} from '../../models/camera/camera';

export const CAMERA_MIN_ZOOM_LEVEL = -5;
export const CAMERA_MAX_ZOOM_LEVEL = 5;

export const CAMERA_DEFAULT_ZOOM_LEVEL = -2;

export const CAMERA_ZOOM_LEVEL_TO_TILE_SIZE_MAP = {
  '-5': 40,
  '-4': 60,
  '-3': 80,
  '-2': 100,
  '-1': 120,
  '0': 140,
  '1': 160,
  '2': 180,
  '3': 200,
  '4': 240,
  '5': 300
}

export const CAMERA_MIN_TILE_SIZE = CAMERA_ZOOM_LEVEL_TO_TILE_SIZE_MAP[CAMERA_MIN_ZOOM_LEVEL];
export const CAMERA_MAX_TILE_SIZE = CAMERA_ZOOM_LEVEL_TO_TILE_SIZE_MAP[CAMERA_MAX_ZOOM_LEVEL];

export const CAMERA_TILE_SIZE_STEP = 20;

export const CAMERA_DEFAULT_PERSPECTIVE = 1000;

export const DEFAULT_CAMERA: Camera = {
  zoomLevel: CAMERA_DEFAULT_ZOOM_LEVEL,
  tileSize: CAMERA_ZOOM_LEVEL_TO_TILE_SIZE_MAP[CAMERA_DEFAULT_ZOOM_LEVEL],
  translate: {x: 0, y: 0}
}
