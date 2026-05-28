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
  playerCount: number;
}

interface PlateGrowthShape {
  angle: number;
  axisA: number;
  axisB: number;
  shear: number;
  chaosScale: number;
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
  equatorY: number;
  minContinentGap: number;
  playersMax: number;
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

    // Ice caps
    this.placeIcecapSnow(ctx);
    this.placeIcecapIceBelt(ctx);

    // Continents
    this.seedContinents(ctx);
    this.growContinentPlates(ctx);
    this.fillInlandOcean(ctx);

    // Islands
    this.seedIslands(ctx);
    this.growIslandPlates(ctx);

    // Cleanup noise before adding archipelagos
    this.clearNoiseRelatedIslands(ctx);

    // Archipelagos
    this.seedArchipelagos(ctx);
    this.growArchipelagoPlates(ctx);

    // Coast
    this.applyCoastBand(ctx);

    // Biome
    this.computeElevation(ctx);
    this.computeTemperature(ctx);
    this.computeMoisture(ctx);
    this.paintInitialBiomes(ctx);
    this.paintLatitudeBiomes(ctx);
    this.smoothBiomes(ctx);

    // Fine-tuning:
    this.convertGrasslandToPlains(ctx);
    this.mixPlainsAndGrassland(ctx);
    this.speckleTundraNearEquator(ctx);
    this.intrudeTundraWithFingers(ctx);
    this.promoteHighLatitudeTundraToSnow(ctx);

    // Elevation
    this.promoteFlatToHills(ctx);
    this.promoteRidgeHillsToMountain(ctx);
    this.removeIsolatedMountains(ctx);
    this.linkNearbyMountains(ctx);
    this.extendSmallMountainClusters(ctx);

    // Features and resources
    this.clearAllResources(ctx);
    this.addTerrainFeatures(ctx);
    this.sanityLandCleanup(ctx);
    this.addMainResources(ctx);
    this.addExtraFood(ctx);

    // Finalize
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
    const continentLand = Math.floor(width * height * landPct);

    const mapArea = width * height;
    const smallestMapArea = 44 * 26;
    const largestMapArea = 200 * 160;
    const mapSizeT = Math.max(0, Math.min(1, (mapArea - smallestMapArea) / (largestMapArea - smallestMapArea)));
    const minContinentGap = Math.round(3 + mapSizeT * 7);

    const cells: Cell[] = new Array(width * height);
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        cells[idx(x, y)] = { x, y, plateId: -1, isLand: false, elevation: 0, temperature: 0, moisture: 0 };
      }
    }

    const polarRowCount = Math.max(3, Math.min(5, 3 + Math.round(((height - 26) * 2) / (160 - 26))));
    const polarMargin = polarRowCount + 1;
    const playersMax = this.getPlayersMaxForMapSize(width, height);

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
      polarRowCount,
      polarMargin,
      continentLand,
      equatorY: (height - 1) / 2,
      minContinentGap,
      playersMax,
    };
  }

  // ============================================================================
  // Continents
  // ============================================================================

  private seedContinents(ctx: MapGenContext): void {
    const { width, height, rnd, continentCount, continentLand, plates, polarMargin, playersMax, equatorY } = ctx;
    const bandMin = polarMargin + Math.floor(height * 0.05);
    const bandMax = height - polarMargin - Math.floor(height * 0.05);
    const bandHeight = Math.max(1, bandMax - bandMin);

    const cols = Math.max(1, Math.round(Math.sqrt(continentCount * width / bandHeight)));
    const rows = Math.ceil(continentCount / cols);
    const cellW = width / cols;
    const cellH = bandHeight / rows;

    const safePlayersMax = Math.max(continentCount, playersMax);
    const landPerPlayer = continentLand / safePlayersMax;
    const playerCounts: number[] = new Array(continentCount).fill(1);
    for (let i = 0; i < safePlayersMax - continentCount; i++) {
      playerCounts[Math.floor(rnd() * continentCount)] += 1;
    }
    this.shuffleInPlace(playerCounts, rnd);

    const slots: [number, number][] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) slots.push([c, r]);
    }
    this.shuffleInPlace(slots, rnd);

    interface ContinentPlan {
      sx: number;
      primaryY: number;
      estimatedRadius: number;
      safeSeedMin: number;
      safeSeedMax: number;
      subPlateCount: number;
      subTarget: number;
      seedOffsetRange: number;
      playerCount: number;
    }

    const firstThirdCount = Math.ceil(continentCount / 3);
    const secondThirdCount = Math.ceil((continentCount - firstThirdCount) / 2);

    const plans: ContinentPlan[] = [];
    for (let i = 0; i < continentCount; i++) {
      const jitter = 0.95 + rnd() * 0.10;
      const totalTarget = Math.max(8, Math.floor(playerCounts[i] * landPerPlayer * jitter));
      const estimatedRadius = Math.ceil(Math.sqrt(totalTarget / 3));
      const safeSeedMin = Math.max(bandMin, polarMargin + estimatedRadius);
      const safeSeedMax = Math.min(bandMax - 1, height - polarMargin - estimatedRadius - 1);

      let sx: number;
      let primaryY: number;
      if (i < firstThirdCount) {
        const [c, r] = slots[i];
        sx = ((Math.floor(c * cellW + cellW * 0.1 + rnd() * cellW * 0.8) % width) + width) % width;
        primaryY = Math.min(safeSeedMax, Math.max(safeSeedMin, Math.floor(bandMin + r * cellH + cellH * 0.1 + rnd() * cellH * 0.8)));
      } else if (i < firstThirdCount + secondThirdCount) {
        sx = Math.floor(rnd() * width);
        primaryY = Math.min(safeSeedMax, Math.max(safeSeedMin, Math.floor(bandMin + rnd() * bandHeight)));
      } else {
        const anchor = plans[Math.floor(rnd() * plans.length)];
        const angle = rnd() * Math.PI * 2;
        const dist = (anchor.estimatedRadius + estimatedRadius) * 0.85;
        sx = ((Math.round(anchor.sx + dist * Math.cos(angle)) % width) + width) % width;
        primaryY = Math.min(safeSeedMax, Math.max(safeSeedMin, Math.round(anchor.primaryY + dist * Math.sin(angle))));
      }

      const subPlateRoll = rnd();
      const subPlateCount = subPlateRoll < 0.35 ? 3 : subPlateRoll < 0.56 ? 2 : subPlateRoll < 0.75 ? 4 : subPlateRoll < 0.87 ? 5 : subPlateRoll < 0.94 ? 6 : 7;
      const subTarget = Math.max(4, Math.floor(totalTarget / subPlateCount));
      const seedOffsetRange = Math.max(1, Math.floor(estimatedRadius * 0.2));
      plans.push({ sx, primaryY, estimatedRadius, safeSeedMin, safeSeedMax, subPlateCount, subTarget, seedOffsetRange, playerCount: playerCounts[i] });
    }

    const latTolerance = Math.round((height - 1) / 12);
    const avgPrimaryY = plans.reduce((sum, p) => sum + p.primaryY, 0) / plans.length;
    if (Math.abs(avgPrimaryY - equatorY) > latTolerance) {
      const shift = Math.round(equatorY - avgPrimaryY);
      for (const plan of plans) {
        plan.primaryY = Math.min(plan.safeSeedMax, Math.max(plan.safeSeedMin, plan.primaryY + shift));
      }
    }

    for (const plan of plans) {
      const { sx, primaryY, safeSeedMin, safeSeedMax, subPlateCount, subTarget, seedOffsetRange, playerCount } = plan;
      const primaryId = plates.length;
      let prevSeedX = sx;
      let prevSeedY = primaryY;
      for (let s = 0; s < subPlateCount; s++) {
        const seedX = s === 0 ? sx : ((prevSeedX + Math.round((rnd() * 2 - 1) * seedOffsetRange)) % width + width) % width;
        const seedY = s === 0 ? primaryY : Math.min(safeSeedMax, Math.max(safeSeedMin, prevSeedY + Math.round((rnd() * 2 - 1) * seedOffsetRange)));
        prevSeedX = seedX;
        prevSeedY = seedY;
        plates.push({
          id: plates.length,
          seedX,
          seedY,
          target: subTarget,
          grown: 0,
          isContinent: true,
          isArchipelago: false,
          parentPlateId: primaryId,
          playerCount: s === 0 ? playerCount : 0,
        });
      }
    }
  }

  private growContinentPlates(ctx: MapGenContext): void {
    const { rnd } = ctx;
    const continents = ctx.plates.filter(p => p.isContinent);
    const groups = this.buildContinentGroups(ctx);
    const ownPlateIdsFor = (plate: Plate): Set<number> => groups.get(plate.parentPlateId) ?? new Set([plate.id]);

    const mainShapeFor = (plate: Plate): PlateGrowthShape => {
      const angle = rnd() * Math.PI * 2;
      const axisB = 0.5 + rnd() * 1.5;
      const axisA = 0.64 / axisB;
      if (plate.parentPlateId === plate.id) return { angle, axisA, axisB, shear: (rnd() - 0.5) * 0.6, chaosScale: 0.6 + rnd() * 0.8 };
      return { angle, axisA, axisB, shear: (rnd() - 0.5) * 0.2, chaosScale: 0.2 + rnd() * 0.2 };
    };
    this.growPlates(ctx, continents, Math.floor(ctx.continentLand * 0.8), 3, ownPlateIdsFor, mainShapeFor, 0);

    const fringeShapeFor = (plate: Plate): PlateGrowthShape => {
      const axisB = 0.7 + rnd();
      const isPrimary = plate.parentPlateId === plate.id;
      return { angle: rnd() * Math.PI * 2, axisA: 0.64 / axisB, axisB, shear: (rnd() - 0.5) * (isPrimary ? 1.2 : 0.2), chaosScale: isPrimary ? 1.4 + rnd() * 0.6 : 0.2 + rnd() * 0.2 };
    };
    this.growPlates(ctx, continents, Math.floor(ctx.continentLand * 0.03), 9.0, ownPlateIdsFor, fringeShapeFor, 0);
  }

  private fillInlandOcean(ctx: MapGenContext): void {
    const { idx, cells, neighbors, baseAssignment } = ctx;
    const isOuterOcean = this.markOuterOcean(ctx);
    for (let i = 0; i < cells.length; i++) {
      if (baseAssignment[i] !== TerrainBaseId.OCEAN || isOuterOcean[i]) continue;
      baseAssignment[i] = TerrainBaseId.PLAINS_FLAT;
      cells[i].isLand = true;
      for (const n of neighbors(cells[i].x, cells[i].y)) {
        const nc = cells[idx(n.x, n.y)];
        if (nc.isLand && nc.plateId >= 0) {
          cells[i].plateId = nc.plateId;
          break;
        }
      }
    }
  }

  private buildContinentGroups(ctx: MapGenContext) {
    const groups = new Map<number, Set<number>>();
    for (const p of ctx.plates) {
      if (!p.isContinent) continue;
      let plateIds = groups.get(p.parentPlateId);
      if (!plateIds) { plateIds = new Set(); groups.set(p.parentPlateId, plateIds); }
      plateIds.add(p.id);
    }
    return groups;
  }

  // ============================================================================
  // Lakes
  // ============================================================================

  private detectInlandLakes(ctx: MapGenContext): void {
    const { idx, cells, neighbors, baseAssignment, featureAssignment } = ctx;
    const isOuterOcean = this.markOuterOcean(ctx);
    const visited = new Array<boolean>(cells.length).fill(false);

    for (let i = 0; i < cells.length; i++) {
      if (baseAssignment[i] !== TerrainBaseId.OCEAN || isOuterOcean[i] || visited[i]) continue;
      const comp: number[] = [];
      const stack = [i];
      visited[i] = true;
      while (stack.length > 0) {
        const cur = stack.pop();
        comp.push(cur);
        const cc = cells[cur];
        for (const n of neighbors(cc.x, cc.y)) {
          const ni = idx(n.x, n.y);
          if (baseAssignment[ni] === TerrainBaseId.OCEAN && !isOuterOcean[ni] && !visited[ni]) {
            visited[ni] = true;
            stack.push(ni);
          }
        }
      }
      if (comp.length > 6) continue;
      for (const cIdx of comp) {
        baseAssignment[cIdx] = TerrainBaseId.LAKE;
        if (featureAssignment[cIdx] === TerrainFeatureId.ICE) featureAssignment[cIdx] = TerrainFeatureId.NONE;
      }
    }
  }

  // ============================================================================
  // Ice caps
  // ============================================================================

  private placeIcecapSnow(ctx: MapGenContext): void {
    const { width, height, rnd, idx, neighbors, cells, baseAssignment, featureAssignment, polarRowCount } = ctx;

    const placeSnowOrIce = (i: number): void => {
      if (rnd() < 0.25) {
        this.claimCellAsOcean(i, ctx);
        featureAssignment[i] = TerrainFeatureId.ICE;
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

    const reachesEdge = new Array<boolean>(cells.length).fill(false);
    const stack: number[] = [];
    for (let x = 0; x < width; x++) {
      const iTop = idx(x, 0);
      if (baseAssignment[iTop] === TerrainBaseId.SNOW_FLAT && !reachesEdge[iTop]) {
        reachesEdge[iTop] = true;
        stack.push(iTop);
      }
      const iBot = idx(x, height - 1);
      if (baseAssignment[iBot] === TerrainBaseId.SNOW_FLAT && !reachesEdge[iBot]) {
        reachesEdge[iBot] = true;
        stack.push(iBot);
      }
    }
    while (stack.length > 0) {
      const cur = stack.pop()!;
      const c = cells[cur];
      for (const n of neighbors(c.x, c.y)) {
        const ni = idx(n.x, n.y);
        if (reachesEdge[ni]) continue;
        if (baseAssignment[ni] !== TerrainBaseId.SNOW_FLAT) continue;
        reachesEdge[ni] = true;
        stack.push(ni);
      }
    }
    for (let i = 0; i < cells.length; i++) {
      if (baseAssignment[i] !== TerrainBaseId.SNOW_FLAT) continue;
      if (reachesEdge[i]) continue;
      this.claimCellAsOcean(i, ctx);
      featureAssignment[i] = TerrainFeatureId.ICE;
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
    const { rnd, noise, idx, cells, neighbors, plates } = ctx;

    const groupIdByPlateId = new Map<number, number>();
    for (const p of plates) {
      if (p.isContinent || p.isArchipelago) groupIdByPlateId.set(p.id, p.parentPlateId);
    }

    const cellGroupId = new Array<number>(cells.length);
    for (let i = 0; i < cells.length; i++) {
      const pid = cells[i].plateId;
      cellGroupId[i] = groupIdByPlateId.get(pid) ?? pid;
    }

    for (const cell of cells) {
      if (!cell.isLand) {
        cell.elevation = 0;
        continue;
      }
      const cellIdx = idx(cell.x, cell.y);
      let e = 0.35 + rnd() * 0.2;
      e += ridge(noise, cell.x, cell.y, 0.14, 333, 777) * 0.35;
      e += (noise(cell.x * 0.08 + 51, cell.y * 0.08 + 19) - 0.5) * 0.3;
      let touchesOtherPlate = false;
      let touchesOcean = false;
      const myGroup = cellGroupId[cellIdx];
      for (const n of neighbors(cell.x, cell.y)) {
        const ni = idx(n.x, n.y);
        if (!cells[ni].isLand) touchesOcean = true;
        else if (cellGroupId[ni] !== myGroup) touchesOtherPlate = true;
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
    const { width, idx, cells, neighbors, baseAssignment, featureAssignment, height, polarRowCount, polarMargin } = ctx;
    const isIcecapContinent = (y: number, base: TerrainBaseId): boolean =>
      base === TerrainBaseId.SNOW_FLAT && (y < polarMargin || y >= height - polarMargin);
    const innermostTopY = polarRowCount - 1;
    const innermostBottomY = height - polarRowCount;
    for (let x = 0; x < width; x++) {
      for (const y of [innermostTopY, innermostBottomY]) {
        const i = idx(x, y);
        if (!cells[i].isLand) continue;
        this.claimCellAsOcean(i, ctx);
        featureAssignment[i] = TerrainFeatureId.NONE;
      }
    }
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
    const { height, rnd, idx, cells, neighbors, islandCount, polarMargin, plates, baseAssignment } = ctx;

    const actualCount = Math.max(0, islandCount);
    if (actualCount === 0) return;

    const continentGrownById = new Map<number, number>();
    for (const p of plates) if (p.isContinent) continentGrownById.set(p.id, p.grown);
    if (continentGrownById.size === 0) return;

    const distToLand: number[] = new Array(cells.length).fill(99);
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
      if (next > 30) continue;
      const cc = cells[cur];
      for (const nb of neighbors(cc.x, cc.y)) {
        const ni = idx(nb.x, nb.y);
        if (distToLand[ni] > next) {
          distToLand[ni] = next;
          dq.push(ni);
        }
      }
    }

    const nearestContinent: number[] = new Array(cells.length).fill(-1);
    const ncDist = new Array(cells.length).fill(99);
    const dq2: number[] = [];
    for (let i = 0; i < cells.length; i++) {
      if (cells[i].isLand && cells[i].plateId >= 0 && continentGrownById.has(cells[i].plateId)) {
        ncDist[i] = 0;
        nearestContinent[i] = cells[i].plateId;
        dq2.push(i);
      }
    }
    let head2 = 0;
    while (head2 < dq2.length) {
      const cur = dq2[head2++];
      const next = ncDist[cur] + 1;
      if (next > 30) continue;
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

    const nearCandidates: number[] = [];
    const farCandidates: number[] = [];
    for (let i = 0; i < cells.length; i++) {
      if (baseAssignment[i] !== TerrainBaseId.OCEAN) continue;
      const c = cells[i];
      if (c.y < polarMargin || c.y >= height - polarMargin) continue;
      if (nearestContinent[i] < 0) continue;
      const d = distToLand[i];
      if (d < 5) continue;
      if (d <= 8) nearCandidates.push(i);
      else farCandidates.push(i);
    }

    const used = new Array<boolean>(cells.length).fill(false);
    const markUsedRadius = (centerIdx: number, radius: number): void => {
      used[centerIdx] = true;
      const visited = new Set<number>([centerIdx]);
      let frontier: number[] = [centerIdx];
      for (let depth = 1; depth <= radius && frontier.length > 0; depth++) {
        const nextLayer: number[] = [];
        for (const cur of frontier) {
          const cc = cells[cur];
          for (const nb of neighbors(cc.x, cc.y)) {
            const ni = idx(nb.x, nb.y);
            if (visited.has(ni)) continue;
            visited.add(ni);
            used[ni] = true;
            nextLayer.push(ni);
          }
        }
        frontier = nextLayer;
      }
    };

    const nearCount = Math.round(actualCount * 0.4);

    for (let i = 0; i < actualCount; i++) {
      const isNearIsland = i < nearCount;
      const primaryPool = (isNearIsland ? nearCandidates : farCandidates).filter(c => !used[c]);
      const pool = primaryPool.length > 0 ? primaryPool : nearCandidates.filter(c => !used[c]);
      if (pool.length === 0) return;

      let seedIdx = pool[Math.floor(rnd() * pool.length)];

      const initialParentGrown = continentGrownById.get(nearestContinent[seedIdx]) ?? 0;
      const estimatedTarget = Math.max(1, Math.round(initialParentGrown * 0.15));
      const R = Math.ceil(Math.sqrt(estimatedTarget / Math.PI));
      const polarBuffer = Math.ceil(1.1 * R);
      const clearOfPoles = (c: number): boolean => cells[c].y >= polarBuffer && cells[c].y <= height - 1 - polarBuffer;

      if (!isNearIsland) {
        const minDist = 5 + Math.floor(rnd() * (2 * R + 1));
        const distAndPolarQualified = primaryPool.filter(c => distToLand[c] >= minDist && clearOfPoles(c));
        if (distAndPolarQualified.length > 0) {
          seedIdx = distAndPolarQualified[Math.floor(rnd() * distAndPolarQualified.length)];
        } else {
          const polarQualified = primaryPool.filter(clearOfPoles);
          if (polarQualified.length > 0) seedIdx = polarQualified[Math.floor(rnd() * polarQualified.length)];
        }
      } else {
        const polarQualified = pool.filter(clearOfPoles);
        if (polarQualified.length > 0) seedIdx = polarQualified[Math.floor(rnd() * polarQualified.length)];
      }

      if (baseAssignment[seedIdx] !== TerrainBaseId.OCEAN) continue;
      const parentPlateId = nearestContinent[seedIdx];
      const parentGrown = continentGrownById.get(parentPlateId) ?? 0;
      const pct = 0.03 + ((rnd() + rnd()) / 2) * 0.27;
      const target = Math.max(1, Math.round(parentGrown * pct * 1.1));
      plates.push({
        id: plates.length,
        seedX: cells[seedIdx].x,
        seedY: cells[seedIdx].y,
        target,
        grown: 0,
        isContinent: false,
        isArchipelago: false,
        parentPlateId,
        playerCount: 0,
      });
      markUsedRadius(seedIdx, 3);
    }
  }

  private growIslandPlates(ctx: MapGenContext): void {
    const { height, rnd, noise, idx, cells, neighbors, baseAssignment, featureAssignment, plates, polarMargin } = ctx;
    const islands = plates.filter(p => !p.isContinent && !p.isArchipelago);
    if (islands.length === 0) return;

    const isSea = (i: number): boolean =>
      cells[i].plateId === -1 &&
      !cells[i].isLand &&
      baseAssignment[i] === TerrainBaseId.OCEAN;

    const inPolarMargin = (y: number): boolean => y < polarMargin || y >= height - polarMargin;

    const claimAsIsland = (cellIdx: number, plate: Plate): void => {
      cells[cellIdx].plateId = plate.id;
      cells[cellIdx].isLand = true;
      baseAssignment[cellIdx] = TerrainBaseId.PLAINS_FLAT;
      featureAssignment[cellIdx] = TerrainFeatureId.NONE;
      plate.grown += 1;
    };

    interface FrontierItem { cellIdx: number; priority: number; }

    for (const plate of islands) {
      const ownPlateIds = new Set([plate.id]);
      const seedIdx = idx(plate.seedX, plate.seedY);
      if (!isSea(seedIdx)) continue;
      if (this.isAdjacentToForeignLand(ctx, plate.seedX, plate.seedY, ownPlateIds)) continue;

      claimAsIsland(seedIdx, plate);

      const chaos = (x: number, y: number): number => {
        const low = noise(x * 0.17 + plate.id * 17.7, y * 0.17 + plate.id * 31.3);
        const high = noise(x * 0.55 + plate.id * 7.3, y * 0.55 + plate.id * 13.1);
        return low + high * 0.6;
      };

      const frontier: FrontierItem[] = [];
      const enqueued = new Set<number>([seedIdx]);

      const enqueueNeighbors = (fromIdx: number): void => {
        const c = cells[fromIdx];
        for (const n of neighbors(c.x, c.y)) {
          const ni = idx(n.x, n.y);
          if (enqueued.has(ni)) continue;
          enqueued.add(ni);
          if (inPolarMargin(n.y)) continue;
          if (!isSea(ni)) continue;
          if (this.isAdjacentToForeignLand(ctx, n.x, n.y, ownPlateIds)) continue;
          const dx = n.x - plate.seedX;
          const dy = n.y - plate.seedY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const priority = dist + chaos(n.x, n.y) * 7.0 + (rnd() - 0.5) * 2.0;
          this.insertSortedByPriority(frontier, { cellIdx: ni, priority });
        }
      };

      enqueueNeighbors(seedIdx);

      while (frontier.length > 0 && plate.grown < plate.target) {
        const item = frontier.shift();
        if (!item) break;
        const ni = item.cellIdx;
        if (!isSea(ni)) continue;
        claimAsIsland(ni, plate);
        enqueueNeighbors(ni);
      }
    }

    this.detectInlandLakes(ctx);
    this.reshapeIslands(ctx);
  }

  private clearNoiseRelatedIslands(ctx: MapGenContext): void {
    const { idx, cells, neighbors, plates, baseAssignment, featureAssignment, resourceAssignment } = ctx;

    const continentPlateIds = new Set<number>(plates.filter(p => p.isContinent).map(p => p.id));
    const archipelagoPlateIds = new Set<number>(plates.filter(p => p.isArchipelago).map(p => p.id));

    const visited = new Array<boolean>(cells.length).fill(false);

    for (let i = 0; i < cells.length; i++) {
      if (!cells[i].isLand || visited[i]) continue;

      const component: number[] = [];
      let hasContinent = false;
      let hasArchipelago = false;
      const queue = [i];
      visited[i] = true;
      let head = 0;
      while (head < queue.length) {
        const cur = queue[head++];
        component.push(cur);
        if (continentPlateIds.has(cells[cur].plateId)) hasContinent = true;
        if (archipelagoPlateIds.has(cells[cur].plateId)) hasArchipelago = true;
        for (const n of neighbors(cells[cur].x, cells[cur].y)) {
          const ni = idx(n.x, n.y);
          if (!visited[ni] && cells[ni].isLand) { visited[ni] = true; queue.push(ni); }
        }
      }

      if (hasContinent || hasArchipelago || component.length >= 4) continue;

      for (const ci of component) {
        cells[ci].isLand = false;
        cells[ci].plateId = -1;
        baseAssignment[ci] = TerrainBaseId.OCEAN;
      }
    }
  }

  private reshapeIslands(ctx: MapGenContext): void {
    const { height, rnd, idx, cells, neighbors, plates, baseAssignment, featureAssignment, resourceAssignment, polarMargin } = ctx;

    const islandPlates = plates.filter(p => !p.isContinent && !p.isArchipelago && p.grown > 0);
    if (islandPlates.length === 0) return;

    const countLandNeighbors = (cellIdx: number): number => {
      let count = 0;
      for (const n of neighbors(cells[cellIdx].x, cells[cellIdx].y)) {
        if (cells[idx(n.x, n.y)].isLand) count++;
      }
      return count;
    };

    const fillWithIslandLand = (cellIdx: number, plateId: number): void => {
      cells[cellIdx].isLand = true;
      cells[cellIdx].plateId = plateId;
      baseAssignment[cellIdx] = TerrainBaseId.GRASSLAND_FLAT;
      featureAssignment[cellIdx] = TerrainFeatureId.NONE;
      resourceAssignment[cellIdx] = TerrainResourceId.NONE;
    };

    const removeIslandTile = (cellIdx: number): void => {
      cells[cellIdx].isLand = false;
      cells[cellIdx].plateId = -1;
      baseAssignment[cellIdx] = TerrainBaseId.OCEAN;
      featureAssignment[cellIdx] = TerrainFeatureId.NONE;
      resourceAssignment[cellIdx] = TerrainResourceId.NONE;
    };

    const wouldConnectOtherLand = (cellIdx: number, plateId: number): boolean => {
      for (const n of neighbors(cells[cellIdx].x, cells[cellIdx].y)) {
        const ni = idx(n.x, n.y);
        if (cells[ni].isLand && cells[ni].plateId !== plateId && cells[ni].plateId >= 0) return true;
      }
      return false;
    };

    const nearPolarThreshold = polarMargin * 2;

    const axisNext: Array<(x: number, y: number) => { x: number; y: number }> = [
      (x, y) => ({ x: x + 1, y }),
      (x, y) => y % 2 === 0 ? { x, y: y - 1 } : { x: x + 1, y: y - 1 },
      (x, y) => y % 2 === 0 ? { x: x - 1, y: y - 1 } : { x, y: y - 1 },
    ];
    const axisPrev: Array<(x: number, y: number) => { x: number; y: number }> = [
      (x, y) => ({ x: x - 1, y }),
      (x, y) => y % 2 === 0 ? { x: x - 1, y: y + 1 } : { x, y: y + 1 },
      (x, y) => y % 2 === 0 ? { x, y: y + 1 } : { x: x + 1, y: y + 1 },
    ];

    for (const plate of islandPlates) {
      const R = Math.ceil(Math.sqrt(plate.grown / Math.PI));
      const seedIdx = idx(plate.seedX, plate.seedY);

      const adjacentLakes = new Set<number>();
      for (let i = 0; i < cells.length; i++) {
        if (cells[i].plateId !== plate.id || !cells[i].isLand) continue;
        for (const n of neighbors(cells[i].x, cells[i].y)) {
          const ni = idx(n.x, n.y);
          if (baseAssignment[ni] === TerrainBaseId.LAKE) adjacentLakes.add(ni);
        }
      }
      for (const lakeIdx of adjacentLakes) {
        if (!wouldConnectOtherLand(lakeIdx, plate.id)) fillWithIslandLand(lakeIdx, plate.id);
      }

      const canalSeeds: number[] = [];
      for (let i = 0; i < cells.length; i++) {
        if (cells[i].isLand) continue;
        if (hexDistance(cells, ctx.width, i, seedIdx) >= R) continue;
        if (countLandNeighbors(i) === 5) canalSeeds.push(i);
      }

      const canalTiles = new Set<number>(canalSeeds);
      const bfsQueue = [...canalSeeds];
      let head = 0;
      while (head < bfsQueue.length) {
        const cur = bfsQueue[head++];
        for (const n of neighbors(cells[cur].x, cells[cur].y)) {
          const ni = idx(n.x, n.y);
          if (canalTiles.has(ni) || cells[ni].isLand) continue;
          const lnCount = countLandNeighbors(ni);
          if (lnCount === 3 || lnCount === 4) { canalTiles.add(ni); bfsQueue.push(ni); }
        }
      }

      for (const canalIdx of canalTiles) {
        if (!wouldConnectOtherLand(canalIdx, plate.id)) fillWithIslandLand(canalIdx, plate.id);
      }

      const narrowTileSet = new Set<number>();
      for (let i = 0; i < cells.length; i++) {
        if (cells[i].plateId !== plate.id || !cells[i].isLand) continue;
        const lnc = countLandNeighbors(i);
        if (lnc === 1 || lnc === 2) narrowTileSet.add(i);
      }

      const visitedNarrow = new Set<number>();
      const peninsulas: number[][] = [];
      for (const startIdx of narrowTileSet) {
        if (visitedNarrow.has(startIdx)) continue;
        const component: number[] = [];
        let hasEnd = false;
        const queue = [startIdx];
        visitedNarrow.add(startIdx);
        let bfsHead = 0;
        while (bfsHead < queue.length) {
          const cur = queue[bfsHead++];
          if (countLandNeighbors(cur) === 1) hasEnd = true;
          component.push(cur);
          for (const n of neighbors(cells[cur].x, cells[cur].y)) {
            const ni = idx(n.x, n.y);
            if (!narrowTileSet.has(ni) || visitedNarrow.has(ni)) continue;
            visitedNarrow.add(ni);
            queue.push(ni);
          }
        }
        if (hasEnd) peninsulas.push(component);
      }

      this.shuffleInPlace(peninsulas, rnd);
      const peninsulaReplaceCount = Math.floor(peninsulas.length * 0.8);
      for (let p = 0; p < peninsulaReplaceCount; p++) {
        for (const tileIdx of peninsulas[p]) removeIslandTile(tileIdx);
      }

      let isNearPolar = false;
      for (let i = 0; i < cells.length; i++) {
        if (cells[i].plateId !== plate.id || !cells[i].isLand) continue;
        if (cells[i].y < nearPolarThreshold || cells[i].y >= height - nearPolarThreshold) { isNearPolar = true; break; }
      }
      if (!isNearPolar) continue;

      const coastalTiles = new Set<number>();
      for (let i = 0; i < cells.length; i++) {
        if (cells[i].plateId !== plate.id || !cells[i].isLand) continue;
        for (const n of neighbors(cells[i].x, cells[i].y)) {
          if (!cells[idx(n.x, n.y)].isLand) { coastalTiles.add(i); break; }
        }
      }

      const expansionFrontier = new Set<number>();
      for (const lt of coastalTiles) {
        for (const n of neighbors(cells[lt].x, cells[lt].y)) {
          const ni = idx(n.x, n.y);
          if (!cells[ni].isLand && baseAssignment[ni] === TerrainBaseId.OCEAN && !wouldConnectOtherLand(ni, plate.id)) {
            expansionFrontier.add(ni);
          }
        }
      }

      const seedCell = cells[seedIdx];

      for (let axis = 0; axis < 3; axis++) {
        const nextFn = axisNext[axis];
        const prevFn = axisPrev[axis];
        const visitedChain = new Set<number>();

        for (const startCandidate of coastalTiles) {
          if (visitedChain.has(startCandidate)) continue;
          const sc = cells[startCandidate];
          const prevCoord = prevFn(sc.x, sc.y);
          if (prevCoord.y >= 0 && prevCoord.y < height && coastalTiles.has(idx(prevCoord.x, prevCoord.y))) {
            visitedChain.add(startCandidate);
            continue;
          }

          const chain: number[] = [startCandidate];
          visitedChain.add(startCandidate);
          let curCell = sc;
          while (true) {
            const nextCoord = nextFn(curCell.x, curCell.y);
            if (nextCoord.y < 0 || nextCoord.y >= height) break;
            const nextIdx = idx(nextCoord.x, nextCoord.y);
            if (!coastalTiles.has(nextIdx) || visitedChain.has(nextIdx)) break;
            chain.push(nextIdx);
            visitedChain.add(nextIdx);
            curCell = cells[nextIdx];
          }

          if (chain.length <= 4) continue;

          for (let j = 1; j < chain.length - 1; j++) {
            if (rnd() < 0.35) {
              const removedCell = cells[chain[j]];
              const rdx = removedCell.x - seedCell.x;
              const rdy = removedCell.y - seedCell.y;

              const otherSide = [...expansionFrontier].filter(ci => {
                if (cells[ci].isLand) return false;
                const cc = cells[ci];
                return (cc.x - seedCell.x) * rdx + (cc.y - seedCell.y) * rdy < 0;
              });
              if (otherSide.length === 0) continue;

              const targetIdx = otherSide[Math.floor(rnd() * otherSide.length)];
              fillWithIslandLand(targetIdx, plate.id);
              expansionFrontier.delete(targetIdx);
              for (const n of neighbors(cells[targetIdx].x, cells[targetIdx].y)) {
                const ni = idx(n.x, n.y);
                if (!cells[ni].isLand && baseAssignment[ni] === TerrainBaseId.OCEAN && !wouldConnectOtherLand(ni, plate.id)) {
                  expansionFrontier.add(ni);
                }
              }

              removeIslandTile(chain[j]);
              coastalTiles.delete(chain[j]);
            }
          }
        }
      }
    }
  }

  // ============================================================================
  // Archipelagos
  // ============================================================================

  private seedArchipelagos(ctx: MapGenContext): void {
    const { width, height, rnd, idx, cells, polarMargin, plates, baseAssignment, archipelagoCount } = ctx;
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
          playerCount: 0,
        });
      }
    }
  }

  private growArchipelagoPlates(ctx: MapGenContext): void {
    const archipelagos = ctx.plates.filter(p => p.isArchipelago);
    if (archipelagos.length === 0) return;
    const totalLand = archipelagos.reduce((s, p) => s + p.target, 0);
    const clusterPlateIds = new Map<number, Set<number>>();
    for (const p of archipelagos) {
      let set = clusterPlateIds.get(p.parentPlateId);
      if (!set) {
        set = new Set();
        clusterPlateIds.set(p.parentPlateId, set);
      }
      set.add(p.id);
    }
    const ownPlateIdsFor = (plate: Plate): Set<number> => clusterPlateIds.get(plate.parentPlateId) ?? new Set([plate.id]);
    this.growPlates(ctx, archipelagos, totalLand, 7.5, ownPlateIdsFor);
  }

  // ============================================================================
  // Shared plate growth
  // ============================================================================

  private growPlates(ctx: MapGenContext, newPlates: Plate[], landBudget: number, chaosFactor: number, ownPlateIdsFor: (plate: Plate) => Set<number>, shapeFor?: (plate: Plate) => PlateGrowthShape, foreignLandGap = 1): void {
    const { width, height, rnd, noise, idx, cells, neighbors, polarMargin, baseAssignment, featureAssignment } = ctx;

    const plateChaos = (x: number, y: number, plateId: number): number => {
      const low = noise(x * 0.17 + plateId * 17.7, y * 0.17 + plateId * 31.3);
      const high = noise(x * 0.55 + plateId * 7.3, y * 0.55 + plateId * 13.1);
      return low + high * 0.6;
    };

    const plateById = new Map<number, Plate>();
    const plateAngleById = new Map<number, number>();
    const plateAxisAById = new Map<number, number>();
    const plateAxisBById = new Map<number, number>();
    const plateShearById = new Map<number, number>();
    const plateChaosScaleById = new Map<number, number>();
    for (const p of newPlates) {
      plateById.set(p.id, p);
      if (shapeFor) {
        const shape = shapeFor(p);
        plateAngleById.set(p.id, shape.angle);
        plateAxisAById.set(p.id, shape.axisA);
        plateAxisBById.set(p.id, shape.axisB);
        plateShearById.set(p.id, shape.shear);
        plateChaosScaleById.set(p.id, shape.chaosScale);
      } else {
        plateAngleById.set(p.id, rnd() * Math.PI * 2);
        const axisB = 0.5 + rnd() * 1.5;
        plateAxisAById.set(p.id, 0.64 / axisB);
        plateAxisBById.set(p.id, axisB);
        plateShearById.set(p.id, (rnd() - 0.5) * 0.6);
        plateChaosScaleById.set(p.id, 0.6 + rnd() * 0.8);
      }
    }
    const stretchedDist = (plateId: number, dx: number, dy: number): number => {
      const ang = plateAngleById.get(plateId);
      const axisA = plateAxisAById.get(plateId);
      const axisB = plateAxisBById.get(plateId);
      const shear = plateShearById.get(plateId);
      const cos = Math.cos(ang);
      const sin = Math.sin(ang);
      const xp = dx * cos + dy * sin;
      const yp = -dx * sin + dy * cos;
      const xps = xp + shear * yp;
      return Math.sqrt(xps * xps * axisA + yp * yp * axisB);
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

    let grown = 0;
    for (const plate of newPlates) {
      const seedIdx = idx(plate.seedX, plate.seedY);
      if (cells[seedIdx].plateId !== -1 || baseAssignment[seedIdx] !== TerrainBaseId.OCEAN) continue;
      if (this.hasForeignLandWithinGap(ctx, plate.seedX, plate.seedY, ownPlateIdsFor(plate), foreignLandGap)) continue;
      cells[seedIdx].plateId = plate.id;
      cells[seedIdx].isLand = true;
      baseAssignment[seedIdx] = defaultBaseFor(plate);
      featureAssignment[seedIdx] = TerrainFeatureId.NONE;
      plate.grown += 1;
      grown += 1;
      for (const n of neighbors(plate.seedX, plate.seedY)) {
        const dx = wrapDx(n.x - plate.seedX);
        const dy = n.y - plate.seedY;
        this.insertSortedByPriority(frontier, {
          cellIdx: idx(n.x, n.y),
          plateId: plate.id,
          priority: stretchedDist(plate.id, dx, dy) + plateChaos(n.x, n.y, plate.id) * chaosFactor * plateChaosScaleById.get(plate.id),
        });
      }
    }

    while (frontier.length > 0 && grown < landBudget) {
      const item = frontier.shift();
      const cell = cells[item.cellIdx];
      if (cell.plateId !== -1 || baseAssignment[item.cellIdx] !== TerrainBaseId.OCEAN) continue;
      const plate = plateById.get(item.plateId);
      if (!plate || plate.grown >= plate.target) continue;
      if (cell.y < polarMargin || cell.y >= height - polarMargin) continue;
      if (this.hasForeignLandWithinGap(ctx, cell.x, cell.y, ownPlateIdsFor(plate), foreignLandGap)) continue;

      cell.plateId = plate.id;
      cell.isLand = true;
      baseAssignment[item.cellIdx] = defaultBaseFor(plate);
      featureAssignment[item.cellIdx] = TerrainFeatureId.NONE;
      plate.grown += 1;
      grown += 1;
      for (const n of neighbors(cell.x, cell.y)) {
        const ni = idx(n.x, n.y);
        if (cells[ni].plateId === -1) {
          const dx = wrapDx(n.x - plate.seedX);
          const dy = n.y - plate.seedY;
          const jitter = (rnd() - 0.5) * 2.0;
          this.insertSortedByPriority(frontier, {
            cellIdx: ni,
            plateId: plate.id,
            priority: stretchedDist(plate.id, dx, dy) + plateChaos(n.x, n.y, plate.id) * chaosFactor * plateChaosScaleById.get(plate.id) + jitter,
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
    const { idx, cells, plates } = ctx;
    const archipelagoPlatesById = new Map<number, Plate>();
    for (const p of plates) if (p.isArchipelago) archipelagoPlatesById.set(p.id, p);
    if (archipelagoPlatesById.size === 0) return;

    const clusterCells = new Map<number, number[]>();
    for (const cell of cells) {
      const p = archipelagoPlatesById.get(cell.plateId);
      if (!p) continue;
      let list = clusterCells.get(p.parentPlateId);
      if (!list) { list = []; clusterCells.set(p.parentPlateId, list); }
      list.push(idx(cell.x, cell.y));
    }
    this.lockTemperatureFamilyForGroups(clusterCells, ctx);
  }

  private lockIslandTemperatureFamily(ctx: MapGenContext): void {
    const { idx, cells, plates } = ctx;
    const islandPlateIds = new Set<number>();
    for (const p of plates) if (!p.isContinent && !p.isArchipelago) islandPlateIds.add(p.id);
    if (islandPlateIds.size === 0) return;

    const islandCells = new Map<number, number[]>();
    for (const cell of cells) {
      if (!islandPlateIds.has(cell.plateId)) continue;
      let list = islandCells.get(cell.plateId);
      if (!list) { list = []; islandCells.set(cell.plateId, list); }
      list.push(idx(cell.x, cell.y));
    }
    this.lockTemperatureFamilyForGroups(islandCells, ctx);
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
    const { width, height, idx, cells, baseAssignment, resourceAssignment } = ctx;
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
            if (this.inPolarRow(row, ctx)) continue;
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
    const { rnd, idx, cells, neighbors, baseAssignment, resourceAssignment } = ctx;
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
          if (this.inPolarRow(n.y, ctx)) continue;
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
          if (this.inPolarRow(n.y, ctx)) continue;
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
      this.shuffleInPlace(candidates, rnd);
      const r = rnd();
      const target = r < 0.15 ? 0 : r < 0.5 ? 1 : r < 0.85 ? 2 : 3;
      const place = Math.min(target, candidates.length);
      for (let k = 0; k < place; k++) {
        featureAssignment[candidates[k]] = TerrainFeatureId.REEF;
      }
    }
  }

  private sanityLandCleanup(ctx: MapGenContext): void {
    const { idx, cells, neighbors, baseAssignment, featureAssignment, equatorY } = ctx;

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
      if (!this.inPolarRow(cell.y, ctx)) continue;
      const i = idx(cell.x, cell.y);
      if (baseAssignment[i] !== TerrainBaseId.SNOW_FLAT) continue;
      let touchesContinentSnow = false;
      for (const n of neighbors(cell.x, cell.y)) {
        if (this.inPolarRow(n.y, ctx)) continue;
        if (isSnow(baseAssignment[idx(n.x, n.y)])) {
          touchesContinentSnow = true;
          break;
        }
      }
      if (touchesContinentSnow) {
        this.claimCellAsOcean(i, ctx);
        featureAssignment[i] = TerrainFeatureId.ICE;
      }
    }
  }

  private addMainResources(ctx: MapGenContext): void {
    const { height, rnd, cells, resourceAssignment, polarMargin } = ctx;
    resourceAssignment.fill(TerrainResourceId.NONE);

    const players = this.getPlayersForMapSize(ctx.width, ctx.height);
    const distToLand = this.bfsDistance(ctx, i => cells[i].isLand, 99, 4);

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
          if (this.cellFitsTerrain(i, r.suitableTerrain, ctx)) {
            candidates.push(i);
            break;
          }
        }
      }
      this.shuffleInPlace(candidates, rnd);

      const samePlaced = placedByType.get(type);
      this.placeResourceCandidates(
        candidates,
        target,
        cIdx => {
          const fitting = typeResources.filter(r => this.cellFitsTerrain(cIdx, r.suitableTerrain, ctx));
          return fitting.length > 0 ? fitting[Math.floor(rnd() * fitting.length)].id : null;
        },
        samePlaced,
        allPlaced,
        MIN_SAME,
        MIN_ANY,
        ctx
      );
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
        if (this.cellFitsTerrain(i, resource.suitableTerrain, ctx)) candidates.push(i);
      }
      this.shuffleInPlace(candidates, rnd);

      const samePlaced: number[] = [];
      this.placeResourceCandidates(candidates, target, () => resource.id, samePlaced, allPlaced, MIN_SAME, MIN_ANY, ctx);
    }
  }

  private addExtraFood(ctx: MapGenContext): void {
    const { rnd, idx, cells, neighbors, resourceAssignment } = ctx;
    const distToLand = this.bfsDistance(ctx, i => cells[i].isLand, 99, 4);
    const fishResource = TERRAIN_RESOURCE_LIST.find(r => r.id === TerrainResourceId.FISH);
    const totalLand = cells.filter(c => c.isLand).length;
    const target = Math.floor(totalLand * 0.09);
    if (!fishResource || target === 0) return;

    const candidates: number[] = [];
    for (let i = 0; i < cells.length; i++) {
      if (distToLand[i] > 3) continue;
      if (resourceAssignment[i] !== TerrainResourceId.NONE) continue;
      if (this.cellFitsTerrain(i, fishResource.suitableTerrain, ctx)) candidates.push(i);
    }
    this.shuffleInPlace(candidates, rnd);
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
    const continentGroupLandmass = new Map<number, number>();
    const archCluster = new Map<number, number>();
    for (const p of plates) {
      if (p.isContinent) {
        let landmass = continentGroupLandmass.get(p.parentPlateId);
        if (landmass === undefined) { landmass = nextContinent++; continentGroupLandmass.set(p.parentPlateId, landmass); }
        plateIdToLandmass.set(p.id, landmass);
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

  private getPlayersMaxForMapSize(width: number, height: number): number {
    const area = width * height;
    const sizes = MAP_SIZE_SETTINGS_LIST;
    if (area <= sizes[0].width * sizes[0].height) return sizes[0].playersMax;
    if (area >= sizes[sizes.length - 1].width * sizes[sizes.length - 1].height) return sizes[sizes.length - 1].playersMax;
    for (let i = 0; i < sizes.length - 1; i++) {
      const areaA = sizes[i].width * sizes[i].height;
      const areaB = sizes[i + 1].width * sizes[i + 1].height;
      if (area >= areaA && area <= areaB) {
        const t = (area - areaA) / (areaB - areaA);
        return Math.round(sizes[i].playersMax + t * (sizes[i + 1].playersMax - sizes[i].playersMax));
      }
    }
    return sizes[sizes.length - 1].playersMax;
  }

  private markOuterOcean(ctx: MapGenContext): boolean[] {
    const { idx, cells, neighbors, baseAssignment, width, height } = ctx;
    const isOuter = new Array<boolean>(cells.length).fill(false);
    const queue: number[] = [];
    for (let x = 0; x < width; x++) {
      for (const y of [0, height - 1]) {
        const i = idx(x, y);
        if (baseAssignment[i] === TerrainBaseId.OCEAN && !isOuter[i]) {
          isOuter[i] = true;
          queue.push(i);
        }
      }
    }
    let head = 0;
    while (head < queue.length) {
      const cur = queue[head++];
      for (const n of neighbors(cells[cur].x, cells[cur].y)) {
        const ni = idx(n.x, n.y);
        if (!isOuter[ni] && baseAssignment[ni] === TerrainBaseId.OCEAN) {
          isOuter[ni] = true;
          queue.push(ni);
        }
      }
    }
    return isOuter;
  }

  private isAdjacentToForeignLand(ctx: MapGenContext, x: number, y: number, ownPlateIds: Set<number>): boolean {
    for (const n of ctx.neighbors(x, y)) {
      const nc = ctx.cells[ctx.idx(n.x, n.y)];
      if (nc.isLand && nc.plateId >= 0 && !ownPlateIds.has(nc.plateId)) return true;
    }
    return false;
  }

  private hasForeignLandWithinGap(ctx: MapGenContext, x: number, y: number, ownPlateIds: Set<number>, gap: number): boolean {
    const { idx, cells, neighbors } = ctx;
    const startIdx = idx(x, y);
    const visited = new Set<number>([startIdx]);
    let frontier: number[] = [startIdx];
    for (let depth = 1; depth <= gap; depth++) {
      const next: number[] = [];
      for (const cur of frontier) {
        const cc = cells[cur];
        for (const n of neighbors(cc.x, cc.y)) {
          const ni = idx(n.x, n.y);
          if (visited.has(ni)) continue;
          visited.add(ni);
          const nc = cells[ni];
          if (nc.isLand && nc.plateId >= 0 && !ownPlateIds.has(nc.plateId)) return true;
          if (!nc.isLand) next.push(ni);
        }
      }
      frontier = next;
    }
    return false;
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

  private shuffleInPlace<T>(arr: T[], rnd: () => number): void {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  private insertSortedByPriority<T extends { priority: number }>(arr: T[], item: T): void {
    let lo = 0;
    let hi = arr.length;
    while (lo < hi) {
      const mid = (lo + hi) >>> 1;
      if (arr[mid].priority < item.priority) lo = mid + 1;
      else hi = mid;
    }
    arr.splice(lo, 0, item);
  }

  private inPolarRow(y: number, ctx: MapGenContext): boolean {
    return y < ctx.polarMargin || y >= ctx.height - ctx.polarMargin;
  }

  private claimCellAsOcean(cellIdx: number, ctx: MapGenContext): void {
    ctx.cells[cellIdx].isLand = false;
    ctx.cells[cellIdx].plateId = -1;
    ctx.baseAssignment[cellIdx] = TerrainBaseId.OCEAN;
    ctx.resourceAssignment[cellIdx] = TerrainResourceId.NONE;
  }

  private cellFitsTerrain(cellIdx: number, suitable: { baseId?: TerrainBaseId; featureId?: TerrainFeatureId }[], ctx: MapGenContext): boolean {
    const base = ctx.baseAssignment[cellIdx];
    const feat = ctx.featureAssignment[cellIdx];
    for (const st of suitable) {
      if ((st.baseId === undefined || st.baseId === base) && (st.featureId === undefined || st.featureId === feat)) return true;
    }
    return false;
  }

  private lockTemperatureFamilyForGroups(cellGroups: globalThis.Map<number, number[]>, ctx: MapGenContext): void {
    const { cells, baseAssignment, equatorY } = ctx;
    for (const cellIdxs of cellGroups.values()) {
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

  private placeResourceCandidates(
    candidates: number[],
    target: number,
    resourceFor: (cellIdx: number) => TerrainResourceId | null,
    samePlaced: number[],
    allPlaced: number[],
    minSame: number,
    minAny: number,
    ctx: MapGenContext
  ): void {
    let placed = 0;
    for (const cIdx of candidates) {
      if (placed >= target) break;
      let tooClose = false;
      for (const p of samePlaced) {
        if (hexDistance(ctx.cells, ctx.width, cIdx, p) < minSame) { tooClose = true; break; }
      }
      if (tooClose) continue;
      for (const p of allPlaced) {
        if (hexDistance(ctx.cells, ctx.width, cIdx, p) < minAny) { tooClose = true; break; }
      }
      if (tooClose) continue;
      const resource = resourceFor(cIdx);
      if (resource === null) continue;
      ctx.resourceAssignment[cIdx] = resource;
      samePlaced.push(cIdx);
      allPlaced.push(cIdx);
      placed += 1;
    }
  }
}
