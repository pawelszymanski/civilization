import { Injectable } from '@angular/core';

import { TerrainBaseId, TerrainFeatureId, TerrainImprovementId, TerrainResourceId, TerrainResourceTypeId } from '../models/terrain';
import { Coords } from '../models/utils';
import { Map, Tile } from '../models/map';
import { LandmassAmountId, MapGeneratorSettings, RainfallId, TemperatureId, WorldAgeId } from '../models/map-generator';

import { TERRAIN_BASE_SET, TERRAIN_FEATURE_SET, TERRAIN_RESOURCE_LIST } from '../consts/terrain.const';
import { MAP_SIZE_SETTINGS_LIST } from '../consts/map-size-settings.const';

import { TileYieldService } from './tile-yield.service';

interface Cell {
  x: number;
  y: number;
  plateId: number;
  isLand: boolean;
  elevation: number;
  temperature: number;
  moisture: number;
}

interface Plate {
  id: number;
  seedX: number;
  seedY: number;
  target: number;
  grown: number;
  isContinent: boolean;
  isArchipelago: boolean;
  parentPlateId: number;
}

interface MapGenContext {
  width: number;
  height: number;
  settings: MapGeneratorSettings;
  seed: number;
  rnd: () => number;
  noise: (x: number, y: number) => number;
  idx: (x: number, y: number) => number;
  neighbors: (x: number, y: number) => Coords[];
  inBounds: (x: number, y: number) => boolean;
  cells: Cell[];
  plates: Plate[];
  baseAssignment: TerrainBaseId[];
  featureAssignment: TerrainFeatureId[];
  resourceAssignment: TerrainResourceId[];
  landPct: number;
  mountainMult: number;
  tempOffset: number;
  rainfallOffset: number;
  desertMult: number;
  hillsMountainMult: number;
  forestMult: number;
  continentCount: number;
  islandCount: number;
  archipelagoCount: number;
  polarMargin: number;
  polarRowCount: number;
  continentLand: number;
  islandLandTotal: number;
  equatorY: number;
}

const LAND_PCT_BY_LANDMASS: { [k in LandmassAmountId]: number } = {
  [LandmassAmountId.LEAST]: 0.1,
  [LandmassAmountId.LESS]: 0.17,
  [LandmassAmountId.STANDARD]: 0.25,
  [LandmassAmountId.MORE]: 0.32,
  [LandmassAmountId.MOST]: 0.4,
};
const MOUNTAIN_MULT_BY_AGE: { [k in WorldAgeId]: number } = {
  [WorldAgeId.NEW]: 1.4,
  [WorldAgeId.STANDARD]: 1.0,
  [WorldAgeId.OLD]: 0.5,
};
const TEMP_OFFSET_BY_ID: { [k in TemperatureId]: number } = {
  [TemperatureId.HOT]: 0.1,
  [TemperatureId.STANDARD]: 0.0,
  [TemperatureId.COLD]: -0.1,
};
const RAINFALL_OFFSET_BY_ID: { [k in RainfallId]: number } = {
  [RainfallId.DRY]: -0.15,
  [RainfallId.STANDARD]: 0.0,
  [RainfallId.WET]: 0.15,
};
const DESERT_MULT_BY_RAINFALL: { [k in RainfallId]: number } = {
  [RainfallId.DRY]: 1.1,
  [RainfallId.STANDARD]: 1.0,
  [RainfallId.WET]: 0.9,
};
const DESERT_MULT_BY_TEMPERATURE: { [k in TemperatureId]: number } = {
  [TemperatureId.HOT]: 1.1,
  [TemperatureId.STANDARD]: 1.0,
  [TemperatureId.COLD]: 0.8,
};
const HILLS_MOUNTAIN_MULT_BY_AGE: { [k in WorldAgeId]: number } = {
  [WorldAgeId.NEW]: 1.2,
  [WorldAgeId.STANDARD]: 1.0,
  [WorldAgeId.OLD]: 0.8,
};
const FOREST_MULT_BY_AGE: { [k in WorldAgeId]: number } = {
  [WorldAgeId.NEW]: 0.8,
  [WorldAgeId.STANDARD]: 1.0,
  [WorldAgeId.OLD]: 1.2,
};

const DEBUG_FOOD_BY_INDEX: TerrainResourceId[] = [
  TerrainResourceId.WHEAT,
  TerrainResourceId.RICE,
  TerrainResourceId.CATTLE,
  TerrainResourceId.SHEEP,
  TerrainResourceId.BANANAS,
  TerrainResourceId.FISH,
];

const FLAT_TO_HILLS: { [k: number]: TerrainBaseId } = {
  [TerrainBaseId.GRASSLAND_FLAT]: TerrainBaseId.GRASSLAND_HILLS,
  [TerrainBaseId.PLAINS_FLAT]: TerrainBaseId.PLAINS_HILLS,
  [TerrainBaseId.DESERT_FLAT]: TerrainBaseId.DESERT_HILLS,
  [TerrainBaseId.TUNDRA_FLAT]: TerrainBaseId.TUNDRA_HILLS,
  [TerrainBaseId.SNOW_FLAT]: TerrainBaseId.SNOW_HILLS,
};
const HILLS_TO_MOUNTAIN: { [k: number]: TerrainBaseId } = {
  [TerrainBaseId.GRASSLAND_HILLS]: TerrainBaseId.GRASSLAND_MOUNTAIN,
  [TerrainBaseId.PLAINS_HILLS]: TerrainBaseId.PLAINS_MOUNTAIN,
  [TerrainBaseId.DESERT_HILLS]: TerrainBaseId.DESERT_MOUNTAIN,
  [TerrainBaseId.TUNDRA_HILLS]: TerrainBaseId.TUNDRA_MOUNTAIN,
  [TerrainBaseId.SNOW_HILLS]: TerrainBaseId.SNOW_MOUNTAIN,
};
const MOUNTAIN_TO_HILLS: { [k: number]: TerrainBaseId } = {
  [TerrainBaseId.GRASSLAND_MOUNTAIN]: TerrainBaseId.GRASSLAND_HILLS,
  [TerrainBaseId.PLAINS_MOUNTAIN]: TerrainBaseId.PLAINS_HILLS,
  [TerrainBaseId.DESERT_MOUNTAIN]: TerrainBaseId.DESERT_HILLS,
  [TerrainBaseId.TUNDRA_MOUNTAIN]: TerrainBaseId.TUNDRA_HILLS,
  [TerrainBaseId.SNOW_MOUNTAIN]: TerrainBaseId.SNOW_HILLS,
};

function isFlatLand(b: TerrainBaseId): boolean {
  return FLAT_TO_HILLS[b] !== undefined;
}
function isHillsLand(b: TerrainBaseId): boolean {
  return HILLS_TO_MOUNTAIN[b] !== undefined;
}
function isMountainLand(b: TerrainBaseId): boolean {
  return MOUNTAIN_TO_HILLS[b] !== undefined;
}
function toHills(b: TerrainBaseId): TerrainBaseId {
  return FLAT_TO_HILLS[b] ?? b;
}
function toMountain(b: TerrainBaseId): TerrainBaseId {
  return HILLS_TO_MOUNTAIN[b] ?? b;
}
function demoteToHills(b: TerrainBaseId): TerrainBaseId {
  return MOUNTAIN_TO_HILLS[b] ?? b;
}

function ridge(noise: (x: number, y: number) => number, x: number, y: number, scale: number, ox: number, oy: number): number {
  return Math.abs(noise(x * scale + ox, y * scale + oy) - 0.5) * 2;
}

function offsetToCube(col: number, row: number): [number, number, number] {
  const x = col - Math.floor((row - (row & 1)) / 2);
  return [x, -x - row, row];
}
function cubeToOffset(x: number, z: number): [number, number] {
  return [x + Math.floor((z - (z & 1)) / 2), z];
}
function cubeRound(fx: number, fy: number, fz: number): [number, number, number] {
  let rx = Math.round(fx);
  let ry = Math.round(fy);
  let rz = Math.round(fz);
  const dx = Math.abs(rx - fx);
  const dy = Math.abs(ry - fy);
  const dz = Math.abs(rz - fz);
  if (dx > dy && dx > dz) rx = -ry - rz;
  else if (dy > dz) ry = -rx - rz;
  else rz = -rx - ry;
  return [rx, ry, rz];
}

function hexDistance(cells: Cell[], width: number, aIdx: number, bIdx: number): number {
  const a = cells[aIdx];
  const b = cells[bIdx];
  let bxNear = b.x;
  if (b.x - a.x > width / 2) bxNear -= width;
  else if (a.x - b.x > width / 2) bxNear += width;
  const [ax, ay, az] = offsetToCube(a.x, a.y);
  const [bx, by, bz] = offsetToCube(bxNear, b.y);
  return Math.max(Math.abs(ax - bx), Math.abs(ay - by), Math.abs(az - bz));
}

@Injectable({ providedIn: 'root' })
export class MapGeneratorService {
  constructor(private tileYieldService: TileYieldService) {}

  public generateNewGameMap(settings: MapGeneratorSettings): Map {
    const ctx = this.initContext(settings);

    this.seedContinents(ctx);
    this.growContinentPlates(ctx);
    this.carveContinentBays(ctx);

    this.placeIcecapSnow(ctx);
    this.placeIcecapIceBelt(ctx);

    this.computeElevation(ctx);
    this.computeTemperature(ctx);
    this.computeMoisture(ctx);
    this.paintInitialBiomes(ctx);

    this.seedIslands(ctx);
    this.growIslandPlates(ctx);

    this.seedArchipelagos(ctx);
    this.growArchipelagoPlates(ctx);

    this.detectInlandLakes(ctx);
    this.applyCoastBand(ctx);

    this.resetLandAndClearFeatures(ctx);

    this.paintLatitudeBiomes(ctx);
    this.smoothBiomes(ctx);
    this.promoteHighLatitudeTundraToSnow(ctx);
    this.intrudeTundraWithFingers(ctx);
    this.speckleTundraNearEquator(ctx);
    this.convertGrasslandToPlains(ctx);
    this.mixPlainsAndGrassland(ctx);
    this.lockArchipelagoTemperatureFamily(ctx);
    this.removeIceNextToTundra(ctx);

    this.promoteFlatToHills(ctx);
    this.promoteRidgeHillsToMountain(ctx);
    this.removeIsolatedMountains(ctx);
    this.linkNearbyMountains(ctx);
    this.extendSmallMountainClusters(ctx);

    this.clearAllResources(ctx);
    this.addTerrainFeatures(ctx);
    this.sanityLandCleanup(ctx);
    this.addMainResources(ctx);
    this.addExtraFood(ctx);

    return this.materializeMap(ctx);
  }

  // ============================================================================
  // Context init
  // ============================================================================

  private initContext(settings: MapGeneratorSettings): MapGenContext {
    const width = settings.width;
    const height = settings.height;

    let prngState = settings.seed >>> 0;
    const rnd = (): number => {
      prngState = (prngState + 0x6d2b79f5) >>> 0;
      let t = prngState;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const noise = (x: number, y: number): number => {
      const v = Math.sin(x * 12.9898 + y * 78.233 + settings.seed * 0.0001) * 43758.5453;
      return v - Math.floor(v);
    };

    const idx = (x: number, y: number): number => (((x % width) + width) % width) * height + y;
    const inBounds = (_x: number, y: number): boolean => y >= 0 && y < height;

    const neighbors = (x: number, y: number): Coords[] => {
      const isOdd = y % 2 === 1;
      const offsets: Coords[] = isOdd
        ? [{ x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: -1 }, { x: 1, y: -1 }, { x: 0, y: 1 }, { x: 1, y: 1 }]
        : [{ x: -1, y: 0 }, { x: 1, y: 0 }, { x: -1, y: -1 }, { x: 0, y: -1 }, { x: -1, y: 1 }, { x: 0, y: 1 }];
      const out: Coords[] = [];
      for (const off of offsets) {
        const ny = y + off.y;
        if (!inBounds(0, ny)) continue;
        out.push({ x: (((x + off.x) % width) + width) % width, y: ny });
      }
      return out;
    };

    const landPct = LAND_PCT_BY_LANDMASS[settings.landmass];
    const totalLandTarget = Math.floor(width * height * landPct);
    const continentLand = Math.floor(totalLandTarget * 0.85);
    const islandLandTotal = totalLandTarget - continentLand;

    const cells: Cell[] = new Array(width * height);
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        cells[idx(x, y)] = { x, y, plateId: -1, isLand: false, elevation: 0, temperature: 0, moisture: 0 };
      }
    }

    return {
      width,
      height,
      settings,
      seed: settings.seed,
      rnd,
      noise,
      idx,
      neighbors,
      inBounds,
      cells,
      plates: [],
      baseAssignment: new Array(cells.length).fill(TerrainBaseId.OCEAN),
      featureAssignment: new Array(cells.length).fill(TerrainFeatureId.NONE),
      resourceAssignment: new Array(cells.length).fill(TerrainResourceId.NONE),
      landPct,
      mountainMult: MOUNTAIN_MULT_BY_AGE[settings.worldAge],
      tempOffset: TEMP_OFFSET_BY_ID[settings.temperature],
      rainfallOffset: RAINFALL_OFFSET_BY_ID[settings.rainfall],
      desertMult: DESERT_MULT_BY_RAINFALL[settings.rainfall] * DESERT_MULT_BY_TEMPERATURE[settings.temperature],
      hillsMountainMult: HILLS_MOUNTAIN_MULT_BY_AGE[settings.worldAge],
      forestMult: FOREST_MULT_BY_AGE[settings.worldAge],
      continentCount: Math.max(1, settings.continents),
      islandCount: Math.max(0, settings.islands),
      archipelagoCount: Math.max(0, settings.archipelagos),
      polarMargin: Math.max(1, Math.floor(height * 0.08)),
      polarRowCount: Math.max(3, Math.min(5, 3 + Math.round(((height - 26) * 2) / (160 - 26)))),
      continentLand,
      islandLandTotal,
      equatorY: (height - 1) / 2,
    };
  }

  // ============================================================================
  // Continents
  // ============================================================================

  private seedContinents(ctx: MapGenContext): void {
    const { width, height, rnd, continentCount, continentLand, plates } = ctx;
    const bandMin = Math.floor(height * 0.2);
    const bandMax = Math.floor(height * 0.8);
    const minSpacing = Math.max(4, Math.floor(width / (continentCount + 1)));

    const weights: number[] = [];
    for (let i = 0; i < continentCount; i++) weights.push(0.3 + rnd() * 2.0);
    const totalWeight = weights.reduce((s, w) => s + w, 0);

    for (let i = 0; i < continentCount; i++) {
      let sx = 0;
      let sy = 0;
      let placed = false;
      for (let attempt = 0; attempt < 30 && !placed; attempt++) {
        sx = Math.floor(rnd() * width);
        sy = bandMin + Math.floor(rnd() * Math.max(1, bandMax - bandMin));
        placed = true;
        for (const p of plates) {
          if (!p.isContinent) continue;
          let dx = Math.abs(p.seedX - sx);
          if (dx > width / 2) dx = width - dx;
          const dy = Math.abs(p.seedY - sy);
          if (dx < minSpacing && dy < minSpacing) {
            placed = false;
            break;
          }
        }
      }
      const id = plates.length;
      plates.push({
        id,
        seedX: sx,
        seedY: sy,
        target: Math.max(8, Math.floor((continentLand * weights[i]) / totalWeight)),
        grown: 0,
        isContinent: true,
        isArchipelago: false,
        parentPlateId: id,
      });
    }
  }

  private growContinentPlates(ctx: MapGenContext): void {
    const continents = ctx.plates.filter(p => p.isContinent);
    this.growPlates(ctx, continents, ctx.continentLand, 5.5);
  }

  private carveContinentBays(ctx: MapGenContext): void {
    const { rnd, idx, cells, neighbors, baseAssignment, resourceAssignment } = ctx;
    const continents = ctx.plates.filter(p => p.isContinent);
    const distToOcean = this.bfsDistance(ctx, i => !cells[i].isLand);

    for (const plate of continents) {
      const interior: Cell[] = [];
      for (const c of cells) {
        if (c.plateId === plate.id && c.isLand && distToOcean[idx(c.x, c.y)] >= 2) interior.push(c);
      }
      if (interior.length < 4) continue;

      const numBays = 4 + Math.floor(rnd() * 5);
      for (let i = 0; i < numBays; i++) {
        let current = interior[Math.floor(rnd() * interior.length)];
        const maxSteps = 5 + Math.floor(rnd() * 8);
        for (let s = 0; s < maxSteps; s++) {
          if (!current.isLand) break;
          const ci = idx(current.x, current.y);
          current.isLand = false;
          current.plateId = -1;
          baseAssignment[ci] = TerrainBaseId.OCEAN;
          resourceAssignment[ci] = TerrainResourceId.NONE;

          const landNbs: Cell[] = [];
          for (const n of neighbors(current.x, current.y)) {
            const nc = cells[idx(n.x, n.y)];
            if (nc.isLand) landNbs.push(nc);
          }
          if (landNbs.length === 0) break;
          if (rnd() < 0.6) {
            landNbs.sort((a, b) => distToOcean[idx(a.x, a.y)] - distToOcean[idx(b.x, b.y)]);
            current = landNbs[0];
          } else {
            current = landNbs[Math.floor(rnd() * landNbs.length)];
          }
        }
      }
    }
  }

  // ============================================================================
  // Lakes
  // ============================================================================

  private detectInlandLakes(ctx: MapGenContext): void {
    const { idx, cells, neighbors, baseAssignment, featureAssignment, resourceAssignment, height, polarRowCount } = ctx;
    const visited = new Array<boolean>(cells.length).fill(false);
    const isPolar = (y: number): boolean => y < polarRowCount || y >= height - polarRowCount;

    for (let i = 0; i < cells.length; i++) {
      if (baseAssignment[i] !== TerrainBaseId.OCEAN || visited[i]) continue;
      if (isPolar(cells[i].y)) continue;
      const comp: number[] = [];
      const stack = [i];
      visited[i] = true;
      while (stack.length > 0) {
        const cur = stack.pop();
        comp.push(cur);
        const cc = cells[cur];
        for (const n of neighbors(cc.x, cc.y)) {
          if (isPolar(n.y)) continue;
          const ni = idx(n.x, n.y);
          if (baseAssignment[ni] === TerrainBaseId.OCEAN && !visited[ni]) {
            visited[ni] = true;
            stack.push(ni);
          }
        }
      }
      if (comp.length > 6) continue;
      for (const cIdx of comp) {
        baseAssignment[cIdx] = TerrainBaseId.LAKE;
        if (featureAssignment[cIdx] === TerrainFeatureId.ICE) featureAssignment[cIdx] = TerrainFeatureId.NONE;
        resourceAssignment[cIdx] = TerrainResourceId.FISH;
      }
    }
  }

  // ============================================================================
  // Ice caps
  // ============================================================================

  private placeIcecapSnow(ctx: MapGenContext): void {
    const { width, height, rnd, idx, neighbors, cells, baseAssignment, featureAssignment, resourceAssignment, polarRowCount } = ctx;

    const placeSnowOrIce = (i: number): void => {
      if (rnd() < 0.25) {
        baseAssignment[i] = TerrainBaseId.OCEAN;
        featureAssignment[i] = TerrainFeatureId.ICE;
        cells[i].isLand = false;
        cells[i].plateId = -1;
        resourceAssignment[i] = TerrainResourceId.NONE;
      } else {
        baseAssignment[i] = TerrainBaseId.SNOW_FLAT;
      }
    };

    for (let x = 0; x < width; x++) {
      placeSnowOrIce(idx(x, 0));
      placeSnowOrIce(idx(x, height - 1));
    }
    if (polarRowCount >= 2) {
      for (let x = 0; x < width; x++) {
        if (rnd() < 0.5) placeSnowOrIce(idx(x, 1));
        if (rnd() < 0.5) placeSnowOrIce(idx(x, height - 2));
      }
    }
    if (polarRowCount >= 3) {
      const fringeProb = 0.05 + rnd() * 0.05;
      for (let x = 0; x < width; x++) {
        for (const y of [2, height - 3]) {
          const i = idx(x, y);
          let connected = false;
          for (const n of neighbors(x, y)) {
            const ni = idx(n.x, n.y);
            if (baseAssignment[ni] === TerrainBaseId.SNOW_FLAT || featureAssignment[ni] === TerrainFeatureId.ICE) {
              connected = true;
              break;
            }
          }
          if (connected && rnd() < fringeProb) placeSnowOrIce(i);
        }
      }
    }
  }

  private placeIcecapIceBelt(ctx: MapGenContext): void {
    const { width, height, noise, idx, neighbors, baseAssignment, featureAssignment, polarRowCount } = ctx;
    const beltProbs = [0.3, 0.2, 0.1, 0.05];
    const bands: { y: number; prob: number }[] = [];
    for (let r = 1; r < polarRowCount; r++) {
      const prob = beltProbs[r - 1] ?? 0.05;
      bands.push({ y: r, prob });
      bands.push({ y: height - 1 - r, prob });
    }
    for (const band of bands) {
      if (band.y < 0 || band.y >= height) continue;
      for (let x = 0; x < width; x++) {
        const i = idx(x, band.y);
        if (baseAssignment[i] !== TerrainBaseId.OCEAN) continue;
        let connected = false;
        for (const n of neighbors(x, band.y)) {
          const ni = idx(n.x, n.y);
          if (baseAssignment[ni] === TerrainBaseId.SNOW_FLAT || featureAssignment[ni] === TerrainFeatureId.ICE) {
            connected = true;
            break;
          }
        }
        if (connected && noise(x * 0.5 + 13, band.y * 0.5 + 17) < band.prob) {
          featureAssignment[i] = TerrainFeatureId.ICE;
        }
      }
    }
  }

  // ============================================================================
  // Climate + initial biomes
  // ============================================================================

  private computeElevation(ctx: MapGenContext): void {
    const { rnd, noise, idx, cells, neighbors } = ctx;
    for (const cell of cells) {
      if (!cell.isLand) {
        cell.elevation = 0;
        continue;
      }
      let e = 0.35 + rnd() * 0.2;
      e += ridge(noise, cell.x, cell.y, 0.14, 333, 777) * 0.35;
      e += (noise(cell.x * 0.08 + 51, cell.y * 0.08 + 19) - 0.5) * 0.3;
      let touchesOtherPlate = false;
      let touchesOcean = false;
      for (const n of neighbors(cell.x, cell.y)) {
        const nc = cells[idx(n.x, n.y)];
        if (!nc.isLand) touchesOcean = true;
        else if (nc.plateId !== cell.plateId) touchesOtherPlate = true;
      }
      if (touchesOtherPlate) e += 0.35 + rnd() * 0.35;
      if (touchesOcean) e -= 0.2;
      cell.elevation = Math.max(0, e);
    }

    const smoothed = new Array<number>(cells.length);
    for (const cell of cells) {
      if (!cell.isLand) {
        smoothed[idx(cell.x, cell.y)] = 0;
        continue;
      }
      let sum = cell.elevation;
      let n = 1;
      for (const nb of neighbors(cell.x, cell.y)) {
        const nc = cells[idx(nb.x, nb.y)];
        if (nc.isLand) {
          sum += nc.elevation;
          n += 1;
        }
      }
      smoothed[idx(cell.x, cell.y)] = sum / n;
    }
    for (const cell of cells) cell.elevation = smoothed[idx(cell.x, cell.y)];
  }

  private computeTemperature(ctx: MapGenContext): void {
    const { noise, cells, tempOffset, equatorY } = ctx;
    for (const cell of cells) {
      const latNorm = Math.abs(cell.y - equatorY) / equatorY;
      let t = 1 - latNorm + tempOffset + (noise(cell.x * 0.13, cell.y * 0.13) - 0.5) * 0.15;
      if (cell.isLand) t -= Math.max(0, cell.elevation - 0.4) * 0.5;
      cell.temperature = Math.min(1, Math.max(0, t));
    }
  }

  private computeMoisture(ctx: MapGenContext): void {
    const { noise, idx, cells, rainfallOffset, equatorY } = ctx;
    const latMoisture = (y: number): number => {
      const latNorm = Math.abs(y - equatorY) / equatorY;
      if (latNorm < 0.33) return 0.75 - latNorm * (0.55 / 0.33);
      if (latNorm < 0.55) return 0.2 + ((latNorm - 0.33) / 0.22) * 0.35;
      return 0.55 - ((latNorm - 0.55) / 0.45) * 0.45;
    };
    for (const cell of cells) {
      if (!cell.isLand) {
        cell.moisture = 0.7;
        continue;
      }
      let m = latMoisture(cell.y);
      let blocked = false;
      for (let step = 1; step <= 4 && !blocked; step++) {
        const up = cells[idx(cell.x - step, cell.y)];
        if (!up.isLand) m += 0.2 * (1 - (step - 1) * 0.2);
        else if (up.elevation >= 0.85) {
          m -= 0.3;
          blocked = true;
        }
      }
      m += rainfallOffset + (noise(cell.x * 0.21 + 99, cell.y * 0.21 + 31) - 0.5) * 0.1;
      cell.moisture = Math.min(1, Math.max(0, m));
    }
  }

  private paintInitialBiomes(ctx: MapGenContext): void {
    const { rnd, idx, cells, baseAssignment, mountainMult } = ctx;
    const pickLand = (cell: Cell): TerrainBaseId => {
      const mountainCutoff = 0.95 - mountainMult * 0.1;
      let suffix: 'FLAT' | 'HILLS' | 'MOUNTAIN' = 'FLAT';
      if (cell.elevation >= mountainCutoff && rnd() < mountainMult) suffix = 'MOUNTAIN';
      else if (cell.elevation >= 0.48) suffix = 'HILLS';
      let family: 'SNOW' | 'TUNDRA' | 'GRASSLAND' | 'PLAINS' | 'DESERT';
      if (cell.temperature < 0.2) family = 'SNOW';
      else if (cell.temperature < 0.4) family = 'TUNDRA';
      else if (cell.temperature >= 0.75) family = cell.moisture < 0.3 ? 'DESERT' : 'PLAINS';
      else family = cell.moisture < 0.3 ? 'PLAINS' : 'GRASSLAND';
      return TerrainBaseId[`${family}_${suffix}` as keyof typeof TerrainBaseId];
    };
    for (const cell of cells) {
      const i = idx(cell.x, cell.y);
      if (baseAssignment[i] === TerrainBaseId.SNOW_FLAT) continue;
      baseAssignment[i] = cell.isLand ? pickLand(cell) : TerrainBaseId.OCEAN;
    }
  }

  private applyCoastBand(ctx: MapGenContext): void {
    const { idx, cells, neighbors, baseAssignment, height, polarRowCount, polarMargin } = ctx;
    const isIcecapContinent = (y: number, base: TerrainBaseId): boolean =>
      base === TerrainBaseId.SNOW_FLAT && (y < polarMargin || y >= height - polarMargin);
    for (const cell of cells) {
      if (cell.y < polarRowCount || cell.y >= height - polarRowCount) continue;
      const i = idx(cell.x, cell.y);
      if (baseAssignment[i] !== TerrainBaseId.OCEAN) continue;
      for (const n of neighbors(cell.x, cell.y)) {
        const nb = baseAssignment[idx(n.x, n.y)];
        if (isIcecapContinent(n.y, nb)) continue;
        if (nb !== TerrainBaseId.OCEAN && nb !== TerrainBaseId.COAST && nb !== TerrainBaseId.LAKE) {
          baseAssignment[i] = TerrainBaseId.COAST;
          break;
        }
      }
    }
  }

  // ============================================================================
  // Islands
  // ============================================================================

  private seedIslands(ctx: MapGenContext): void {
    const { width, height, rnd, idx, cells, neighbors, islandCount, islandLandTotal, polarMargin, plates, baseAssignment } = ctx;

    const actualCount = Math.max(0, islandCount);
    if (actualCount === 0) return;
    const meanSize = Math.max(1, islandLandTotal / actualCount);
    const rawTargets: number[] = [];
    for (let i = 0; i < actualCount; i++) {
      rawTargets.push(Math.max(1, Math.round(-Math.log(Math.max(0.0001, rnd())) * meanSize * 0.6 + 1)));
    }
    const rawSum = rawTargets.reduce((s, w) => s + w, 0);
    const factor = rawSum > 0 ? islandLandTotal / rawSum : 1;
    const normalized = factor < 0.9 || factor > 1.1 ? rawTargets.map(t => Math.max(1, Math.round(t * factor))) : rawTargets;
    const avgContinentSize = ctx.continentLand / Math.max(1, ctx.continentCount);
    const maxIslandSize = Math.max(1, Math.floor(avgContinentSize * 0.35));
    const islandTargets = normalized.map(t => Math.min(t, maxIslandSize));

    const continentsExist = cells.some(c => c.isLand && c.plateId >= 0);
    const distToLand: number[] = new Array(cells.length).fill(99);
    const nearestContinent: number[] = new Array(cells.length).fill(-1);
    const seedCandidates: number[] = [];

    if (continentsExist) {
      const dq: number[] = [];
      for (let i = 0; i < cells.length; i++) {
        if (baseAssignment[i] !== TerrainBaseId.OCEAN) {
          distToLand[i] = 0;
          dq.push(i);
        }
      }
      let head = 0;
      while (head < dq.length) {
        const cur = dq[head++];
        const next = distToLand[cur] + 1;
        if (next > 7) continue;
        const cc = cells[cur];
        for (const nb of neighbors(cc.x, cc.y)) {
          const ni = idx(nb.x, nb.y);
          if (distToLand[ni] > next) {
            distToLand[ni] = next;
            dq.push(ni);
          }
        }
      }

      const dq2: number[] = [];
      const ncDist = new Array(cells.length).fill(99);
      for (let i = 0; i < cells.length; i++) {
        if (cells[i].isLand && cells[i].plateId >= 0) {
          ncDist[i] = 0;
          nearestContinent[i] = cells[i].plateId;
          dq2.push(i);
        }
      }
      let head2 = 0;
      while (head2 < dq2.length) {
        const cur = dq2[head2++];
        const next = ncDist[cur] + 1;
        if (next > 12) continue;
        const cc = cells[cur];
        for (const nb of neighbors(cc.x, cc.y)) {
          const ni = idx(nb.x, nb.y);
          if (ncDist[ni] > next) {
            ncDist[ni] = next;
            nearestContinent[ni] = nearestContinent[cur];
            dq2.push(ni);
          }
        }
      }

      for (let i = 0; i < cells.length; i++) {
        const c = cells[i];
        if (baseAssignment[i] !== TerrainBaseId.OCEAN) continue;
        if (c.y < polarMargin || c.y >= height - polarMargin) continue;
        if (distToLand[i] >= 2 && distToLand[i] <= 6) seedCandidates.push(i);
      }
    }

    for (let i = 0; i < actualCount; i++) {
      let sx: number;
      let sy: number;
      let parentPlateId: number;
      if (seedCandidates.length > 0) {
        const seedIdx = seedCandidates[Math.floor(rnd() * seedCandidates.length)];
        sx = cells[seedIdx].x;
        sy = cells[seedIdx].y;
        parentPlateId = nearestContinent[seedIdx];
      } else {
        sx = Math.floor(rnd() * width);
        sy = polarMargin + Math.floor(rnd() * (height - polarMargin * 2));
        parentPlateId = plates.length + i;
      }
      const id = plates.length + i;
      plates.push({
        id,
        seedX: sx,
        seedY: sy,
        target: islandTargets[i],
        grown: 0,
        isContinent: false,
        isArchipelago: false,
        parentPlateId,
      });
    }
  }

  private growIslandPlates(ctx: MapGenContext): void {
    const islands = ctx.plates.filter(p => !p.isContinent && !p.isArchipelago);
    this.growPlates(ctx, islands, ctx.islandLandTotal, 7.0);
  }

  // ============================================================================
  // Archipelagos
  // ============================================================================

  private seedArchipelagos(ctx: MapGenContext): void {
    const { width, height, rnd, idx, cells, neighbors, polarMargin, plates, baseAssignment, archipelagoCount } = ctx;
    if (archipelagoCount <= 0) return;

    const distToLand = this.bfsDistance(ctx, i => baseAssignment[i] !== TerrainBaseId.OCEAN, 99, 30);

    const candidates: number[] = [];
    const weights: number[] = [];
    for (let i = 0; i < cells.length; i++) {
      const c = cells[i];
      if (baseAssignment[i] !== TerrainBaseId.OCEAN) continue;
      if (c.y < polarMargin || c.y >= height - polarMargin) continue;
      if (distToLand[i] < 3) continue;
      candidates.push(i);
      const capped = Math.min(distToLand[i], 20);
      weights.push(capped * capped);
    }
    if (candidates.length === 0) return;
    const totalWeight = weights.reduce((s, w) => s + w, 0);

    const pickCenter = (): number => {
      let r = rnd() * totalWeight;
      for (let k = 0; k < weights.length; k++) {
        r -= weights[k];
        if (r <= 0) return candidates[k];
      }
      return candidates[candidates.length - 1];
    };

    for (let ai = 0; ai < archipelagoCount; ai++) {
      const center = cells[pickCenter()];
      const subCount = 2 + Math.floor(rnd() * 4);

      const subTargets: number[] = [];
      let largeUsed = 0;
      for (let i = 0; i < subCount; i++) {
        let t = Math.max(1, Math.round(-Math.log(Math.max(0.0001, rnd())) * 1.5));
        if (t > 10) {
          if (largeUsed >= 1) t = 1 + Math.floor(rnd() * 10);
          else {
            largeUsed += 1;
            t = Math.min(15, t);
          }
        }
        subTargets.push(t);
      }

      let clusterId = -1;
      for (let i = 0; i < subCount; i++) {
        let sx = center.x;
        let sy = center.y;
        for (let attempt = 0; attempt < 8; attempt++) {
          const dx = Math.floor(rnd() * 9) - 4;
          const dy = Math.floor(rnd() * 9) - 4;
          const ty = center.y + dy;
          if (ty < polarMargin || ty >= height - polarMargin) continue;
          const tx = (((center.x + dx) % width) + width) % width;
          if (baseAssignment[idx(tx, ty)] === TerrainBaseId.OCEAN) {
            sx = tx;
            sy = ty;
            break;
          }
        }
        const id = plates.length;
        if (i === 0) clusterId = id;
        plates.push({
          id,
          seedX: sx,
          seedY: sy,
          target: subTargets[i],
          grown: 0,
          isContinent: false,
          isArchipelago: true,
          parentPlateId: clusterId,
        });
      }
    }
  }

  private growArchipelagoPlates(ctx: MapGenContext): void {
    const archipelagos = ctx.plates.filter(p => p.isArchipelago);
    if (archipelagos.length === 0) return;
    const totalLand = archipelagos.reduce((s, p) => s + p.target, 0);
    this.growPlates(ctx, archipelagos, totalLand, 7.5);
  }

  // ============================================================================
  // Shared plate growth
  // ============================================================================

  private growPlates(ctx: MapGenContext, newPlates: Plate[], landBudget: number, chaosFactor: number): void {
    const { width, height, rnd, noise, idx, cells, neighbors, polarMargin, baseAssignment, resourceAssignment, featureAssignment, plates } = ctx;

    const continentPlateIds = new Set<number>();
    for (const p of plates) if (p.isContinent) continentPlateIds.add(p.id);
    const adjacentToContinent = (x: number, y: number): boolean => {
      for (const n of neighbors(x, y)) {
        const pid = cells[idx(n.x, n.y)].plateId;
        if (pid >= 0 && continentPlateIds.has(pid)) return true;
      }
      return false;
    };

    const debugFoodFor = (p: Plate): TerrainResourceId => DEBUG_FOOD_BY_INDEX[p.parentPlateId % DEBUG_FOOD_BY_INDEX.length];
    const plateChaos = (x: number, y: number, plateId: number): number => {
      const low = noise(x * 0.17 + plateId * 17.7, y * 0.17 + plateId * 31.3);
      const high = noise(x * 0.55 + plateId * 7.3, y * 0.55 + plateId * 13.1);
      return low + high * 0.6;
    };

    const plateById = new Map<number, Plate>();
    const plateAngleById = new Map<number, number>();
    for (const p of newPlates) {
      plateById.set(p.id, p);
      plateAngleById.set(p.id, rnd() * Math.PI * 2);
    }
    const stretchedDist = (plateId: number, dx: number, dy: number): number => {
      const ang = plateAngleById.get(plateId);
      const cos = Math.cos(ang);
      const sin = Math.sin(ang);
      const xp = dx * cos + dy * sin;
      const yp = -dx * sin + dy * cos;
      return Math.sqrt(xp * xp * 0.4 + yp * yp * 1.6);
    };
    const wrapDx = (dx: number): number => {
      if (dx > width / 2) return dx - width;
      if (dx < -width / 2) return dx + width;
      return dx;
    };
    const defaultBaseFor = (plate: Plate): TerrainBaseId => {
      if (plate.isContinent) return TerrainBaseId.GRASSLAND_FLAT;
      if (plate.isArchipelago) return TerrainBaseId.DESERT_FLAT;
      return TerrainBaseId.PLAINS_FLAT;
    };

    interface Frontier { cellIdx: number; plateId: number; priority: number; }
    const frontier: Frontier[] = [];
    const insertFrontier = (item: Frontier): void => {
      let lo = 0;
      let hi = frontier.length;
      while (lo < hi) {
        const mid = (lo + hi) >>> 1;
        if (frontier[mid].priority < item.priority) lo = mid + 1;
        else hi = mid;
      }
      frontier.splice(lo, 0, item);
    };

    let grown = 0;
    for (const plate of newPlates) {
      const seedIdx = idx(plate.seedX, plate.seedY);
      if (cells[seedIdx].plateId !== -1 || baseAssignment[seedIdx] !== TerrainBaseId.OCEAN) continue;
      cells[seedIdx].plateId = plate.id;
      cells[seedIdx].isLand = true;
      baseAssignment[seedIdx] = defaultBaseFor(plate);
      if (!plate.isArchipelago) resourceAssignment[seedIdx] = debugFoodFor(plate);
      featureAssignment[seedIdx] = TerrainFeatureId.NONE;
      plate.grown += 1;
      grown += 1;
      for (const n of neighbors(plate.seedX, plate.seedY)) {
        const dx = wrapDx(n.x - plate.seedX);
        const dy = n.y - plate.seedY;
        insertFrontier({
          cellIdx: idx(n.x, n.y),
          plateId: plate.id,
          priority: stretchedDist(plate.id, dx, dy) + plateChaos(n.x, n.y, plate.id) * chaosFactor,
        });
      }
    }

    while (frontier.length > 0 && grown < landBudget) {
      const item = frontier.shift();
      const cell = cells[item.cellIdx];
      if (cell.plateId !== -1 || baseAssignment[item.cellIdx] !== TerrainBaseId.OCEAN) continue;
      const plate = plateById.get(item.plateId);
      if (!plate || plate.grown >= plate.target) continue;
      if (cell.y < polarMargin || cell.y >= height - polarMargin) {
        if (rnd() > 0.15) continue;
      }
      if (plate.isArchipelago && adjacentToContinent(cell.x, cell.y)) continue;

      cell.plateId = plate.id;
      cell.isLand = true;
      baseAssignment[item.cellIdx] = defaultBaseFor(plate);
      if (!plate.isArchipelago) resourceAssignment[item.cellIdx] = debugFoodFor(plate);
      featureAssignment[item.cellIdx] = TerrainFeatureId.NONE;
      plate.grown += 1;
      grown += 1;
      for (const n of neighbors(cell.x, cell.y)) {
        const ni = idx(n.x, n.y);
        if (cells[ni].plateId === -1) {
          const dx = wrapDx(n.x - plate.seedX);
          const dy = n.y - plate.seedY;
          const jitter = (rnd() - 0.5) * 2.0;
          insertFrontier({
            cellIdx: ni,
            plateId: plate.id,
            priority: stretchedDist(plate.id, dx, dy) + plateChaos(n.x, n.y, plate.id) * chaosFactor + jitter,
          });
        }
      }
    }
  }

  // ============================================================================
  // Land reset + latitude biomes
  // ============================================================================

  private resetLandAndClearFeatures(ctx: MapGenContext): void {
    const { cells, idx, baseAssignment, featureAssignment, resourceAssignment } = ctx;
    for (const cell of cells) {
      const i = idx(cell.x, cell.y);
      const base = baseAssignment[i];
      const isWater = base === TerrainBaseId.OCEAN || base === TerrainBaseId.COAST || base === TerrainBaseId.LAKE;
      const isSnowCap = base === TerrainBaseId.SNOW_FLAT;
      if (!isWater && !isSnowCap) baseAssignment[i] = TerrainBaseId.GRASSLAND_FLAT;
      if (featureAssignment[i] !== TerrainFeatureId.ICE) featureAssignment[i] = TerrainFeatureId.NONE;
      resourceAssignment[i] = TerrainResourceId.NONE;
    }
  }

  private paintLatitudeBiomes(ctx: MapGenContext): void {
    const { idx, cells, noise, baseAssignment, equatorY, desertMult } = ctx;
    const isPaintable = (i: number): boolean => {
      const b = baseAssignment[i];
      return b !== TerrainBaseId.OCEAN && b !== TerrainBaseId.COAST && b !== TerrainBaseId.LAKE && b !== TerrainBaseId.SNOW_FLAT;
    };
    const bell = (x: number, center: number, sigma: number): number => Math.exp(-((x - center) ** 2) / (2 * sigma * sigma));
    const pick = (lat: number, x: number, y: number): TerrainBaseId => {
      const wDesert = bell(lat, 0.0, 0.12) * desertMult;
      const wPlains = bell(lat, 0.13, 0.10);
      const wGrassland = bell(lat, 0.28, 0.12);
      const wTundra = lat < 0.35 ? 0 : ((lat - 0.35) / 0.65) * 0.64;
      const total = wDesert + wPlains + wGrassland + wTundra;
      let r = noise(x * 0.47 + 3333, y * 0.47 + 5555) * total;
      r -= wDesert; if (r < 0) return TerrainBaseId.DESERT_FLAT;
      r -= wPlains; if (r < 0) return TerrainBaseId.PLAINS_FLAT;
      r -= wGrassland; if (r < 0) return TerrainBaseId.GRASSLAND_FLAT;
      return TerrainBaseId.TUNDRA_FLAT;
    };
    for (const cell of cells) {
      const i = idx(cell.x, cell.y);
      if (!isPaintable(i)) continue;
      const latNorm = Math.abs(cell.y - equatorY) / equatorY;
      const jitter = (noise(cell.x * 0.08 + 71, cell.y * 0.08 + 137) - 0.5) * 0.15;
      baseAssignment[i] = pick(Math.max(0, Math.min(1, latNorm + jitter)), cell.x, cell.y);
    }
  }

  private smoothBiomes(ctx: MapGenContext): void {
    const { idx, cells, neighbors, baseAssignment } = ctx;
    const isPaintable = (i: number): boolean => {
      const b = baseAssignment[i];
      return b !== TerrainBaseId.OCEAN && b !== TerrainBaseId.COAST && b !== TerrainBaseId.LAKE && b !== TerrainBaseId.SNOW_FLAT;
    };
    for (let iter = 0; iter < 3; iter++) {
      const snapshot = baseAssignment.slice();
      for (const cell of cells) {
        const i = idx(cell.x, cell.y);
        if (!isPaintable(i)) continue;
        const counts = new Map<TerrainBaseId, number>();
        const myBiome = snapshot[i];
        counts.set(myBiome, 1);
        for (const n of neighbors(cell.x, cell.y)) {
          const ni = idx(n.x, n.y);
          if (!isPaintable(ni)) continue;
          const nb = snapshot[ni];
          counts.set(nb, (counts.get(nb) || 0) + 1);
        }
        let bestBiome = myBiome;
        let bestCount = counts.get(myBiome);
        for (const [b, c] of counts) {
          if (c > bestCount) {
            bestCount = c;
            bestBiome = b;
          }
        }
        baseAssignment[i] = bestBiome;
      }
    }
  }

  private promoteHighLatitudeTundraToSnow(ctx: MapGenContext): void {
    const { noise, idx, cells, baseAssignment, equatorY } = ctx;
    for (const cell of cells) {
      const i = idx(cell.x, cell.y);
      if (baseAssignment[i] !== TerrainBaseId.TUNDRA_FLAT) continue;
      const latNorm = Math.abs(cell.y - equatorY) / equatorY;
      const latFactor = Math.max(0, (latNorm - 0.55) / 0.45);
      const snowNoise = (noise(cell.x * 0.18 + 555, cell.y * 0.18 + 333) - 0.5) * 0.15;
      if (latFactor + snowNoise > 0.65) baseAssignment[i] = TerrainBaseId.SNOW_FLAT;
    }
  }

  private intrudeTundraWithFingers(ctx: MapGenContext): void {
    const { noise, idx, cells, baseAssignment, equatorY } = ctx;
    for (const cell of cells) {
      const i = idx(cell.x, cell.y);
      if (baseAssignment[i] !== TerrainBaseId.TUNDRA_FLAT) continue;
      const latNorm = Math.abs(cell.y - equatorY) / equatorY;
      const proxFactor = Math.max(0, (0.65 - latNorm) / 0.3);
      if (proxFactor === 0) continue;
      if (noise(cell.x * 0.15 + 777, cell.y * 0.15 + 555) * proxFactor > 0.4) {
        const choice = noise(cell.x * 0.15 + 222, cell.y * 0.15 + 999);
        baseAssignment[i] = choice > 0.5 ? TerrainBaseId.GRASSLAND_FLAT : TerrainBaseId.PLAINS_FLAT;
      }
    }
  }

  private speckleTundraNearEquator(ctx: MapGenContext): void {
    const { noise, idx, cells, baseAssignment, equatorY } = ctx;
    for (const cell of cells) {
      const i = idx(cell.x, cell.y);
      if (baseAssignment[i] !== TerrainBaseId.TUNDRA_FLAT) continue;
      const latNorm = Math.abs(cell.y - equatorY) / equatorY;
      const equatorBias = Math.max(0, (0.6 - latNorm) / 0.25);
      if (equatorBias === 0) continue;
      const speck = noise(cell.x * 0.35 + 888, cell.y * 0.35 + 444);
      if (speck * equatorBias > 0.55) {
        const choice = noise(cell.x * 0.45 + 111, cell.y * 0.45 + 333);
        baseAssignment[i] = choice > 0.5 ? TerrainBaseId.GRASSLAND_FLAT : TerrainBaseId.PLAINS_FLAT;
      }
    }
  }

  private convertGrasslandToPlains(ctx: MapGenContext): void {
    const { noise, idx, cells, baseAssignment } = ctx;
    for (const cell of cells) {
      const i = idx(cell.x, cell.y);
      if (baseAssignment[i] !== TerrainBaseId.GRASSLAND_FLAT) continue;
      if (noise(cell.x * 0.18 + 444, cell.y * 0.18 + 888) > 0.8) baseAssignment[i] = TerrainBaseId.PLAINS_FLAT;
    }
  }

  private mixPlainsAndGrassland(ctx: MapGenContext): void {
    const { noise, idx, cells, baseAssignment } = ctx;
    for (const cell of cells) {
      const i = idx(cell.x, cell.y);
      const base = baseAssignment[i];
      if (base !== TerrainBaseId.PLAINS_FLAT && base !== TerrainBaseId.GRASSLAND_FLAT) continue;
      if (noise(cell.x * 0.25 + 999, cell.y * 0.25 + 222) > 0.9) {
        baseAssignment[i] = base === TerrainBaseId.PLAINS_FLAT ? TerrainBaseId.GRASSLAND_FLAT : TerrainBaseId.PLAINS_FLAT;
      }
    }
  }

  private lockArchipelagoTemperatureFamily(ctx: MapGenContext): void {
    const { idx, cells, baseAssignment, plates, equatorY } = ctx;
    const archipelagoPlatesById = new Map<number, Plate>();
    for (const p of plates) if (p.isArchipelago) archipelagoPlatesById.set(p.id, p);
    if (archipelagoPlatesById.size === 0) return;

    const clusterCells = new Map<number, number[]>();
    for (const cell of cells) {
      const p = archipelagoPlatesById.get(cell.plateId);
      if (!p) continue;
      let list = clusterCells.get(p.parentPlateId);
      if (!list) {
        list = [];
        clusterCells.set(p.parentPlateId, list);
      }
      list.push(idx(cell.x, cell.y));
    }
    for (const cellIdxs of clusterCells.values()) {
      let hasDesert = false;
      let hasCold = false;
      let latSum = 0;
      for (const cIdx of cellIdxs) {
        const b = baseAssignment[cIdx];
        if (b === TerrainBaseId.DESERT_FLAT) hasDesert = true;
        if (b === TerrainBaseId.TUNDRA_FLAT || b === TerrainBaseId.SNOW_FLAT) hasCold = true;
        latSum += Math.abs(cells[cIdx].y - equatorY) / equatorY;
      }
      if (!hasDesert || !hasCold) continue;
      const keepCold = latSum / cellIdxs.length >= 0.5;
      for (const cIdx of cellIdxs) {
        const b = baseAssignment[cIdx];
        if (keepCold && b === TerrainBaseId.DESERT_FLAT) baseAssignment[cIdx] = TerrainBaseId.TUNDRA_FLAT;
        else if (!keepCold && (b === TerrainBaseId.TUNDRA_FLAT || b === TerrainBaseId.SNOW_FLAT)) baseAssignment[cIdx] = TerrainBaseId.DESERT_FLAT;
      }
    }
  }

  private removeIceNextToTundra(ctx: MapGenContext): void {
    const { idx, cells, neighbors, baseAssignment, featureAssignment } = ctx;
    for (const cell of cells) {
      const i = idx(cell.x, cell.y);
      if (featureAssignment[i] !== TerrainFeatureId.ICE) continue;
      for (const n of neighbors(cell.x, cell.y)) {
        if (baseAssignment[idx(n.x, n.y)] === TerrainBaseId.TUNDRA_FLAT) {
          featureAssignment[i] = TerrainFeatureId.NONE;
          break;
        }
      }
    }
  }

  // ============================================================================
  // Elevation
  // ============================================================================

  private promoteFlatToHills(ctx: MapGenContext): void {
    const { idx, cells, noise, baseAssignment, polarMargin, height, hillsMountainMult } = ctx;
    const ridgeThreshold = 0.17 * hillsMountainMult;
    const rollingThreshold = 1 - (1 - 0.89) * hillsMountainMult;
    for (const cell of cells) {
      const i = idx(cell.x, cell.y);
      if (!isFlatLand(baseAssignment[i])) continue;
      if (cell.y < polarMargin || cell.y >= height - polarMargin) continue;
      const rMain = ridge(noise, cell.x, cell.y, 0.07, 111, 222);
      const rCross = ridge(noise, cell.x, cell.y, 0.14, 444, 555);
      const ridgeScore = Math.min(rMain, rCross);
      const jitter = (noise(cell.x * 0.22 + 888, cell.y * 0.22 + 999) - 0.5) * 0.18;
      const rolling = noise(cell.x * 0.1 + 666, cell.y * 0.1 + 777);
      if (ridgeScore + jitter < ridgeThreshold || rolling > rollingThreshold) baseAssignment[i] = toHills(baseAssignment[i]);
    }
  }

  private promoteRidgeHillsToMountain(ctx: MapGenContext): void {
    const { idx, cells, noise, baseAssignment, hillsMountainMult } = ctx;
    const mainThreshold = 0.06 * hillsMountainMult;
    const wideThreshold = 0.18 * hillsMountainMult;
    const speckThreshold = 1 - (1 - 0.92) * hillsMountainMult;
    for (const cell of cells) {
      const i = idx(cell.x, cell.y);
      if (!isHillsLand(baseAssignment[i])) continue;
      const rMain = ridge(noise, cell.x, cell.y, 0.07, 111, 222);
      if (rMain < mainThreshold) {
        baseAssignment[i] = toMountain(baseAssignment[i]);
      } else if (rMain < wideThreshold) {
        const speck = noise(cell.x * 0.35 + 1111, cell.y * 0.35 + 2222);
        if (speck > speckThreshold) baseAssignment[i] = toMountain(baseAssignment[i]);
      }
    }
  }

  private removeIsolatedMountains(ctx: MapGenContext): void {
    const { idx, cells, neighbors, baseAssignment } = ctx;
    const snapshot = baseAssignment.slice();
    for (const cell of cells) {
      const i = idx(cell.x, cell.y);
      if (!isMountainLand(snapshot[i])) continue;
      let hasMountainNeighbor = false;
      for (const n of neighbors(cell.x, cell.y)) {
        if (isMountainLand(snapshot[idx(n.x, n.y)])) {
          hasMountainNeighbor = true;
          break;
        }
      }
      if (!hasMountainNeighbor) baseAssignment[i] = demoteToHills(snapshot[i]);
    }
  }

  private linkNearbyMountains(ctx: MapGenContext): void {
    const { width, height, idx, cells, baseAssignment, resourceAssignment, polarMargin } = ctx;
    const isPolarCap = (y: number): boolean => y < polarMargin || y >= height - polarMargin;
    const snapshot = baseAssignment.slice();

    for (let mIdx = 0; mIdx < cells.length; mIdx++) {
      if (!isMountainLand(snapshot[mIdx])) continue;
      const m = cells[mIdx];
      const [mcx, mcy, mcz] = offsetToCube(m.x, m.y);

      for (let dy = -3; dy <= 3; dy++) {
        const ny = m.y + dy;
        if (ny < 0 || ny >= height) continue;
        for (let dx = -3; dx <= 3; dx++) {
          if (dx === 0 && dy === 0) continue;
          const nx = (((m.x + dx) % width) + width) % width;
          const [ncx, ncy, ncz] = offsetToCube(nx, ny);
          const distHex = Math.max(Math.abs(mcx - ncx), Math.abs(mcy - ncy), Math.abs(mcz - ncz));
          if (distHex !== 3) continue;
          const ni = idx(nx, ny);
          if (!isMountainLand(snapshot[ni])) continue;
          for (let step = 1; step <= 2; step++) {
            const t = step / 3;
            const [rx, , rz] = cubeRound(mcx + (ncx - mcx) * t, mcy + (ncy - mcy) * t, mcz + (ncz - mcz) * t);
            const [col, row] = cubeToOffset(rx, rz);
            if (row < 0 || row >= height) continue;
            if (isPolarCap(row)) continue;
            const wrappedCol = ((col % width) + width) % width;
            const fillIdx = idx(wrappedCol, row);
            const cur = baseAssignment[fillIdx];
            if (isMountainLand(cur)) continue;
            if (isHillsLand(cur)) {
              baseAssignment[fillIdx] = toMountain(cur);
              resourceAssignment[fillIdx] = TerrainResourceId.IRON;
            } else if (isFlatLand(cur)) {
              baseAssignment[fillIdx] = toMountain(toHills(cur));
              resourceAssignment[fillIdx] = TerrainResourceId.IRON;
            }
          }
        }
      }
    }
  }

  private extendSmallMountainClusters(ctx: MapGenContext): void {
    const { height, rnd, idx, cells, neighbors, baseAssignment, resourceAssignment, polarMargin } = ctx;
    const isPolarCap = (y: number): boolean => y < polarMargin || y >= height - polarMargin;

    const snapshot = baseAssignment.slice();
    const visited = new Array<boolean>(cells.length).fill(false);

    for (let startIdx = 0; startIdx < cells.length; startIdx++) {
      if (!isMountainLand(snapshot[startIdx]) || visited[startIdx]) continue;

      const cluster: number[] = [];
      const stack = [startIdx];
      visited[startIdx] = true;
      while (stack.length > 0) {
        const cur = stack.pop();
        cluster.push(cur);
        const cc = cells[cur];
        for (const n of neighbors(cc.x, cc.y)) {
          const ni = idx(n.x, n.y);
          if (isMountainLand(snapshot[ni]) && !visited[ni]) {
            visited[ni] = true;
            stack.push(ni);
          }
        }
      }
      if (cluster.length >= 4) continue;

      const perimeter = cluster.filter(cIdx => {
        const c = cells[cIdx];
        for (const n of neighbors(c.x, c.y)) {
          if (isPolarCap(n.y)) continue;
          const nb = baseAssignment[idx(n.x, n.y)];
          if (isFlatLand(nb) || isHillsLand(nb)) return true;
        }
        return false;
      });
      if (perimeter.length === 0) continue;

      const sourceIdx = perimeter[Math.floor(rnd() * perimeter.length)];
      resourceAssignment[sourceIdx] = TerrainResourceId.MERCURY;

      const extendCount = 1 + Math.floor(rnd() * 5);
      let current = cells[sourceIdx];
      for (let step = 0; step < extendCount; step++) {
        const walkCandidates: Cell[] = [];
        for (const n of neighbors(current.x, current.y)) {
          if (isPolarCap(n.y)) continue;
          const ni = idx(n.x, n.y);
          if (isMountainLand(baseAssignment[ni])) continue;
          const cur = baseAssignment[ni];
          if (isFlatLand(cur) || isHillsLand(cur)) walkCandidates.push(cells[ni]);
        }
        if (walkCandidates.length === 0) break;
        const next = walkCandidates[Math.floor(rnd() * walkCandidates.length)];
        const ni = idx(next.x, next.y);
        const cur = baseAssignment[ni];
        if (isHillsLand(cur)) baseAssignment[ni] = toMountain(cur);
        else if (isFlatLand(cur)) baseAssignment[ni] = toMountain(toHills(cur));
        resourceAssignment[ni] = TerrainResourceId.URANIUM;
        current = next;
      }
    }
  }

  // ============================================================================
  // Final resources
  // ============================================================================

  private clearAllResources(ctx: MapGenContext): void {
    ctx.resourceAssignment.fill(TerrainResourceId.NONE);
  }

  private addTerrainFeatures(ctx: MapGenContext): void {
    const { height, rnd, noise, idx, neighbors, cells, plates, baseAssignment, featureAssignment, equatorY, polarRowCount, forestMult } = ctx;
    const featureSupports = (featureId: TerrainFeatureId, baseId: TerrainBaseId): boolean => {
      const meta = TERRAIN_FEATURE_SET[featureId];
      if (!meta) return false;
      for (const st of meta.suitableTerrain) if (st.baseId !== undefined && st.baseId === baseId) return true;
      return false;
    };
    const hasCoastNeighbor = (x: number, y: number): boolean => {
      for (const n of neighbors(x, y)) {
        if (baseAssignment[idx(n.x, n.y)] === TerrainBaseId.COAST) return true;
      }
      return false;
    };
    for (const cell of cells) {
      const i = idx(cell.x, cell.y);
      if (featureAssignment[i] !== TerrainFeatureId.NONE) continue;
      const base = baseAssignment[i];
      const latNorm = Math.abs(cell.y - equatorY) / equatorY;
      const distFromPole = Math.min(cell.y, height - 1 - cell.y);
      if ((base === TerrainBaseId.COAST || base === TerrainBaseId.OCEAN) && featureSupports(TerrainFeatureId.ICE, base) && distFromPole < polarRowCount) {
        if (distFromPole === 0 || rnd() < 1 - distFromPole / polarRowCount) featureAssignment[i] = TerrainFeatureId.ICE;
      } else if (base === TerrainBaseId.OCEAN && featureSupports(TerrainFeatureId.REEF, base) && latNorm < 0.3 && hasCoastNeighbor(cell.x, cell.y) && rnd() < 0.015) {
        featureAssignment[i] = TerrainFeatureId.REEF;
      } else if (
        featureSupports(TerrainFeatureId.RAINFOREST, base) &&
        cell.temperature >= 0.7 &&
        cell.moisture >= 0.55 &&
        noise(cell.x * 0.15 + 333, cell.y * 0.15 + 222) < 0.715 * forestMult
      ) {
        featureAssignment[i] = TerrainFeatureId.RAINFOREST;
      } else if (featureSupports(TerrainFeatureId.MARSH, base) && cell.moisture > 0.7 && rnd() < 0.1) {
        featureAssignment[i] = TerrainFeatureId.MARSH;
      } else if (featureSupports(TerrainFeatureId.OASIS, base) && rnd() < 0.03) {
        featureAssignment[i] = TerrainFeatureId.OASIS;
      } else if (featureSupports(TerrainFeatureId.WOODS, base) && noise(cell.x * 0.12 + 555, cell.y * 0.12 + 777) < (0.234 + cell.moisture * 0.39) * forestMult) {
        featureAssignment[i] = TerrainFeatureId.WOODS;
      }
    }

    const archipelagoClusters = new Map<number, number[]>();
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];
      if (!cell.isLand || cell.plateId < 0) continue;
      const plate = plates[cell.plateId];
      if (!plate || !plate.isArchipelago) continue;
      const key = plate.parentPlateId;
      let list = archipelagoClusters.get(key);
      if (!list) {
        list = [];
        archipelagoClusters.set(key, list);
      }
      list.push(i);
    }
    for (const landCells of archipelagoClusters.values()) {
      const candidateSet = new Set<number>();
      for (const landIdx of landCells) {
        const land = cells[landIdx];
        for (const n of neighbors(land.x, land.y)) {
          const coastIdx = idx(n.x, n.y);
          if (baseAssignment[coastIdx] !== TerrainBaseId.COAST) continue;
          for (const n2 of neighbors(n.x, n.y)) {
            const oceanIdx = idx(n2.x, n2.y);
            if (baseAssignment[oceanIdx] !== TerrainBaseId.OCEAN) continue;
            if (featureAssignment[oceanIdx] !== TerrainFeatureId.NONE) continue;
            if (!featureSupports(TerrainFeatureId.REEF, TerrainBaseId.OCEAN)) continue;
            candidateSet.add(oceanIdx);
          }
        }
      }
      const candidates = Array.from(candidateSet);
      if (candidates.length === 0) continue;
      for (let k = candidates.length - 1; k > 0; k--) {
        const j = Math.floor(rnd() * (k + 1));
        const tmp = candidates[k];
        candidates[k] = candidates[j];
        candidates[j] = tmp;
      }
      const r = rnd();
      const target = r < 0.15 ? 0 : r < 0.5 ? 1 : r < 0.85 ? 2 : 3;
      const place = Math.min(target, candidates.length);
      for (let k = 0; k < place; k++) {
        featureAssignment[candidates[k]] = TerrainFeatureId.REEF;
      }
    }
  }

  private sanityLandCleanup(ctx: MapGenContext): void {
    const { idx, cells, neighbors, baseAssignment, featureAssignment, resourceAssignment, equatorY, polarMargin, height } = ctx;

    const isSnow = (b: TerrainBaseId): boolean =>
      b === TerrainBaseId.SNOW_FLAT || b === TerrainBaseId.SNOW_HILLS || b === TerrainBaseId.SNOW_MOUNTAIN;
    const isTundra = (b: TerrainBaseId): boolean =>
      b === TerrainBaseId.TUNDRA_FLAT || b === TerrainBaseId.TUNDRA_HILLS || b === TerrainBaseId.TUNDRA_MOUNTAIN;
    const warmify = (b: TerrainBaseId): TerrainBaseId => {
      switch (b) {
        case TerrainBaseId.SNOW_FLAT:
        case TerrainBaseId.TUNDRA_FLAT:
          return TerrainBaseId.PLAINS_FLAT;
        case TerrainBaseId.SNOW_HILLS:
        case TerrainBaseId.TUNDRA_HILLS:
          return TerrainBaseId.PLAINS_HILLS;
        case TerrainBaseId.SNOW_MOUNTAIN:
        case TerrainBaseId.TUNDRA_MOUNTAIN:
          return TerrainBaseId.PLAINS_MOUNTAIN;
        default:
          return b;
      }
    };
    const isPolarMargin = (y: number): boolean => y < polarMargin || y >= height - polarMargin;

    for (const cell of cells) {
      const i = idx(cell.x, cell.y);
      if (featureAssignment[i] !== TerrainFeatureId.RAINFOREST) continue;
      const latNorm = Math.abs(cell.y - equatorY) / equatorY;
      const rainforestBelongs = latNorm < 0.5;
      for (const n of neighbors(cell.x, cell.y)) {
        const ni = idx(n.x, n.y);
        const nbBase = baseAssignment[ni];
        const nbFeature = featureAssignment[ni];
        const coldBase = isSnow(nbBase) || isTundra(nbBase);
        const hasIce = nbFeature === TerrainFeatureId.ICE;
        if (!coldBase && !hasIce) continue;
        if (rainforestBelongs) {
          if (coldBase) baseAssignment[ni] = warmify(nbBase);
          if (hasIce) featureAssignment[ni] = TerrainFeatureId.NONE;
        } else {
          featureAssignment[i] = TerrainFeatureId.NONE;
          break;
        }
      }
    }

    for (const cell of cells) {
      if (!isPolarMargin(cell.y)) continue;
      const i = idx(cell.x, cell.y);
      if (baseAssignment[i] !== TerrainBaseId.SNOW_FLAT) continue;
      let touchesContinentSnow = false;
      for (const n of neighbors(cell.x, cell.y)) {
        if (isPolarMargin(n.y)) continue;
        if (isSnow(baseAssignment[idx(n.x, n.y)])) {
          touchesContinentSnow = true;
          break;
        }
      }
      if (touchesContinentSnow) {
        baseAssignment[i] = TerrainBaseId.OCEAN;
        featureAssignment[i] = TerrainFeatureId.ICE;
        cells[i].isLand = false;
        cells[i].plateId = -1;
        resourceAssignment[i] = TerrainResourceId.NONE;
      }
    }
  }

  private addMainResources(ctx: MapGenContext): void {
    const { width, height, rnd, cells, baseAssignment, featureAssignment, resourceAssignment, polarMargin } = ctx;
    resourceAssignment.fill(TerrainResourceId.NONE);

    const players = this.getPlayersForMapSize(ctx.width, ctx.height);
    const distToLand = this.bfsDistance(ctx, i => cells[i].isLand, 99, 4);
    const tileFits = (cellIdx: number, suitable: { baseId?: TerrainBaseId; featureId?: TerrainFeatureId }[]): boolean => {
      const base = baseAssignment[cellIdx];
      const feat = featureAssignment[cellIdx];
      for (const st of suitable) {
        if ((st.baseId === undefined || st.baseId === base) && (st.featureId === undefined || st.featureId === feat)) return true;
      }
      return false;
    };

    const resourcesByType = new Map<TerrainResourceTypeId, typeof TERRAIN_RESOURCE_LIST>();
    for (const r of TERRAIN_RESOURCE_LIST) {
      let list = resourcesByType.get(r.type);
      if (!list) {
        list = [];
        resourcesByType.set(r.type, list);
      }
      list.push(r);
    }

    const totalLand = cells.filter(c => c.isLand).length;
    const countsByType: [TerrainResourceTypeId, number][] = [
      [TerrainResourceTypeId.BONUS, Math.floor(totalLand * 0.04)],
      [TerrainResourceTypeId.LUXURY, Math.floor(totalLand * 0.03)],
    ];
    const MIN_SAME = 4;
    const MIN_ANY = 2;

    const placedByType = new Map<TerrainResourceTypeId, number[]>();
    for (const [type] of countsByType) placedByType.set(type, []);
    const allPlaced: number[] = [];

    for (const [type, target] of countsByType) {
      const typeResources = resourcesByType.get(type) || [];
      if (typeResources.length === 0 || target === 0) continue;

      const candidates: number[] = [];
      for (let i = 0; i < cells.length; i++) {
        if (cells[i].y < polarMargin || cells[i].y >= height - polarMargin) continue;
        if (distToLand[i] > 3) continue;
        if (resourceAssignment[i] !== TerrainResourceId.NONE) continue;
        for (const r of typeResources) {
          if (tileFits(i, r.suitableTerrain)) {
            candidates.push(i);
            break;
          }
        }
      }
      for (let i = candidates.length - 1; i > 0; i--) {
        const j = Math.floor(rnd() * (i + 1));
        const tmp = candidates[i];
        candidates[i] = candidates[j];
        candidates[j] = tmp;
      }

      const samePlaced = placedByType.get(type);
      let placed = 0;
      for (const cIdx of candidates) {
        if (placed >= target) break;
        let tooClose = false;
        for (const p of samePlaced) {
          if (hexDistance(cells, width, cIdx, p) < MIN_SAME) {
            tooClose = true;
            break;
          }
        }
        if (tooClose) continue;
        for (const p of allPlaced) {
          if (hexDistance(cells, width, cIdx, p) < MIN_ANY) {
            tooClose = true;
            break;
          }
        }
        if (tooClose) continue;
        const fitting = typeResources.filter(r => tileFits(cIdx, r.suitableTerrain));
        if (fitting.length === 0) continue;
        resourceAssignment[cIdx] = fitting[Math.floor(rnd() * fitting.length)].id;
        samePlaced.push(cIdx);
        allPlaced.push(cIdx);
        placed += 1;
      }
    }

    const strategicTargets = new Map<TerrainResourceId, number>([
      [TerrainResourceId.URANIUM, players - 1],
      [TerrainResourceId.COAL, players - 1],
      [TerrainResourceId.ALUMINUM, players - 1],
      [TerrainResourceId.OIL, players - 1],
      [TerrainResourceId.NITER, players - 1],
      [TerrainResourceId.HORSES, players + 2],
      [TerrainResourceId.IRON, players + 2],
    ]);
    for (const resource of (resourcesByType.get(TerrainResourceTypeId.STRATEGIC) || [])) {
      const target = strategicTargets.get(resource.id) ?? 0;
      if (target === 0) continue;

      const candidates: number[] = [];
      for (let i = 0; i < cells.length; i++) {
        if (cells[i].y < polarMargin || cells[i].y >= height - polarMargin) continue;
        if (distToLand[i] > 3) continue;
        if (resourceAssignment[i] !== TerrainResourceId.NONE) continue;
        if (tileFits(i, resource.suitableTerrain)) candidates.push(i);
      }
      for (let i = candidates.length - 1; i > 0; i--) {
        const j = Math.floor(rnd() * (i + 1));
        const tmp = candidates[i];
        candidates[i] = candidates[j];
        candidates[j] = tmp;
      }

      const samePlaced: number[] = [];
      let placed = 0;
      for (const cIdx of candidates) {
        if (placed >= target) break;
        let tooClose = false;
        for (const p of samePlaced) {
          if (hexDistance(cells, width, cIdx, p) < MIN_SAME) { tooClose = true; break; }
        }
        if (tooClose) continue;
        for (const p of allPlaced) {
          if (hexDistance(cells, width, cIdx, p) < MIN_ANY) { tooClose = true; break; }
        }
        if (tooClose) continue;
        resourceAssignment[cIdx] = resource.id;
        samePlaced.push(cIdx);
        allPlaced.push(cIdx);
        placed += 1;
      }
    }
  }

  private addExtraFood(ctx: MapGenContext): void {
    const { rnd, idx, cells, neighbors, baseAssignment, featureAssignment, resourceAssignment } = ctx;
    const distToLand = this.bfsDistance(ctx, i => cells[i].isLand, 99, 4);
    const tileFits = (cellIdx: number, suitable: { baseId?: TerrainBaseId; featureId?: TerrainFeatureId }[]): boolean => {
      const base = baseAssignment[cellIdx];
      const feat = featureAssignment[cellIdx];
      for (const st of suitable) {
        if ((st.baseId === undefined || st.baseId === base) && (st.featureId === undefined || st.featureId === feat)) return true;
      }
      return false;
    };
    const fishResource = TERRAIN_RESOURCE_LIST.find(r => r.id === TerrainResourceId.FISH);
    const totalLand = cells.filter(c => c.isLand).length;
    const target = Math.floor(totalLand * 0.09);
    if (!fishResource || target === 0) return;

    const candidates: number[] = [];
    for (let i = 0; i < cells.length; i++) {
      if (distToLand[i] > 3) continue;
      if (resourceAssignment[i] !== TerrainResourceId.NONE) continue;
      if (tileFits(i, fishResource.suitableTerrain)) candidates.push(i);
    }
    for (let i = candidates.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      const tmp = candidates[i];
      candidates[i] = candidates[j];
      candidates[j] = tmp;
    }
    let placed = 0;
    for (const cIdx of candidates) {
      if (placed >= target) break;
      const c = cells[cIdx];
      let neighborFish = false;
      for (const n of neighbors(c.x, c.y)) {
        if (resourceAssignment[idx(n.x, n.y)] === TerrainResourceId.FISH) {
          neighborFish = true;
          break;
        }
      }
      if (neighborFish) continue;
      resourceAssignment[cIdx] = TerrainResourceId.FISH;
      placed += 1;
    }
  }

  // ============================================================================
  // Materialize
  // ============================================================================

  private materializeMap(ctx: MapGenContext): Map {
    const { width, height, rnd, idx, cells, plates, baseAssignment, featureAssignment, resourceAssignment, polarMargin } = ctx;

    const plateIdToLandmass = new Map<number, number>();
    let nextContinent = 1;
    let nextIsland = 100;
    let nextArchipelago = 200;
    const archCluster = new Map<number, number>();
    for (const p of plates) {
      if (p.isContinent) {
        plateIdToLandmass.set(p.id, nextContinent++);
      } else if (p.isArchipelago) {
        let clusterLandmass = archCluster.get(p.parentPlateId);
        if (clusterLandmass === undefined) {
          clusterLandmass = nextArchipelago++;
          archCluster.set(p.parentPlateId, clusterLandmass);
        }
        plateIdToLandmass.set(p.id, clusterLandmass);
      } else {
        plateIdToLandmass.set(p.id, nextIsland++);
      }
    }

    const map: Map = { tiles: [], width, height };
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const i = idx(x, y);
        const baseId = baseAssignment[i];
        const featureId = featureAssignment[i];
        const resourceId = resourceAssignment[i];
        const variantCount = TERRAIN_BASE_SET[baseId].ui.variantCount;

        let landmass = 0;
        if (baseId === TerrainBaseId.SNOW_FLAT && (y < polarMargin || y >= height - polarMargin)) {
          landmass = y < height / 2 ? 300 : 301;
        } else {
          const pid = cells[i].plateId;
          if (pid >= 0) {
            const mapped = plateIdToLandmass.get(pid);
            if (mapped !== undefined) landmass = mapped;
          }
        }

        const tile = {
          grid: { x, y },
          terrain: {
            base: { id: baseId, uiVariant: 1 + Math.floor(rnd() * variantCount) },
            feature: { id: featureId, uiVariant: featureId === TerrainFeatureId.NONE ? null : 1 },
            resourceId,
            improvementId: TerrainImprovementId.NONE,
          },
          landmass,
        } as unknown as Tile;
        this.tileYieldService.updateTileYield(tile);
        map.tiles.push(tile);
      }
    }
    return map;
  }

  // ============================================================================
  // Shared utilities
  // ============================================================================

  private getPlayersForMapSize(width: number, height: number): number {
    const area = width * height;
    let closest = MAP_SIZE_SETTINGS_LIST[0];
    let closestDiff = Math.abs(closest.width * closest.height - area);
    for (const size of MAP_SIZE_SETTINGS_LIST) {
      const diff = Math.abs(size.width * size.height - area);
      if (diff < closestDiff) {
        closestDiff = diff;
        closest = size;
      }
    }
    return closest.players;
  }

  private bfsDistance(ctx: MapGenContext, isSource: (i: number) => boolean, fillWith: number = 99, maxDist: number = Infinity): number[] {
    const { idx, cells, neighbors } = ctx;
    const dist: number[] = new Array(cells.length).fill(fillWith);
    const queue: number[] = [];
    for (let i = 0; i < cells.length; i++) {
      if (isSource(i)) {
        dist[i] = 0;
        queue.push(i);
      }
    }
    let head = 0;
    while (head < queue.length) {
      const cur = queue[head++];
      const next = dist[cur] + 1;
      if (next > maxDist) continue;
      const cc = cells[cur];
      for (const nb of neighbors(cc.x, cc.y)) {
        const ni = idx(nb.x, nb.y);
        if (dist[ni] > next) {
          dist[ni] = next;
          queue.push(ni);
        }
      }
    }
    return dist;
  }
}
