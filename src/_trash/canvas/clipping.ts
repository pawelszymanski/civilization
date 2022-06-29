// import {Tile} from '../../app/models/map';
// import {TerrainBaseId} from '../../app/models/terrain';
//
// this.ctx.save();
// this.createTilePathOnCtx(tileCoordsOnCanvas);
// this.ctx.clip();
// this.ctx.restore();
// this.ctx.drawImage(this.img, 0, 0);
//
//
//
//
//
//
// tileFillStyle(tile: Tile): CanvasPattern {
//   let imgElemId;
//   switch (tile.terrain.base.id) {
//     case TerrainBaseId.GRASSLAND_FLAT:
//     case TerrainBaseId.GRASSLAND_HILLS:
//     case TerrainBaseId.GRASSLAND_MOUNTAIN:
//       imgElemId = 'terrain-texture-grassland';
//       break;
//     case TerrainBaseId.PLAINS_FLAT:
//     case TerrainBaseId.PLAINS_HILLS:
//     case TerrainBaseId.PLAINS_MOUNTAIN:
//       imgElemId = 'terrain-texture-plains';
//       break;
//     case TerrainBaseId.DESERT_FLAT:
//     case TerrainBaseId.DESERT_HILLS:
//     case TerrainBaseId.DESERT_MOUNTAIN:
//       imgElemId = 'terrain-texture-desert';
//       break;
//     case TerrainBaseId.TUNDRA_FLAT:
//     case TerrainBaseId.TUNDRA_HILLS:
//     case TerrainBaseId.TUNDRA_MOUNTAIN:
//       imgElemId = 'terrain-texture-tundra';
//       break;
//     case TerrainBaseId.SNOW_FLAT:
//     case TerrainBaseId.SNOW_HILLS:
//     case TerrainBaseId.SNOW_MOUNTAIN:
//       imgElemId = 'terrain-texture-snow';
//       break;
//     case TerrainBaseId.LAKE:
//     case TerrainBaseId.COAST:
//       imgElemId = 'terrain-texture-coast';
//       break;
//     case TerrainBaseId.OCEAN:
//       imgElemId = 'terrain-texture-ocean';
//       break;
//   }
//   const imgElem = document.getElementById(imgElemId) as HTMLImageElement;
//   return this.ctx.createPattern(imgElem, 'repeat');
// }
//
//
//
//
//
// import {TerrainBaseId} from '../models/terrain';
//
// type TerrainBaseImagePathSet = {
//   [key in TerrainBaseId]: string;
// };
//
// export const TERRAIN_BASE_IMAGE_PATHS: TerrainBaseImagePathSet = {
//   [TerrainBaseId.GRASSLAND_FLAT]: '/assets/game-map/terrain/textures/grassland.png',
//   [TerrainBaseId.GRASSLAND_HILLS]: '/assets/game-map/terrain/textures/grassland.png',
//   [TerrainBaseId.GRASSLAND_MOUNTAIN]: '/assets/game-map/terrain/textures/grassland.png',
//   [TerrainBaseId.PLAINS_FLAT]: '/assets/game-map/terrain/textures/plains.png',
//   [TerrainBaseId.PLAINS_HILLS]: '/assets/game-map/terrain/textures/plains.png',
//   [TerrainBaseId.PLAINS_MOUNTAIN]: '/assets/game-map/terrain/textures/plains.png',
//   [TerrainBaseId.DESERT_FLAT]: '/assets/game-map/terrain/textures/desert.png',
//   [TerrainBaseId.DESERT_HILLS]: '/assets/game-map/terrain/textures/desert.png',
//   [TerrainBaseId.DESERT_MOUNTAIN]: '/assets/game-map/terrain/textures/desert.png',
//   [TerrainBaseId.TUNDRA_FLAT]: '/assets/game-map/terrain/textures/tundra.png',
//   [TerrainBaseId.TUNDRA_HILLS]: '/assets/game-map/terrain/textures/tundra.png',
//   [TerrainBaseId.TUNDRA_MOUNTAIN]: '/assets/game-map/terrain/textures/tundra.png',
//   [TerrainBaseId.SNOW_FLAT]: '/assets/game-map/terrain/textures/snow.png',
//   [TerrainBaseId.SNOW_HILLS]: '/assets/game-map/terrain/textures/snow.png',
//   [TerrainBaseId.SNOW_MOUNTAIN]: '/assets/game-map/terrain/textures/snow.png',
//   [TerrainBaseId.LAKE]: '/assets/game-map/terrain/textures/coast.png',
//   [TerrainBaseId.COAST]: '/assets/game-map/terrain/textures/coast.png',
//   [TerrainBaseId.OCEAN]: '/assets/game-map/terrain/textures/ocean.png'
// }
//
//
//
