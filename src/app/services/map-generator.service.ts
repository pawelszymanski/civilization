import { Injectable } from '@angular/core';

import { TerrainBaseId, TerrainFeatureId, TerrainImprovementId, TerrainResourceId, TerrainResourceTypeId } from '../models/terrain';
import { Coords } from '../models/utils';
import { Map, Tile } from '../models/map';
import { LandmassAmountId, MapGeneratorSettings, RainfallId, TemperatureId, WorldAgeId } from '../models/map-generator';

import { TERRAIN_BASE_SET, TERRAIN_FEATURE_SET, TERRAIN_RESOURCE_LIST } from '../consts/terrain.const';

import { TileYieldService } from './tile-yield.service';

interface Cell {
  x: number;
  y: number;
  plateId: number; // -1 = unassigned (becomes ocean)
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
  // Archipelago islands are "continent-less" tiny clusters: distinct from regular
  // islands (which belong to a continent) and rendered with desert as the default
  // base. Mutually exclusive with isContinent.
  isArchipelago: boolean;
  // Continent plate.id this landmass "belongs to" — drives the debug resource color
  // so an island visually inherits its parent continent's marker. For continents
  // and archipelago sub-islands this equals plate.id (self). For regular islands
  // this is the nearest continent.
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
  continentCount: number;
  islandCount: number;
  archipelagoCount: number;
  polarMargin: number;
  continentLand: number;
  islandLandTotal: number;
}

@Injectable({ providedIn: 'root' })
export class MapGeneratorService {
  constructor(private tileYieldService: TileYieldService) {}

  public generateNewGameMap(mapGeneratorSettings: MapGeneratorSettings): Map {
    const ctx = this.initContext(mapGeneratorSettings);

    this.generateContinents(ctx);
    this.generateLakes(ctx);
    this.generateIcecaps(ctx);
    this.generateCoasts(ctx);
    this.generateIslands(ctx);
    this.generateArchipelagos(ctx);
    this.landReset(ctx);
    this.setLandBase(ctx);
    this.addTerrainElevation(ctx);
    this.markContinents(ctx);
    this.clearResources(ctx);
    this.addTerrainFeatures(ctx);
    this.addResources(ctx);

    return this.materializeMap(ctx);
  }

  private initContext(settings: MapGeneratorSettings): MapGenContext {
    const width = settings.width;
    const height = settings.height;

    // mulberry32 PRNG — deterministic given the seed
    let prngState = settings.seed >>> 0;
    const rnd = (): number => {
      prngState = (prngState + 0x6d2b79f5) >>> 0;
      let t = prngState;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    // Cheap sin-hash value noise — stable for a given seed
    const noise = (x: number, y: number): number => {
      const v = Math.sin(x * 12.9898 + y * 78.233 + settings.seed * 0.0001) * 43758.5453;
      return v - Math.floor(v);
    };

    const idx = (x: number, y: number): number => {
      const wx = ((x % width) + width) % width;
      return wx * height + y;
    };
    // x is unused (we wrap x elsewhere); accepted for symmetry with idx/neighbors
    const inBounds = (_x: number, y: number): boolean => y >= 0 && y < height;

    // odd-row offset hex neighbors: odd rows shift RIGHT by half a tile (matches
    // tile-ui.service.ts indentation rule and tilesInRadius).
    const neighbors = (x: number, y: number): Coords[] => {
      const isOdd = y % 2 === 1;
      const offsets: Coords[] = isOdd
        ? [
            { x: -1, y: 0 }, // W
            { x: 1, y: 0 }, // E
            { x: 0, y: -1 }, // NW
            { x: 1, y: -1 }, // NE
            { x: 0, y: 1 }, // SW
            { x: 1, y: 1 }, // SE
          ]
        : [
            { x: -1, y: 0 }, // W
            { x: 1, y: 0 }, // E
            { x: -1, y: -1 }, // NW
            { x: 0, y: -1 }, // NE
            { x: -1, y: 1 }, // SW
            { x: 0, y: 1 }, // SE
          ];
      const out: Coords[] = [];
      for (const off of offsets) {
        const ny = y + off.y;
        if (!inBounds(0, ny)) {
          continue;
        }
        const nx = (((x + off.x) % width) + width) % width;
        out.push({ x: nx, y: ny });
      }
      return out;
    };

    const landPctByLandmass: { [k in LandmassAmountId]: number } = {
      [LandmassAmountId.LEAST]: 0.1,
      [LandmassAmountId.LESS]: 0.17,
      [LandmassAmountId.STANDARD]: 0.25,
      [LandmassAmountId.MORE]: 0.32,
      [LandmassAmountId.MOST]: 0.4,
    };
    const mountainMultByAge: { [k in WorldAgeId]: number } = {
      [WorldAgeId.NEW]: 1.4,
      [WorldAgeId.STANDARD]: 1.0,
      [WorldAgeId.OLD]: 0.5,
    };
    const tempOffsetById: { [k in TemperatureId]: number } = {
      [TemperatureId.HOT]: 0.1,
      [TemperatureId.STANDARD]: 0.0,
      [TemperatureId.COLD]: -0.1,
    };
    const rainfallOffsetById: { [k in RainfallId]: number } = {
      [RainfallId.DRY]: -0.15,
      [RainfallId.STANDARD]: 0.0,
      [RainfallId.WET]: 0.15,
    };

    const landPct = landPctByLandmass[settings.landmass];
    const totalLandTarget = Math.floor(width * height * landPct);
    const continentLand = Math.floor(totalLandTarget * 0.85);
    const islandLandTotal = totalLandTarget - continentLand;

    const cells: Cell[] = new Array(width * height);
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        cells[idx(x, y)] = {
          x,
          y,
          plateId: -1,
          isLand: false,
          elevation: 0,
          temperature: 0,
          moisture: 0,
        };
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
      mountainMult: mountainMultByAge[settings.worldAge],
      tempOffset: tempOffsetById[settings.temperature],
      rainfallOffset: rainfallOffsetById[settings.rainfall],
      continentCount: Math.max(1, settings.continents),
      islandCount: Math.max(0, settings.islands),
      archipelagoCount: Math.max(0, settings.archipelagos),
      polarMargin: Math.max(1, Math.floor(height * 0.08)),
      continentLand,
      islandLandTotal,
    };
  }

  private generateContinents(ctx: MapGenContext): void {
    const { width, height, rnd, continentCount, continentLand, plates } = ctx;

    const continentBandMin = Math.floor(height * 0.2);
    const continentBandMax = Math.floor(height * 0.8);
    const minContinentSpacing = Math.max(4, Math.floor(width / (continentCount + 1)));

    // Per-plate weights ∈ [0.3, 2.3] normalized to continentLand → variety in continent sizes
    const continentWeights: number[] = [];
    for (let i = 0; i < continentCount; i++) {
      continentWeights.push(0.3 + rnd() * 2.0);
    }
    const totalContWeight = continentWeights.reduce((s, w) => s + w, 0);

    const newPlates: Plate[] = [];
    for (let i = 0; i < continentCount; i++) {
      let sx = 0;
      let sy = 0;
      let placed = false;
      for (let attempt = 0; attempt < 30 && !placed; attempt++) {
        sx = Math.floor(rnd() * width);
        sy = continentBandMin + Math.floor(rnd() * Math.max(1, continentBandMax - continentBandMin));
        placed = true;
        for (const p of newPlates) {
          let dx = Math.abs(p.seedX - sx);
          if (dx > width / 2) {
            dx = width - dx;
          }
          const dy = Math.abs(p.seedY - sy);
          if (dx < minContinentSpacing && dy < minContinentSpacing) {
            placed = false;
            break;
          }
        }
      }
      const id = plates.length + i;
      newPlates.push({
        id,
        seedX: sx,
        seedY: sy,
        target: Math.max(8, Math.floor((continentLand * continentWeights[i]) / totalContWeight)),
        grown: 0,
        isContinent: true,
        isArchipelago: false,
        parentPlateId: id,
      });
    }

    plates.push(...newPlates);
    this.growPlates(ctx, newPlates, continentLand, 5.5);
    this.carveBays(ctx, newPlates);
  }

  // Priority flood-fill plate growth shared by continents and islands.
  // Each plate has a random stretch axis + per-plate fractal noise (2 octaves) → fingered,
  // jagged, non-oval shapes.
  // Writes baseAssignment[cell] = GRASSLAND_FLAT for every grown cell so the landmass is
  // visible even when later phases (coasts/icecaps/features/…) are commented out.
  // generateCoasts will replace these defaults with proper climate-driven biomes.
  // Also writes a debug food resource per plate id (cleared by addResources).
  private growPlates(ctx: MapGenContext, newPlates: Plate[], landBudget: number, chaosFactor: number): void {
    const { width, height, rnd, noise, idx, cells, neighbors, polarMargin, baseAssignment, resourceAssignment, featureAssignment, plates } = ctx;

    // Precompute continent plate IDs once so archipelago growth can reject any cell
    // adjacent to a continent in O(1) per neighbor check. Archipelagos must never
    // touch continents — they're "deep ocean" geography.
    const continentPlateIds = new Set<number>();
    for (const p of plates) {
      if (p.isContinent) {
        continentPlateIds.add(p.id);
      }
    }
    const adjacentToContinent = (x: number, y: number): boolean => {
      for (const n of neighbors(x, y)) {
        const npid = cells[idx(n.x, n.y)].plateId;
        if (npid >= 0 && continentPlateIds.has(npid)) {
          return true;
        }
      }
      return false;
    };

    // Debug-only: each plate gets a different food bonus resource so continents/islands
    // are visually distinguishable. addResources() wipes resourceAssignment before placing
    // real resources, so this never reaches the final map.
    const debugFoodByPlateIndex: TerrainResourceId[] = [
      TerrainResourceId.WHEAT,
      TerrainResourceId.RICE,
      TerrainResourceId.CATTLE,
      TerrainResourceId.SHEEP,
      TerrainResourceId.BANANAS,
      TerrainResourceId.FISH,
    ];
    // Resource keyed by the plate's PARENT continent id, so an island shares its
    // continent's marker. For continents, parentPlateId === id.
    const debugFoodFor = (p: Plate): TerrainResourceId => debugFoodByPlateIndex[p.parentPlateId % debugFoodByPlateIndex.length];

    // Two-octave fractal noise per plate: low frequency carves big lobes, high frequency
    // breaks up smooth edges so coasts look jagged rather than oval.
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
      if (dx > width / 2) {
        return dx - width;
      }
      if (dx < -width / 2) {
        return dx + width;
      }
      return dx;
    };

    interface Frontier {
      cellIdx: number;
      plateId: number;
      priority: number;
    }
    const frontier: Frontier[] = [];
    const insertFrontier = (item: Frontier): void => {
      let lo = 0;
      let hi = frontier.length;
      while (lo < hi) {
        const mid = (lo + hi) >>> 1;
        if (frontier[mid].priority < item.priority) {
          lo = mid + 1;
        } else {
          hi = mid;
        }
      }
      frontier.splice(lo, 0, item);
    };

    let grownThisPass = 0;
    for (const plate of newPlates) {
      const seedIdx = idx(plate.seedX, plate.seedY);
      // Refuse to seed onto anything that isn't pure OCEAN — continents, coasts,
      // lakes, snow caps are all off-limits.
      if (cells[seedIdx].plateId !== -1 || baseAssignment[seedIdx] !== TerrainBaseId.OCEAN) {
        continue;
      }
      cells[seedIdx].plateId = plate.id;
      cells[seedIdx].isLand = true;
      baseAssignment[seedIdx] = plate.isContinent
        ? TerrainBaseId.GRASSLAND_FLAT
        : plate.isArchipelago
          ? TerrainBaseId.DESERT_FLAT
          : TerrainBaseId.PLAINS_FLAT;
      // Archipelagos are continent-less AND resource-less.
      if (!plate.isArchipelago) {
        resourceAssignment[seedIdx] = debugFoodFor(plate);
      }
      featureAssignment[seedIdx] = TerrainFeatureId.NONE;
      plate.grown += 1;
      grownThisPass += 1;
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

    while (frontier.length > 0 && grownThisPass < landBudget) {
      const item = frontier.shift();
      const cell = cells[item.cellIdx];
      // Refuse to grow into any cell that isn't pure OCEAN
      if (cell.plateId !== -1 || baseAssignment[item.cellIdx] !== TerrainBaseId.OCEAN) {
        continue;
      }
      const plate = plateById.get(item.plateId);
      if (!plate || plate.grown >= plate.target) {
        continue;
      }
      if (cell.y < polarMargin || cell.y >= height - polarMargin) {
        if (rnd() > 0.15) {
          continue;
        }
      }
      // Archipelagos must never touch a continent — refuse cells adjacent to one.
      if (plate.isArchipelago && adjacentToContinent(cell.x, cell.y)) {
        continue;
      }
      cell.plateId = plate.id;
      cell.isLand = true;
      baseAssignment[item.cellIdx] = plate.isContinent
        ? TerrainBaseId.GRASSLAND_FLAT
        : plate.isArchipelago
          ? TerrainBaseId.DESERT_FLAT
          : TerrainBaseId.PLAINS_FLAT;
      if (!plate.isArchipelago) {
        resourceAssignment[item.cellIdx] = debugFoodFor(plate);
      }
      featureAssignment[item.cellIdx] = TerrainFeatureId.NONE;
      plate.grown += 1;
      grownThisPass += 1;
      for (const n of neighbors(cell.x, cell.y)) {
        const nIdx = idx(n.x, n.y);
        if (cells[nIdx].plateId === -1) {
          const dx = wrapDx(n.x - plate.seedX);
          const dy = n.y - plate.seedY;
          // High-frequency jitter (random per-tile) further roughens the coastline
          const jitter = (rnd() - 0.5) * 2.0;
          insertFrontier({
            cellIdx: nIdx,
            plateId: plate.id,
            priority: stretchedDist(plate.id, dx, dy) + plateChaos(n.x, n.y, plate.id) * chaosFactor + jitter,
          });
        }
      }
    }
  }

  // Random-walk erosion: from random interior points, walk downhill (toward ocean) and
  // convert each stepped-on cell to ocean. Carves bays/fjords/inlets and frequently
  // pinches off subcontinents — turns "egg" blobs into Africa/Europe-shaped landmasses
  // with peninsulas (the un-eroded ridges between walks). Pangaea-split feel without
  // simulating plate tectonics.
  private carveBays(ctx: MapGenContext, continentPlates: Plate[]): void {
    const { rnd, idx, cells, neighbors, baseAssignment, resourceAssignment } = ctx;

    // BFS distance-to-ocean — used as the "downhill" gradient the walks follow
    const distToOcean: number[] = new Array(cells.length).fill(99);
    const dq: number[] = [];
    for (let i = 0; i < cells.length; i++) {
      if (!cells[i].isLand) {
        distToOcean[i] = 0;
        dq.push(i);
      }
    }
    let head = 0;
    while (head < dq.length) {
      const cur = dq[head++];
      const cc = cells[cur];
      const next = distToOcean[cur] + 1;
      for (const nb of neighbors(cc.x, cc.y)) {
        const ni = idx(nb.x, nb.y);
        if (distToOcean[ni] > next) {
          distToOcean[ni] = next;
          dq.push(ni);
        }
      }
    }

    for (const plate of continentPlates) {
      // Walks start from interior cells (≥2 from coast) so they have somewhere to dig
      const interior: Cell[] = [];
      for (const c of cells) {
        if (c.plateId === plate.id && c.isLand && distToOcean[idx(c.x, c.y)] >= 2) {
          interior.push(c);
        }
      }
      if (interior.length < 4) {
        continue;
      }
      const numBays = 4 + Math.floor(rnd() * 5); // 4–8 bays per continent
      for (let i = 0; i < numBays; i++) {
        let current = interior[Math.floor(rnd() * interior.length)];
        const maxSteps = 5 + Math.floor(rnd() * 8); // 5–12 step walks
        for (let s = 0; s < maxSteps; s++) {
          if (!current.isLand) {
            break; // already eroded by a previous walk
          }
          const ci = idx(current.x, current.y);
          current.isLand = false;
          current.plateId = -1;
          baseAssignment[ci] = TerrainBaseId.OCEAN;
          resourceAssignment[ci] = TerrainResourceId.NONE;
          // Pick next land neighbor: 60% closest-to-ocean (carves toward sea),
          // 40% random (wiggle so bays meander instead of running straight)
          const landNbs: Cell[] = [];
          for (const n of neighbors(current.x, current.y)) {
            const nc = cells[idx(n.x, n.y)];
            if (nc.isLand) {
              landNbs.push(nc);
            }
          }
          if (landNbs.length === 0) {
            break; // surrounded by ocean now
          }
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

  private generateIslands(ctx: MapGenContext): void {
    const { width, height, rnd, idx, cells, neighbors, islandCount, islandLandTotal, polarMargin, plates, baseAssignment, continentCount, continentLand } = ctx;

    // Count varies ±2 from setting; sizes drawn from exponential distribution
    // (heavy tail toward 1–2 tile specks), normalized so total stays within ±10%.
    const actualIslandCount = Math.max(1, islandCount + Math.floor(rnd() * 5) - 2);
    const meanIslandSize = Math.max(1, islandLandTotal / actualIslandCount);
    const islandRawTargets: number[] = [];
    for (let i = 0; i < actualIslandCount; i++) {
      const raw = -Math.log(Math.max(0.0001, rnd())) * meanIslandSize * 0.6 + 1;
      islandRawTargets.push(Math.max(1, Math.round(raw)));
    }
    const islandRawSum = islandRawTargets.reduce((s, w) => s + w, 0);
    const islandFactor = islandRawSum > 0 ? islandLandTotal / islandRawSum : 1;
    const renormalize = islandFactor < 0.9 || islandFactor > 1.1;
    const normalizedTargets = renormalize ? islandRawTargets.map(t => Math.max(1, Math.round(t * islandFactor))) : islandRawTargets;
    // Hard cap: no island larger than 35% of average continent size. Prevents the
    // exponential distribution's long tail from producing islands that are basically
    // small continents.
    const avgContinentSize = continentLand / Math.max(1, continentCount);
    const maxIslandSize = Math.max(1, Math.floor(avgContinentSize * 0.35));
    const islandTargets = normalizedTargets.map(t => Math.min(t, maxIslandSize));

    // Two BFSes, since this runs AFTER generateCoasts and generateIcecaps:
    //  - distToNonOcean: any non-OCEAN cell is a source (continents, icecaps, coast,
    //    lake). Used to keep new island seeds 2–6 hexes from any existing geography.
    //  - nearestContinentByCell: only continent plate cells are sources. Used so the
    //    new island inherits its parent continent's debug-color marker.
    // Seed candidates: PURE OCEAN tiles only — never seeded onto land/coast/lake/snow.
    const baseAssignmentForCheck = baseAssignment; // alias for readability
    const continentsExist = cells.some(c => c.isLand && c.plateId >= 0);
    const distToLand: number[] = new Array(cells.length).fill(99);
    const nearestContinentByCell: number[] = new Array(cells.length).fill(-1);
    const seedCandidates: number[] = [];

    // BFS #1: distToLand (sources = every non-OCEAN cell)
    {
      const dq: number[] = [];
      for (let i = 0; i < cells.length; i++) {
        if (baseAssignmentForCheck[i] !== TerrainBaseId.OCEAN) {
          distToLand[i] = 0;
          dq.push(i);
        }
      }
      let head = 0;
      while (head < dq.length) {
        const cur = dq[head++];
        const cc = cells[cur];
        const next = distToLand[cur] + 1;
        if (next > 7) {
          continue;
        }
        for (const nb of neighbors(cc.x, cc.y)) {
          const ni = idx(nb.x, nb.y);
          if (distToLand[ni] > next) {
            distToLand[ni] = next;
            dq.push(ni);
          }
        }
      }
    }

    // BFS #2: nearestContinentByCell (sources = continent plate cells only)
    if (continentsExist) {
      const dq: number[] = [];
      const ncDist = new Array(cells.length).fill(99);
      for (let i = 0; i < cells.length; i++) {
        if (cells[i].isLand && cells[i].plateId >= 0) {
          ncDist[i] = 0;
          nearestContinentByCell[i] = cells[i].plateId;
          dq.push(i);
        }
      }
      let head = 0;
      while (head < dq.length) {
        const cur = dq[head++];
        const cc = cells[cur];
        const next = ncDist[cur] + 1;
        if (next > 12) {
          continue;
        }
        for (const nb of neighbors(cc.x, cc.y)) {
          const ni = idx(nb.x, nb.y);
          if (ncDist[ni] > next) {
            ncDist[ni] = next;
            nearestContinentByCell[ni] = nearestContinentByCell[cur];
            dq.push(ni);
          }
        }
      }
    }

    for (let i = 0; i < cells.length; i++) {
      const c = cells[i];
      // Only pure ocean cells can host an island seed
      if (baseAssignmentForCheck[i] !== TerrainBaseId.OCEAN) {
        continue;
      }
      if (c.y < polarMargin || c.y >= height - polarMargin) {
        continue;
      }
      if (distToLand[i] >= 2 && distToLand[i] <= 6) {
        seedCandidates.push(i);
      }
    }

    const newPlates: Plate[] = [];
    for (let i = 0; i < actualIslandCount; i++) {
      let sx: number;
      let sy: number;
      let parentPlateId: number;
      if (seedCandidates.length > 0) {
        const seedIdx = seedCandidates[Math.floor(rnd() * seedCandidates.length)];
        const pick = cells[seedIdx];
        sx = pick.x;
        sy = pick.y;
        parentPlateId = nearestContinentByCell[seedIdx];
      } else {
        sx = Math.floor(rnd() * width);
        sy = polarMargin + Math.floor(rnd() * (height - polarMargin * 2));
        parentPlateId = plates.length + i; // standalone fallback: be its own parent
      }
      const id = plates.length + i;
      newPlates.push({
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

    plates.push(...newPlates);
    this.growPlates(ctx, newPlates, islandLandTotal, 7.0);
  }

  // Tight clusters of 2–5 tiny (1–15 tile) islands far out in the deep ocean.
  // Roughly 0.5–1 cluster per continent (75% chance each). Centers picked from
  // ocean tiles ≥3 hexes from any land, weighted toward 10+ hexes out.
  // 3–8 hexes from the parent continent, then scatters its sub-islands within ~4
  // hexes of that center. All cluster islands inherit the parent continent's id
  // for the debug resource marker.
  private generateArchipelagos(ctx: MapGenContext): void {
    const { width, height, rnd, idx, cells, neighbors, polarMargin, plates, baseAssignment, archipelagoCount } = ctx;

    if (archipelagoCount <= 0) {
      return;
    }

    // BFS distance-to-land with a generous bound — archipelagos should live in the
    // deep ocean, so we need real distance values well past 10 hexes.
    const MAX_BFS = 30;
    const distToLand: number[] = new Array(cells.length).fill(99);
    const dq: number[] = [];
    for (let i = 0; i < cells.length; i++) {
      // Distance is measured from anything that isn't pure OCEAN — continents, islands,
      // icecaps, coast tiles, lakes. So archipelagos stay clear of all existing geography.
      if (baseAssignment[i] !== TerrainBaseId.OCEAN) {
        distToLand[i] = 0;
        dq.push(i);
      }
    }
    let head = 0;
    while (head < dq.length) {
      const cur = dq[head++];
      const cc = cells[cur];
      const next = distToLand[cur] + 1;
      if (next > MAX_BFS) {
        continue;
      }
      for (const nb of neighbors(cc.x, cc.y)) {
        const ni = idx(nb.x, nb.y);
        if (distToLand[ni] > next) {
          distToLand[ni] = next;
          dq.push(ni);
        }
      }
    }

    // Global candidate pool: pure-OCEAN tiles ≥3 hexes from any non-ocean cell, non-polar.
    // Weight = min(distToLand, 20)² so picks are strongly biased toward deep-ocean tiles
    // (10+ hexes out); 3–9 still possible as a fallback. Archipelagos are continent-less
    // so we don't filter by nearestContinent — each cluster floats independently.
    const candidates: number[] = [];
    const weights: number[] = [];
    for (let i = 0; i < cells.length; i++) {
      const c = cells[i];
      // PURE OCEAN only — never on land, coast, lake, or snow cap.
      if (baseAssignment[i] !== TerrainBaseId.OCEAN) {
        continue;
      }
      if (c.y < polarMargin || c.y >= height - polarMargin) {
        continue;
      }
      if (distToLand[i] < 3) {
        continue;
      }
      candidates.push(i);
      const capped = Math.min(distToLand[i], 20);
      weights.push(capped * capped);
    }
    if (candidates.length === 0) {
      return;
    }
    const totalWeight = weights.reduce((s, w) => s + w, 0);

    const pickWeightedCenter = (): number => {
      let r = rnd() * totalWeight;
      for (let k = 0; k < weights.length; k++) {
        r -= weights[k];
        if (r <= 0) {
          return candidates[k];
        }
      }
      return candidates[candidates.length - 1];
    };

    const newPlates: Plate[] = [];
    // Number of archipelago CLUSTERS is taken straight from settings.archipelagos
    // (clamped ≥ 0 in initContext). Each iteration produces one cluster of 2–5
    // sub-islands centered on a deep-ocean candidate.
    for (let ai = 0; ai < archipelagoCount; ai++) {
      const centerIdx = pickWeightedCenter();
      const center = cells[centerIdx];

      // Spawn 2–5 sub-islands within ~4 hex radius of the center. Sizes lean small
      // (most 1–3 tiles, occasional 4–10), with at most ONE sub-island larger than
      // 10 tiles per archipelago.
      const subCount = 2 + Math.floor(rnd() * 4);
      // Pre-roll target sizes so we can enforce the "max one > 10" cap before placing
      const subTargets: number[] = [];
      let largeUsed = 0;
      for (let i = 0; i < subCount; i++) {
        // Exponential bias toward small: most rolls land in 1–3, very long tail
        let t = Math.max(1, Math.round(-Math.log(Math.max(0.0001, rnd())) * 1.5));
        if (t > 10) {
          if (largeUsed >= 1) {
            t = 1 + Math.floor(rnd() * 10); // clamp to 1–10 if we already used our large slot
          } else {
            largeUsed += 1;
            t = Math.min(15, t); // hard cap even the one allowed large island at 15
          }
        }
        subTargets.push(t);
      }

      // All sub-islands of THIS cluster share the same parentPlateId (the first
      // sub-island's id). Lets setLandBase identify "the whole archipelago" as a
      // single unit for cluster-level biome rules (e.g. no desert + tundra mix).
      let clusterId = -1;
      for (let i = 0; i < subCount; i++) {
        // Pick an offset within a small square neighborhood, must land on pure OCEAN
        let sx = center.x;
        let sy = center.y;
        for (let attempt = 0; attempt < 8; attempt++) {
          const dx = Math.floor(rnd() * 9) - 4;
          const dy = Math.floor(rnd() * 9) - 4;
          const ty = center.y + dy;
          if (ty < polarMargin || ty >= height - polarMargin) {
            continue;
          }
          const tx = (((center.x + dx) % width) + width) % width;
          const tIdx = idx(tx, ty);
          if (baseAssignment[tIdx] === TerrainBaseId.OCEAN) {
            sx = tx;
            sy = ty;
            break;
          }
        }
        const id = plates.length + newPlates.length;
        if (i === 0) {
          clusterId = id;
        }
        newPlates.push({
          id,
          seedX: sx,
          seedY: sy,
          target: subTargets[i],
          grown: 0,
          isContinent: false,
          isArchipelago: true,
          // "Continent-less": doesn't inherit a continent's debug color. Sub-islands
          // of the same cluster share parentPlateId for cluster-level grouping.
          parentPlateId: clusterId,
        });
      }
    }

    if (newPlates.length > 0) {
      plates.push(...newPlates);
      const totalArchipelagoLand = newPlates.reduce((s, p) => s + p.target, 0);
      this.growPlates(ctx, newPlates, totalArchipelagoLand, 7.5);
    }

    // After islands and archipelagos have been added, re-run lake + coast detection
    // so the new geography also gets its coast ring (and any ocean enclosed by a
    // tight archipelago cluster turns into a lake).
    this.applyCoastBand(ctx);
  }

  // Resets every continent / island / archipelago land tile to GRASSLAND_FLAT and
  // strips ALL features and resources from the map. The two exceptions are
  // preserved: SNOW_FLAT polar caps stay, and the ICE feature stays on the polar
  // ocean belt. Useful as a "clean slate" view to inspect just the landmass shape
  // without biome / feature / resource noise.
  private landReset(ctx: MapGenContext): void {
    const { cells, idx, baseAssignment, featureAssignment, resourceAssignment } = ctx;
    for (const cell of cells) {
      const i = idx(cell.x, cell.y);
      const base = baseAssignment[i];
      const isWater =
        base === TerrainBaseId.OCEAN || base === TerrainBaseId.COAST || base === TerrainBaseId.LAKE;
      const isSnowCap = base === TerrainBaseId.SNOW_FLAT;
      // Any land that isn't a snow cap → GRASSLAND_FLAT
      if (!isWater && !isSnowCap) {
        baseAssignment[i] = TerrainBaseId.GRASSLAND_FLAT;
      }
      // Strip every feature except ICE (kept for the polar ocean belt)
      if (featureAssignment[i] !== TerrainFeatureId.ICE) {
        featureAssignment[i] = TerrainFeatureId.NONE;
      }
      // Strip every resource — including the debug food markers on continents /
      // islands and the FISH placed on lakes.
      resourceAssignment[i] = TerrainResourceId.NONE;
    }
  }

  // Paints flat biomes on land cells based on a per-latitude PROBABILITY
  // distribution. Earth-from-equator-outward:
  //   0–10%  → mostly DESERT (equatorial belt)
  //   10–25% → mostly PLAINS, desert fading out
  //   25–40% → GRASSLAND phasing in
  //   35–100% → TUNDRA ramping up, becomes dominant past ~55%
  //
  // Each biome gets a weight at this cell's effective latitude (a Gaussian-ish
  // bell curve for DESERT/PLAINS/GRASSLAND, a linear ramp for TUNDRA). The
  // cell rolls weighted-random across the four weights — so in transition
  // zones you get a probabilistic mix rather than a hard band edge. A small
  // noise term (period ~12 tiles, amplitude ±0.075) jitters the latitude so
  // band boundaries bend organically.
  //
  // Then 3 iterations of cellular-automata majority vote dissolve the
  // resulting speckle into cohesive regions: at each latitude the dominant
  // biome wins out, with minority biomes surviving only where they cluster
  // (≥4 same-biome neighbors). Single-tile biome islands are essentially
  // eliminated.
  //
  // Skips OCEAN, COAST, LAKE, and SNOW_FLAT — owned by other phases.
  private setLandBase(ctx: MapGenContext): void {
    const { height, idx, cells, noise, neighbors, baseAssignment, featureAssignment, plates } = ctx;
    const equatorY = (height - 1) / 2;

    const isPaintable = (i: number): boolean => {
      const b = baseAssignment[i];
      return (
        b !== TerrainBaseId.OCEAN &&
        b !== TerrainBaseId.COAST &&
        b !== TerrainBaseId.LAKE &&
        b !== TerrainBaseId.SNOW_FLAT
      );
    };

    const bell = (x: number, center: number, sigma: number): number =>
      Math.exp(-((x - center) ** 2) / (2 * sigma * sigma));

    // Per-latitude biome probability. Picks one weighted-random.
    // Tuning: DESERT widened (+50%) by raising σ to 0.12. TUNDRA weight scaled
    // by 0.8 (−20%) — the missing 20% will be reallocated to SNOW in a later
    // pass on the highest-latitude tundra cells.
    //
    // Uses a noise sample (position-based, seed-anchored) as the weighted-random
    // input — NOT rnd() — so each cell's biome decision is independent of the
    // PRNG state. Prevents continent biomes from drifting when prior phases
    // (e.g. generateArchipelagos) consume different numbers of rnd() calls.
    const pickBiomeByLatitude = (lat: number, x: number, y: number): TerrainBaseId => {
      const wDesert = bell(lat, 0.0, 0.12); // wider band (+50% desert)
      const wPlains = bell(lat, 0.13, 0.10);
      const wGrassland = bell(lat, 0.28, 0.12);
      const wTundra = lat < 0.35 ? 0 : ((lat - 0.35) / 0.65) * 0.64; // −20% (round 1) × another −20% = ×0.64
      const total = wDesert + wPlains + wGrassland + wTundra;
      let r = noise(x * 0.47 + 3333, y * 0.47 + 5555) * total;
      r -= wDesert;
      if (r < 0) {
        return TerrainBaseId.DESERT_FLAT;
      }
      r -= wPlains;
      if (r < 0) {
        return TerrainBaseId.PLAINS_FLAT;
      }
      r -= wGrassland;
      if (r < 0) {
        return TerrainBaseId.GRASSLAND_FLAT;
      }
      return TerrainBaseId.TUNDRA_FLAT;
    };

    // -------- Paint pass: weighted-noise biome per cell, noise-jittered latitude --------
    for (const cell of cells) {
      const i = idx(cell.x, cell.y);
      if (!isPaintable(i)) {
        continue;
      }
      const latNorm = Math.abs(cell.y - equatorY) / equatorY;
      const jitter = (noise(cell.x * 0.08 + 71, cell.y * 0.08 + 137) - 0.5) * 0.15;
      const effLat = Math.max(0, Math.min(1, latNorm + jitter));
      baseAssignment[i] = pickBiomeByLatitude(effLat, cell.x, cell.y);
    }

    // -------- Smooth pass: 3 iterations of CA majority vote --------
    for (let iter = 0; iter < 3; iter++) {
      const snapshot = baseAssignment.slice();
      for (const cell of cells) {
        const i = idx(cell.x, cell.y);
        if (!isPaintable(i)) {
          continue;
        }
        const counts = new Map<TerrainBaseId, number>();
        const myBiome = snapshot[i];
        counts.set(myBiome, 1);
        for (const n of neighbors(cell.x, cell.y)) {
          const nIdx = idx(n.x, n.y);
          if (!isPaintable(nIdx)) {
            continue;
          }
          const nb = snapshot[nIdx];
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

    // -------- Tundra → SNOW pass --------
    // Reallocates the 20% trimmed from the tundra weight curve into snow, placed
    // on the highest-latitude tundra tiles with a touch of noise. Target ~20%
    // of tundra converted.
    for (const cell of cells) {
      const i = idx(cell.x, cell.y);
      if (baseAssignment[i] !== TerrainBaseId.TUNDRA_FLAT) {
        continue;
      }
      const latNorm = Math.abs(cell.y - equatorY) / equatorY;
      // latFactor goes 0 at lat 0.55, 1 at lat 1.0. Past 0.78 it starts winning
      // against the threshold below; below 0.78 only an unusually high noise nudge
      // converts the tile.
      const latFactor = Math.max(0, (latNorm - 0.55) / 0.45);
      const snowNoise = (noise(cell.x * 0.18 + 555, cell.y * 0.18 + 333) - 0.5) * 0.15;
      // Threshold raised from 0.45 → 0.65 to halve the snow conversion rate.
      if (latFactor + snowNoise > 0.65) {
        baseAssignment[i] = TerrainBaseId.SNOW_FLAT;
      }
    }

    // -------- Plains/Grassland intrusion into TUNDRA --------
    // Near the tundra/temperate boundary (lat ~0.35) some tundra tiles flip
    // back to plains or grassland, producing a fuzzy boundary instead of a
    // hard latitude line. The chance falls off rapidly with latitude:
    //   lat 0.35 → proxFactor 1.0 (strong intrusion)
    //   lat 0.50 → proxFactor 0.5
    //   lat 0.65 → proxFactor 0 (no intrusion past here, polar tundra stays clean)
    for (const cell of cells) {
      const i = idx(cell.x, cell.y);
      if (baseAssignment[i] !== TerrainBaseId.TUNDRA_FLAT) {
        continue;
      }
      const latNorm = Math.abs(cell.y - equatorY) / equatorY;
      const proxFactor = Math.max(0, (0.65 - latNorm) / 0.3);
      if (proxFactor === 0) {
        continue;
      }
      const intrusionNoise = noise(cell.x * 0.15 + 777, cell.y * 0.15 + 555);
      if (intrusionNoise * proxFactor > 0.4) {
        // Pick plains or grassland via a separate noise (spatially coherent clusters)
        const choiceNoise = noise(cell.x * 0.15 + 222, cell.y * 0.15 + 999);
        baseAssignment[i] = choiceNoise > 0.5 ? TerrainBaseId.GRASSLAND_FLAT : TerrainBaseId.PLAINS_FLAT;
      }
    }

    // -------- Sparse equator-biased grassland/plains specks in TUNDRA --------
    // Complements the intrusion pass above: that pass uses low-frequency noise to
    // produce cohesive fingers; this one uses high-frequency noise (period ~3 tiles)
    // for individual scattered specks within tundra. Heavy equator bias — by lat
    // 0.60 the effect is gone entirely. Adds organic micro-variation to the warm
    // half of the tundra band without touching deep polar tundra.
    for (const cell of cells) {
      const i = idx(cell.x, cell.y);
      if (baseAssignment[i] !== TerrainBaseId.TUNDRA_FLAT) {
        continue;
      }
      const latNorm = Math.abs(cell.y - equatorY) / equatorY;
      const equatorBias = Math.max(0, (0.6 - latNorm) / 0.25); // 1.0 at lat 0.35, 0 at lat 0.60
      if (equatorBias === 0) {
        continue;
      }
      const speckNoise = noise(cell.x * 0.35 + 888, cell.y * 0.35 + 444);
      if (speckNoise * equatorBias > 0.55) {
        const choiceNoise = noise(cell.x * 0.45 + 111, cell.y * 0.45 + 333);
        baseAssignment[i] = choiceNoise > 0.5 ? TerrainBaseId.GRASSLAND_FLAT : TerrainBaseId.PLAINS_FLAT;
      }
    }

    // -------- GRASSLAND → PLAINS pass --------
    // ~20% of grassland tiles flip to plains (noise > 0.80). Shifts the
    // mid-latitude balance toward plains without affecting other biomes. Uses
    // a moderate-frequency noise (period ~5 tiles) so converted areas form
    // small patches rather than scattered single tiles.
    for (const cell of cells) {
      const i = idx(cell.x, cell.y);
      if (baseAssignment[i] !== TerrainBaseId.GRASSLAND_FLAT) {
        continue;
      }
      const convNoise = noise(cell.x * 0.18 + 444, cell.y * 0.18 + 888);
      if (convNoise > 0.8) {
        baseAssignment[i] = TerrainBaseId.PLAINS_FLAT;
      }
    }

    // -------- PLAINS ↔ GRASSLAND mix pass --------
    // Light high-frequency noise (period ~4 tiles) sprinkles ~10% of the
    // plains/grassland tiles with the opposite biome — tiny mixed-biome
    // pockets so those two big bands don't read as solid blocks.
    for (const cell of cells) {
      const i = idx(cell.x, cell.y);
      const base = baseAssignment[i];
      if (base !== TerrainBaseId.PLAINS_FLAT && base !== TerrainBaseId.GRASSLAND_FLAT) {
        continue;
      }
      const mixNoise = noise(cell.x * 0.25 + 999, cell.y * 0.25 + 222);
      if (mixNoise > 0.9) {
        baseAssignment[i] =
          base === TerrainBaseId.PLAINS_FLAT ? TerrainBaseId.GRASSLAND_FLAT : TerrainBaseId.PLAINS_FLAT;
      }
    }

    // -------- Archipelago cluster mutual exclusion --------
    // Archipelagos can host ANY biome — the only rule is that within one cluster,
    // DESERT and SNOW/TUNDRA can't coexist (a cluster reads as either warm or cold,
    // not both). Sub-islands of one cluster share `parentPlateId` so we can group
    // them. For each cluster: if both desert AND cold tiles are present, the
    // cluster's average latitude decides which side wins; the conflicting tiles
    // flip to the winning side's representative biome.
    const archipelagoPlatesById = new Map<number, Plate>();
    for (const p of plates) {
      if (p.isArchipelago) {
        archipelagoPlatesById.set(p.id, p);
      }
    }
    if (archipelagoPlatesById.size > 0) {
      const clusterCells = new Map<number, number[]>();
      for (const cell of cells) {
        const p = archipelagoPlatesById.get(cell.plateId);
        if (!p) {
          continue;
        }
        const clusterId = p.parentPlateId;
        let list = clusterCells.get(clusterId);
        if (!list) {
          list = [];
          clusterCells.set(clusterId, list);
        }
        list.push(idx(cell.x, cell.y));
      }
      for (const cellIdxs of clusterCells.values()) {
        let hasDesert = false;
        let hasCold = false;
        let latSum = 0;
        for (const cellIdx of cellIdxs) {
          const base = baseAssignment[cellIdx];
          if (base === TerrainBaseId.DESERT_FLAT) {
            hasDesert = true;
          }
          if (base === TerrainBaseId.TUNDRA_FLAT || base === TerrainBaseId.SNOW_FLAT) {
            hasCold = true;
          }
          latSum += Math.abs(cells[cellIdx].y - equatorY) / equatorY;
        }
        if (!hasDesert || !hasCold) {
          continue; // no conflict
        }
        // Cluster's average latitude decides: cold for high-lat clusters,
        // desert for low-lat clusters.
        const keepCold = latSum / cellIdxs.length >= 0.5;
        for (const cellIdx of cellIdxs) {
          const base = baseAssignment[cellIdx];
          if (keepCold && base === TerrainBaseId.DESERT_FLAT) {
            baseAssignment[cellIdx] = TerrainBaseId.TUNDRA_FLAT;
          } else if (!keepCold && (base === TerrainBaseId.TUNDRA_FLAT || base === TerrainBaseId.SNOW_FLAT)) {
            baseAssignment[cellIdx] = TerrainBaseId.DESERT_FLAT;
          }
        }
      }
    }

    // -------- Icecap cleanup: strip ICE adjacent to TUNDRA --------
    // The polar ICE belt was placed by generateIcecaps long before any tundra
    // existed (tundra is created here in setLandBase). Now that we know where
    // tundra ended up, remove ICE from any ocean/coast cell that's adjacent to
    // a tundra tile — the visual of frozen ocean directly next to land tundra
    // looks redundant; land already conveys "cold" there.
    for (const cell of cells) {
      const i = idx(cell.x, cell.y);
      if (featureAssignment[i] !== TerrainFeatureId.ICE) {
        continue;
      }
      for (const n of neighbors(cell.x, cell.y)) {
        if (baseAssignment[idx(n.x, n.y)] === TerrainBaseId.TUNDRA_FLAT) {
          featureAssignment[i] = TerrainFeatureId.NONE;
          break;
        }
      }
    }
  }

  // Promotes some flat land into hills and mountains using ridge noise.
  //
  // Earth-like layering:
  //  PASS 1 (FLAT → HILLS): two ridge-noise octaves (long main spine + denser
  //    secondary spine) + jitter for loose edges, plus a low-frequency rolling
  //    blob noise for scattered hill patches that aren't on a ridge. Hills form
  //    range-like shapes similar to mountain ranges but wider and frayed.
  //  PASS 2 (HILLS → MOUNTAIN): only along the narrow main ridge core
  //    (longest, cleanest ridges), plus sparse individual mountain specks in
  //    the foothill band via a high-frequency noise. Mountains live INSIDE the
  //    hill regions, so mountain ranges are always wrapped in foothills.
  //
  // Same biome family preserved across the FLAT/HILLS/MOUNTAIN transition
  // (e.g. GRASSLAND_FLAT → GRASSLAND_HILLS → GRASSLAND_MOUNTAIN). Skips water,
  // coast, and lake tiles. Uses noise only (no rnd()) so PRNG state is not
  // affected.
  private addTerrainElevation(ctx: MapGenContext): void {
    const { width, height, idx, cells, neighbors, noise, rnd, baseAssignment, resourceAssignment, polarMargin } = ctx;

    // Polar caps (icecap region) are off-limits for hills/mountains — they stay
    // flat snow. polarMargin is small (~3 rows on a height-40 map) and matches the
    // icecap zone painted by generateIcecaps.
    const isInPolarCap = (y: number): boolean => y < polarMargin || y >= height - polarMargin;

    const toHills = (b: TerrainBaseId): TerrainBaseId => {
      switch (b) {
        case TerrainBaseId.GRASSLAND_FLAT:
          return TerrainBaseId.GRASSLAND_HILLS;
        case TerrainBaseId.PLAINS_FLAT:
          return TerrainBaseId.PLAINS_HILLS;
        case TerrainBaseId.DESERT_FLAT:
          return TerrainBaseId.DESERT_HILLS;
        case TerrainBaseId.TUNDRA_FLAT:
          return TerrainBaseId.TUNDRA_HILLS;
        case TerrainBaseId.SNOW_FLAT:
          return TerrainBaseId.SNOW_HILLS;
        default:
          return b;
      }
    };
    const toMountain = (b: TerrainBaseId): TerrainBaseId => {
      switch (b) {
        case TerrainBaseId.GRASSLAND_HILLS:
          return TerrainBaseId.GRASSLAND_MOUNTAIN;
        case TerrainBaseId.PLAINS_HILLS:
          return TerrainBaseId.PLAINS_MOUNTAIN;
        case TerrainBaseId.DESERT_HILLS:
          return TerrainBaseId.DESERT_MOUNTAIN;
        case TerrainBaseId.TUNDRA_HILLS:
          return TerrainBaseId.TUNDRA_MOUNTAIN;
        case TerrainBaseId.SNOW_HILLS:
          return TerrainBaseId.SNOW_MOUNTAIN;
        default:
          return b;
      }
    };
    const isFlatLand = (b: TerrainBaseId): boolean =>
      b === TerrainBaseId.GRASSLAND_FLAT ||
      b === TerrainBaseId.PLAINS_FLAT ||
      b === TerrainBaseId.DESERT_FLAT ||
      b === TerrainBaseId.TUNDRA_FLAT ||
      b === TerrainBaseId.SNOW_FLAT;
    const isHillsLand = (b: TerrainBaseId): boolean =>
      b === TerrainBaseId.GRASSLAND_HILLS ||
      b === TerrainBaseId.PLAINS_HILLS ||
      b === TerrainBaseId.DESERT_HILLS ||
      b === TerrainBaseId.TUNDRA_HILLS ||
      b === TerrainBaseId.SNOW_HILLS;
    const isMountainLand = (b: TerrainBaseId): boolean =>
      b === TerrainBaseId.GRASSLAND_MOUNTAIN ||
      b === TerrainBaseId.PLAINS_MOUNTAIN ||
      b === TerrainBaseId.DESERT_MOUNTAIN ||
      b === TerrainBaseId.TUNDRA_MOUNTAIN ||
      b === TerrainBaseId.SNOW_MOUNTAIN;
    const demoteToHills = (b: TerrainBaseId): TerrainBaseId => {
      switch (b) {
        case TerrainBaseId.GRASSLAND_MOUNTAIN:
          return TerrainBaseId.GRASSLAND_HILLS;
        case TerrainBaseId.PLAINS_MOUNTAIN:
          return TerrainBaseId.PLAINS_HILLS;
        case TerrainBaseId.DESERT_MOUNTAIN:
          return TerrainBaseId.DESERT_HILLS;
        case TerrainBaseId.TUNDRA_MOUNTAIN:
          return TerrainBaseId.TUNDRA_HILLS;
        case TerrainBaseId.SNOW_MOUNTAIN:
          return TerrainBaseId.SNOW_HILLS;
        default:
          return b;
      }
    };

    // Ridge noise: |noise - 0.5| * 2 ∈ [0, 1]. Zero at the noise=0.5 contour
    // (a sweeping curve through the map). Lower = closer to ridge spine.
    const ridge = (x: number, y: number, scale: number, offX: number, offY: number): number =>
      Math.abs(noise(x * scale + offX, y * scale + offY) - 0.5) * 2;

    // -------- PASS 1: FLAT → HILLS --------
    for (const cell of cells) {
      const i = idx(cell.x, cell.y);
      if (!isFlatLand(baseAssignment[i])) {
        continue;
      }
      if (isInPolarCap(cell.y)) {
        continue; // polar caps stay flat
      }
      const rMain = ridge(cell.x, cell.y, 0.07, 111, 222); // long sweeping main spine
      const rCross = ridge(cell.x, cell.y, 0.14, 444, 555); // shorter secondary spines
      const ridgeScore = Math.min(rMain, rCross);
      // Jitter widens / breaks the ridge edge, giving loose hilly fringes
      const jitter = (noise(cell.x * 0.22 + 888, cell.y * 0.22 + 999) - 0.5) * 0.18;
      // Rolling-hill blob noise: occasional hill patches not on any ridge
      const rolling = noise(cell.x * 0.10 + 666, cell.y * 0.10 + 777);
      // Tuned −25%: ridge threshold 0.22 → 0.17, rolling threshold 0.85 → 0.89.
      if (ridgeScore + jitter < 0.17 || rolling > 0.89) {
        baseAssignment[i] = toHills(baseAssignment[i]);
      }
    }

    // -------- PASS 2: HILLS → MOUNTAIN --------
    for (const cell of cells) {
      const i = idx(cell.x, cell.y);
      if (!isHillsLand(baseAssignment[i])) {
        continue;
      }
      const rMain = ridge(cell.x, cell.y, 0.07, 111, 222);
      if (rMain < 0.06) {
        // Narrow core of the main ridge → mountain
        baseAssignment[i] = toMountain(baseAssignment[i]);
      } else if (rMain < 0.18) {
        // Foothill zone: sparse individual mountains. Threshold raised from 0.85 → 0.92
        // to cut the singleton-mountain count; Pass 3 below kills any survivors.
        const speck = noise(cell.x * 0.35 + 1111, cell.y * 0.35 + 2222);
        if (speck > 0.92) {
          baseAssignment[i] = toMountain(baseAssignment[i]);
        }
      }
    }

    // -------- PASS 3: cluster cleanup --------
    // Any mountain tile with zero mountain neighbors is demoted back to hills.
    // Snapshot-based decision so iteration order doesn't bias the result.
    // Net effect: lone single-tile mountains can't survive — mountains only
    // appear as connected groups (≥2 cells touching), so they read as clusters
    // and small ranges instead of scattered specks.
    const elevationSnapshot = baseAssignment.slice();
    for (const cell of cells) {
      const i = idx(cell.x, cell.y);
      if (!isMountainLand(elevationSnapshot[i])) {
        continue;
      }
      let mountainNeighbors = 0;
      for (const n of neighbors(cell.x, cell.y)) {
        if (isMountainLand(elevationSnapshot[idx(n.x, n.y)])) {
          mountainNeighbors += 1;
          break;
        }
      }
      if (mountainNeighbors === 0) {
        baseAssignment[i] = demoteToHills(elevationSnapshot[i]);
      }
    }

    // -------- PASS 4: connect mountain clusters across hex distance 3 --------
    // For every mountain M, scan its hex-distance-3 ring (18 cells). If another
    // mountain N is found, fill the 2 intermediate tiles of the shortest hex
    // path with mountains (preserving biome family: FLAT → MOUNTAIN promotes
    // through hills implicitly via toMountain(toHills(...))). Joins isolated
    // small clusters of 2–4 tiles into longer connected ranges.
    //
    // Uses an offset-→-cube coord conversion for hex-distance math and
    // line-draw. Water, lakes, coast, and snow caps in the path are SKIPPED —
    // no mountain bridges over ocean.
    const offsetToCube = (col: number, row: number): [number, number, number] => {
      const cx = col - Math.floor((row - (row & 1)) / 2);
      return [cx, -cx - row, row];
    };
    const cubeToOffset = (cx: number, cz: number): [number, number] => {
      const col = cx + Math.floor((cz - (cz & 1)) / 2);
      return [col, cz];
    };
    const cubeRound = (fx: number, fy: number, fz: number): [number, number, number] => {
      let rx = Math.round(fx);
      let ry = Math.round(fy);
      let rz = Math.round(fz);
      const adx = Math.abs(rx - fx);
      const ady = Math.abs(ry - fy);
      const adz = Math.abs(rz - fz);
      if (adx > ady && adx > adz) {
        rx = -ry - rz;
      } else if (ady > adz) {
        ry = -rx - rz;
      } else {
        rz = -rx - ry;
      }
      return [rx, ry, rz];
    };

    const connectSnapshot = baseAssignment.slice();
    for (let mIdx = 0; mIdx < cells.length; mIdx++) {
      if (!isMountainLand(connectSnapshot[mIdx])) {
        continue;
      }
      const m = cells[mIdx];
      const [mcx, mcy, mcz] = offsetToCube(m.x, m.y);

      for (let dy = -3; dy <= 3; dy++) {
        const ny = m.y + dy;
        if (ny < 0 || ny >= height) {
          continue;
        }
        for (let dx = -3; dx <= 3; dx++) {
          if (dx === 0 && dy === 0) {
            continue;
          }
          const nx = (((m.x + dx) % width) + width) % width;
          const [ncx, ncy, ncz] = offsetToCube(nx, ny);
          const distHex = Math.max(Math.abs(mcx - ncx), Math.abs(mcy - ncy), Math.abs(mcz - ncz));
          if (distHex !== 3) {
            continue;
          }
          const nIdx = idx(nx, ny);
          if (!isMountainLand(connectSnapshot[nIdx])) {
            continue;
          }
          // Fill the 2 intermediate hexes (t = 1/3, 2/3) along M → N
          for (let step = 1; step <= 2; step++) {
            const t = step / 3;
            const [rx, , rz] = cubeRound(mcx + (ncx - mcx) * t, mcy + (ncy - mcy) * t, mcz + (ncz - mcz) * t);
            const [col, row] = cubeToOffset(rx, rz);
            if (row < 0 || row >= height) {
              continue;
            }
            if (isInPolarCap(row)) {
              continue; // don't bridge mountains through the polar cap
            }
            const wrappedCol = ((col % width) + width) % width;
            const fillIdx = idx(wrappedCol, row);
            const cur = baseAssignment[fillIdx];
            if (isMountainLand(cur)) {
              continue;
            }
            if (isHillsLand(cur)) {
              baseAssignment[fillIdx] = toMountain(cur);
              resourceAssignment[fillIdx] = TerrainResourceId.IRON;
            } else if (isFlatLand(cur)) {
              baseAssignment[fillIdx] = toMountain(toHills(cur));
              resourceAssignment[fillIdx] = TerrainResourceId.IRON;
            }
            // Water / lake / coast / snow_cap: skip — no mountain over ocean
          }
        }
      }
    }

    // -------- PASS 5: extend small mountain clusters from ONE random source --------
    // Group EXISTING mountains (snapshot of state at start of this pass) into
    // connected clusters. For each cluster with fewer than 4 tiles, pick ONE
    // random mountain from the cluster's "perimeter" (cells that have at least
    // one extendable land neighbor), stamp it MERCURY, then random-walk extend
    // from that single source by 1–5 tiles. Each new tile is stamped URANIUM.
    //
    // Snapshot-based clustering ensures we don't keep finding new clusters as
    // we add extensions — every cluster is grouped from the original mountains
    // only.
    const pass5Snapshot = baseAssignment.slice();
    const clusterVisited = new Array<boolean>(cells.length).fill(false);
    for (let startIdx = 0; startIdx < cells.length; startIdx++) {
      if (!isMountainLand(pass5Snapshot[startIdx]) || clusterVisited[startIdx]) {
        continue;
      }
      // Flood-fill this cluster from the snapshot
      const cluster: number[] = [];
      const stack = [startIdx];
      clusterVisited[startIdx] = true;
      while (stack.length > 0) {
        const cur = stack.pop();
        cluster.push(cur);
        const cc = cells[cur];
        for (const n of neighbors(cc.x, cc.y)) {
          const nIdx = idx(n.x, n.y);
          if (isMountainLand(pass5Snapshot[nIdx]) && !clusterVisited[nIdx]) {
            clusterVisited[nIdx] = true;
            stack.push(nIdx);
          }
        }
      }
      if (cluster.length >= 4) {
        continue; // big enough already
      }
      // Filter to perimeter members — those with at least one extendable land
      // neighbor (FLAT or HILLS, non-polar). Source must be able to extend.
      const perimeterSources = cluster.filter(cIdx => {
        const c = cells[cIdx];
        for (const n of neighbors(c.x, c.y)) {
          if (isInPolarCap(n.y)) {
            continue;
          }
          const nbBase = baseAssignment[idx(n.x, n.y)];
          if (isFlatLand(nbBase) || isHillsLand(nbBase)) {
            return true;
          }
        }
        return false;
      });
      if (perimeterSources.length === 0) {
        continue;
      }
      // Pick ONE random source from the cluster perimeter
      const sourceIdx = perimeterSources[Math.floor(rnd() * perimeterSources.length)];
      resourceAssignment[sourceIdx] = TerrainResourceId.MERCURY;

      // Random-walk extend from the source by 1–5 tiles. Each step picks a
      // random non-mountain land neighbor of the current tile, converts it to
      // mountain (URANIUM marker), and steps onto it. Stops early if walk
      // hits a dead end (e.g. surrounded by water/mountain).
      const extendCount = 1 + Math.floor(rnd() * 5);
      let current = cells[sourceIdx];
      for (let step = 0; step < extendCount; step++) {
        const walkCandidates: Cell[] = [];
        for (const n of neighbors(current.x, current.y)) {
          if (isInPolarCap(n.y)) {
            continue;
          }
          const nIdx = idx(n.x, n.y);
          if (isMountainLand(baseAssignment[nIdx])) {
            continue;
          }
          const cur = baseAssignment[nIdx];
          if (isFlatLand(cur) || isHillsLand(cur)) {
            walkCandidates.push(cells[nIdx]);
          }
        }
        if (walkCandidates.length === 0) {
          break; // dead end
        }
        const next = walkCandidates[Math.floor(rnd() * walkCandidates.length)];
        const nIdx = idx(next.x, next.y);
        const cur = baseAssignment[nIdx];
        if (isHillsLand(cur)) {
          baseAssignment[nIdx] = toMountain(cur);
        } else if (isFlatLand(cur)) {
          baseAssignment[nIdx] = toMountain(toHills(cur));
        }
        resourceAssignment[nIdx] = TerrainResourceId.URANIUM;
        current = next;
      }
    }
  }

  // Restores the per-continent debug-food markers that landReset wiped.
  // For every cell whose plate is a continent or non-archipelago island, stamp
  // its `parentPlateId % 6`th food (wheat / rice / cattle / sheep / bananas /
  // fish). Skips mountain tiles so the IRON / MERCURY / URANIUM markers from
  // addTerrainElevation survive. Archipelagos remain resource-less.
  private markContinents(ctx: MapGenContext): void {
    const { cells, idx, plates, baseAssignment, resourceAssignment } = ctx;

    const plateById = new Map<number, Plate>();
    for (const p of plates) {
      plateById.set(p.id, p);
    }
    const debugFoodByPlateIndex: TerrainResourceId[] = [
      TerrainResourceId.WHEAT,
      TerrainResourceId.RICE,
      TerrainResourceId.CATTLE,
      TerrainResourceId.SHEEP,
      TerrainResourceId.BANANAS,
      TerrainResourceId.FISH,
    ];
    const isMountainBase = (b: TerrainBaseId): boolean =>
      b === TerrainBaseId.GRASSLAND_MOUNTAIN ||
      b === TerrainBaseId.PLAINS_MOUNTAIN ||
      b === TerrainBaseId.DESERT_MOUNTAIN ||
      b === TerrainBaseId.TUNDRA_MOUNTAIN ||
      b === TerrainBaseId.SNOW_MOUNTAIN;

    for (const cell of cells) {
      if (cell.plateId < 0) {
        continue; // ocean / lake / coast / icecap-original-ocean — no plate
      }
      const plate = plateById.get(cell.plateId);
      if (!plate || plate.isArchipelago) {
        continue; // archipelagos stay resource-less
      }
      const i = idx(cell.x, cell.y);
      if (isMountainBase(baseAssignment[i])) {
        continue; // keep IRON / MERCURY / URANIUM from addTerrainElevation
      }
      resourceAssignment[i] = debugFoodByPlateIndex[plate.parentPlateId % debugFoodByPlateIndex.length];
    }
  }

  // Wipes every cell's resource assignment back to NONE. Clears the debug-food
  // markers that markContinents stamped AND the IRON / MERCURY / URANIUM markers
  // that addTerrainElevation placed on mountains. Leaves baseAssignment and
  // featureAssignment untouched — terrain and features remain.
  private clearResources(ctx: MapGenContext): void {
    ctx.resourceAssignment.fill(TerrainResourceId.NONE);
  }

  // Elevation + climate + base terrain + lake reclassification + ocean→coast band.
  // This phase shapes everything at the land/water interface, so it owns the climate
  // calc (climate depends on the final land map) and the COAST/LAKE assignment.
  private generateCoasts(ctx: MapGenContext): void {
    const { height, rnd, noise, idx, cells, neighbors, tempOffset, rainfallOffset, baseAssignment } = ctx;

    // ---- Elevation: ridge noise + rolling-hills noise + plate-boundary bonus
    for (const cell of cells) {
      if (!cell.isLand) {
        cell.elevation = 0;
        continue;
      }
      let e = 0.35 + rnd() * 0.2;
      const ridgeN = Math.abs(noise(cell.x * 0.14 + 333, cell.y * 0.14 + 777) - 0.5) * 2;
      e += ridgeN * 0.35;
      e += (noise(cell.x * 0.08 + 51, cell.y * 0.08 + 19) - 0.5) * 0.3;
      let touchesOtherPlate = false;
      let touchesOcean = false;
      for (const n of neighbors(cell.x, cell.y)) {
        const nc = cells[idx(n.x, n.y)];
        if (!nc.isLand) {
          touchesOcean = true;
        } else if (nc.plateId !== cell.plateId) {
          touchesOtherPlate = true;
        }
      }
      if (touchesOtherPlate) {
        e += 0.35 + rnd() * 0.35;
      }
      if (touchesOcean) {
        e -= 0.2;
      }
      cell.elevation = Math.max(0, e);
    }
    // Single hex-average smoothing pass — breaks elevation speckle
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
    for (const cell of cells) {
      cell.elevation = smoothed[idx(cell.x, cell.y)];
    }

    // ---- Temperature: latitude + elevation penalty + jitter
    const equatorY = (height - 1) / 2;
    for (const cell of cells) {
      const latNorm = Math.abs(cell.y - equatorY) / equatorY;
      let t = 1 - latNorm + tempOffset + (noise(cell.x * 0.13, cell.y * 0.13) - 0.5) * 0.15;
      if (cell.isLand) {
        t -= Math.max(0, cell.elevation - 0.4) * 0.5;
      }
      cell.temperature = Math.min(1, Math.max(0, t));
    }

    // ---- Moisture: latitude curve + westerly rain shadow
    const latMoisture = (y: number): number => {
      const latNorm = Math.abs(y - equatorY) / equatorY;
      const lat30 = 0.33;
      const lat50 = 0.55;
      if (latNorm < lat30) {
        return 0.75 - latNorm * (0.55 / lat30);
      }
      if (latNorm < lat50) {
        return 0.2 + ((latNorm - lat30) / (lat50 - lat30)) * 0.35;
      }
      return 0.55 - ((latNorm - lat50) / (1 - lat50)) * 0.45;
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
        if (!up.isLand) {
          m += 0.2 * (1 - (step - 1) * 0.2);
        } else if (up.elevation >= 0.85) {
          m -= 0.3;
          blocked = true;
        }
      }
      m += rainfallOffset + (noise(cell.x * 0.21 + 99, cell.y * 0.21 + 31) - 0.5) * 0.1;
      cell.moisture = Math.min(1, Math.max(0, m));
    }

    // ---- Base terrain assignment (climate only — all FLAT at this stage)
    // No hills/mountains and no snow/tundra here. Elevation lives in cell.elevation
    // ready to be consumed by a later (currently absent) "addElevation" phase, and
    // polar snow is owned by generateIcecaps. This phase produces just three biomes:
    // GRASSLAND_FLAT / PLAINS_FLAT / DESERT_FLAT.
    const pickLand = (cell: Cell): TerrainBaseId => {
      let family: 'GRASSLAND' | 'PLAINS' | 'DESERT';
      if (cell.temperature >= 0.75 && cell.moisture < 0.3) {
        family = 'DESERT';
      } else if (cell.moisture < 0.3) {
        family = 'PLAINS';
      } else {
        family = 'GRASSLAND';
      }
      const key = `${family}_FLAT` as keyof typeof TerrainBaseId;
      return TerrainBaseId[key];
    };
    for (const cell of cells) {
      const i = idx(cell.x, cell.y);
      // Preserve icecaps (SNOW_FLAT was placed by generateIcecaps before this phase).
      if (baseAssignment[i] === TerrainBaseId.SNOW_FLAT) {
        continue;
      }
      baseAssignment[i] = cell.isLand ? pickLand(cell) : TerrainBaseId.OCEAN;
    }

    this.applyCoastBand(ctx);
  }

  // Largest-component lake detection + ocean→coast band. Called by generateCoasts
  // and again at the end of generateArchipelagos so islands and archipelagos also
  // get a coast ring and any new inland water (e.g. ocean cells surrounded by a
  // tight island cluster) becomes a lake.
  //
  // Approach: find every connected OCEAN component; the LARGEST is the "world
  // ocean"; everything else is inland → LAKE. This works regardless of whether the
  // polar rows are ocean or icecap, which the previous polar-flood-fill approach
  // could not handle.
  // Find every connected OCEAN component. Only convert ones ≤6 tiles to LAKE —
  // larger inland bodies stay OCEAN (their perimeter still becomes COAST in the
  // coast band pass, so they read as a "small sea" rather than a giant lake).
  // Every LAKE tile is stamped with FISH; any leftover polar ICE feature is
  // stripped (ICE isn't valid on LAKE).
  private generateLakes(ctx: MapGenContext): void {
    const { idx, cells, neighbors, baseAssignment, featureAssignment, resourceAssignment } = ctx;

    const visited = new Array<boolean>(cells.length).fill(false);
    for (let i = 0; i < cells.length; i++) {
      if (baseAssignment[i] !== TerrainBaseId.OCEAN || visited[i]) {
        continue;
      }
      const comp: number[] = [];
      const stack = [i];
      visited[i] = true;
      while (stack.length > 0) {
        const cur = stack.pop();
        comp.push(cur);
        const cc = cells[cur];
        for (const n of neighbors(cc.x, cc.y)) {
          const ni = idx(n.x, n.y);
          if (baseAssignment[ni] === TerrainBaseId.OCEAN && !visited[ni]) {
            visited[ni] = true;
            stack.push(ni);
          }
        }
      }
      if (comp.length <= 6) {
        for (const cIdx of comp) {
          baseAssignment[cIdx] = TerrainBaseId.LAKE;
          if (featureAssignment[cIdx] === TerrainFeatureId.ICE) {
            featureAssignment[cIdx] = TerrainFeatureId.NONE;
          }
          resourceAssignment[cIdx] = TerrainResourceId.FISH;
        }
      }
    }
  }

  // Every OCEAN tile adjacent to non-snow land becomes COAST. Snow caps
  // (SNOW_FLAT) deliberately do NOT trigger coast conversion — the polar belt
  // stays as OCEAN+ICE rather than COAST, per the design.
  private applyCoastBand(ctx: MapGenContext): void {
    const { idx, cells, neighbors, baseAssignment } = ctx;

    for (const cell of cells) {
      const i = idx(cell.x, cell.y);
      if (baseAssignment[i] !== TerrainBaseId.OCEAN) {
        continue;
      }
      for (const n of neighbors(cell.x, cell.y)) {
        const nIdx = idx(n.x, n.y);
        const nb = baseAssignment[nIdx];
        if (
          nb !== TerrainBaseId.OCEAN &&
          nb !== TerrainBaseId.COAST &&
          nb !== TerrainBaseId.LAKE &&
          nb !== TerrainBaseId.SNOW_FLAT
        ) {
          baseAssignment[i] = TerrainBaseId.COAST;
          break;
        }
      }
    }
  }

  private generateIcecaps(ctx: MapGenContext): void {
    const { width, height, rnd, idx, neighbors, cells, baseAssignment, featureAssignment, resourceAssignment } = ctx;

    // Helper: 75% of the time the cell becomes a SNOW_FLAT (land) tile; 25% of the
    // time it becomes OCEAN with an ICE feature instead. Gives the cap floating-ice
    // breaks rather than a solid wall. If the cell was a continent that reached the
    // polar margin we also reset its plate state so it stops being land.
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

    // Row 0 and last row: every cell gets snow-or-ice (formerly unconditional snow).
    for (let x = 0; x < width; x++) {
      placeSnowOrIce(idx(x, 0));
      placeSnowOrIce(idx(x, height - 1));
    }
    // Row 1 and second-to-last row: 50% chance per cell.
    for (let x = 0; x < width; x++) {
      if (rnd() < 0.5) {
        placeSnowOrIce(idx(x, 1));
      }
      if (rnd() < 0.5) {
        placeSnowOrIce(idx(x, height - 2));
      }
    }
    // Row 2 and third-to-last row: 5–10% chance, only if at least one neighbor is
    // already SNOW_FLAT or ICE (treats both as "cap-like" for connectivity since the
    // 25% ice replacement scattered some breaks into the otherwise snow rows above).
    // Frays the cap edge so it doesn't end on a hard line.
    const fringeProb = 0.05 + rnd() * 0.05;
    for (let x = 0; x < width; x++) {
      for (const y of [2, height - 3]) {
        const i = idx(x, y);
        let connected = false;
        for (const n of neighbors(x, y)) {
          const nIdx = idx(n.x, n.y);
          if (
            baseAssignment[nIdx] === TerrainBaseId.SNOW_FLAT ||
            featureAssignment[nIdx] === TerrainFeatureId.ICE
          ) {
            connected = true;
            break;
          }
        }
        if (connected && rnd() < fringeProb) {
          placeSnowOrIce(i);
        }
      }
    }
    // ICE feature belt around the cap, on OCEAN cells. Probabilities thin out as
    // we move away from the cap: row 1/h-2 = 30%, row 2/h-3 = 20%, row 3/h-4 = 10%.
    // Connectivity requirement: a cell can only receive ICE if at least one neighbor
    // is already SNOW_FLAT or has the ICE feature. Rows are processed from the cap
    // outward so each later row can build on the ice placed in the previous one —
    // produces fragmented ice sheets extending from the snow rather than scattered
    // isolated tiles.
    //
    // ICE survives the later OCEAN→COAST conversion (ICE is valid on COAST too).
    // growPlates clears featureAssignment when overwriting an ocean cell so a later
    // island can't end up with leftover polar ice. landReset also explicitly
    // preserves the ICE feature.
    const iceBands: { y: number; prob: number }[] = [
      { y: 1, prob: 0.3 },
      { y: 2, prob: 0.2 },
      { y: 3, prob: 0.1 },
      { y: height - 2, prob: 0.3 },
      { y: height - 3, prob: 0.2 },
      { y: height - 4, prob: 0.1 },
    ];
    for (const band of iceBands) {
      if (band.y < 0 || band.y >= height) {
        continue;
      }
      for (let x = 0; x < width; x++) {
        const i = idx(x, band.y);
        if (baseAssignment[i] !== TerrainBaseId.OCEAN) {
          continue;
        }
        // Connectivity gate: must be adjacent to SNOW_FLAT or existing ICE
        let connected = false;
        for (const n of neighbors(x, band.y)) {
          const nIdx = idx(n.x, n.y);
          if (
            baseAssignment[nIdx] === TerrainBaseId.SNOW_FLAT ||
            featureAssignment[nIdx] === TerrainFeatureId.ICE
          ) {
            connected = true;
            break;
          }
        }
        if (connected && rnd() < band.prob) {
          featureAssignment[i] = TerrainFeatureId.ICE;
        }
      }
    }
  }

  private addTerrainFeatures(ctx: MapGenContext): void {
    const { height, rnd, noise, idx, cells, baseAssignment, featureAssignment } = ctx;
    const equatorY = (height - 1) / 2;

    const featureSupports = (featureId: TerrainFeatureId, baseId: TerrainBaseId): boolean => {
      const meta = TERRAIN_FEATURE_SET[featureId];
      if (!meta) {
        return false;
      }
      for (const st of meta.suitableTerrain) {
        if (st.baseId !== undefined && st.baseId === baseId) {
          return true;
        }
      }
      return false;
    };

    // Per-cell at-most-one feature. Order matters — first matching branch wins.
    // Rates tuned for Earth-like sparsity: WOODS is the only "common" feature
    // (~25–45% of qualifying temperate/cold flats and hills); the others are rare
    // and only fire in their proper climates.
    for (const cell of cells) {
      const i = idx(cell.x, cell.y);
      if (featureAssignment[i] !== TerrainFeatureId.NONE) {
        continue; // icecaps already placed ICE here
      }
      const base = baseAssignment[i];
      const latNorm = Math.abs(cell.y - equatorY) / equatorY;

      if ((base === TerrainBaseId.COAST || base === TerrainBaseId.OCEAN) && featureSupports(TerrainFeatureId.ICE, base)) {
        // Sub-polar ICE band — fills any coast/ocean tiles in polar latitudes
        // that the generateIcecaps belt missed.
        if (latNorm > 0.92 || (latNorm > 0.85 && rnd() < (latNorm - 0.85) * 12)) {
          featureAssignment[i] = TerrainFeatureId.ICE;
        }
      } else if (base === TerrainBaseId.OCEAN && featureSupports(TerrainFeatureId.REEF, base) && latNorm < 0.3 && rnd() < 0.015) {
        // Warm-ocean reefs: rare clusters in the tropical belt
        featureAssignment[i] = TerrainFeatureId.REEF;
      } else if (
        featureSupports(TerrainFeatureId.RAINFOREST, base) &&
        cell.temperature >= 0.7 &&
        cell.moisture >= 0.55 &&
        // Noise-based decision (period ~6 tiles) instead of per-cell rnd → adjacent
        // cells share roughly the same value, so rainforest forms clusters rather
        // than speckle. Threshold 0.715 = old 0.55 × 1.3 (+30%).
        noise(cell.x * 0.15 + 333, cell.y * 0.15 + 222) < 0.715
      ) {
        featureAssignment[i] = TerrainFeatureId.RAINFOREST;
      } else if (featureSupports(TerrainFeatureId.MARSH, base) && cell.moisture > 0.7 && rnd() < 0.1) {
        // Wet grassland → occasional marsh
        featureAssignment[i] = TerrainFeatureId.MARSH;
      } else if (featureSupports(TerrainFeatureId.OASIS, base) && rnd() < 0.03) {
        // Sparse desert oases
        featureAssignment[i] = TerrainFeatureId.OASIS;
      } else if (
        featureSupports(TerrainFeatureId.WOODS, base) &&
        // Noise-based (period ~8 tiles) for clustering. Threshold = (0.18 + m×0.30) × 1.3
        // = 0.234 + m × 0.39 (+30% woods overall).
        noise(cell.x * 0.12 + 555, cell.y * 0.12 + 777) < 0.234 + cell.moisture * 0.39
      ) {
        featureAssignment[i] = TerrainFeatureId.WOODS;
      }
    }
  }

  // Greedy placement up to per-type quotas; no separation check here.
  // normalizeResources thins out same-type tiles that ended up too close.
  // Places BONUS (food), STRATEGIC (industry), and LUXURY resources across the
  // map with Poisson-disk-style even spread (no clustering).
  //
  // Per-type targets ~3-4% of land tiles. Two distance constraints enforce
  // even spread:
  //   - any two resources must be at least 2 hexes apart (no direct neighbors)
  //   - two resources of the SAME type must be at least 4 hexes apart
  //
  // Greedy placement: shuffle candidates, walk in order, accept those that pass
  // both distance gates. Each accepted tile is assigned a random fitting resource
  // from its type's list (respecting suitableTerrain).
  private addResources(ctx: MapGenContext): void {
    const { width, rnd, idx, cells, neighbors, baseAssignment, featureAssignment, resourceAssignment } = ctx;

    // Wipe any leftover markers
    resourceAssignment.fill(TerrainResourceId.NONE);

    // BFS distance-to-land so sea resources (FISH, WHALES, PEARLS, …) only
    // appear near coastlines, not in deep ocean.
    const distToLand: number[] = new Array(cells.length).fill(99);
    const distQueue: number[] = [];
    for (let i = 0; i < cells.length; i++) {
      if (cells[i].isLand) {
        distToLand[i] = 0;
        distQueue.push(i);
      }
    }
    let qHead = 0;
    while (qHead < distQueue.length) {
      const cur = distQueue[qHead++];
      const nextDist = distToLand[cur] + 1;
      if (nextDist > 4) {
        continue;
      }
      const cc = cells[cur];
      for (const nb of neighbors(cc.x, cc.y)) {
        const nIdx = idx(nb.x, nb.y);
        if (distToLand[nIdx] > nextDist) {
          distToLand[nIdx] = nextDist;
          distQueue.push(nIdx);
        }
      }
    }

    const tileMatchesSuitability = (cellIdx: number, suitable: { baseId?: TerrainBaseId; featureId?: TerrainFeatureId }[]): boolean => {
      const base = baseAssignment[cellIdx];
      const feat = featureAssignment[cellIdx];
      for (const st of suitable) {
        const baseOk = st.baseId === undefined || st.baseId === base;
        const featOk = st.featureId === undefined || st.featureId === feat;
        if (baseOk && featOk) {
          return true;
        }
      }
      return false;
    };

    // Hex distance with horizontal-wrap awareness (odd-r offset → cube).
    const hexDistance = (aIdx: number, bIdx: number): number => {
      const a = cells[aIdx];
      const b = cells[bIdx];
      let bxNear = b.x;
      if (b.x - a.x > width / 2) {
        bxNear -= width;
      } else if (a.x - b.x > width / 2) {
        bxNear += width;
      }
      const ax = a.x - Math.floor((a.y - (a.y & 1)) / 2);
      const az = a.y;
      const ay = -ax - az;
      const bx = bxNear - Math.floor((b.y - (b.y & 1)) / 2);
      const bz = b.y;
      const by = -bx - bz;
      return Math.max(Math.abs(ax - bx), Math.abs(ay - by), Math.abs(az - bz));
    };

    // Group every TERRAIN_RESOURCE_LIST entry by its TerrainResourceTypeId.
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
    // Roughly even split across three types — gives ~10% total resource coverage.
    const countsByType: [TerrainResourceTypeId, number][] = [
      [TerrainResourceTypeId.BONUS, Math.floor(totalLand * 0.04)],
      [TerrainResourceTypeId.STRATEGIC, Math.floor(totalLand * 0.03)],
      [TerrainResourceTypeId.LUXURY, Math.floor(totalLand * 0.03)],
    ];

    const MIN_SAME_TYPE = 4;
    const MIN_ANY = 2;

    // Track placed positions for distance checks
    const placedByType = new Map<TerrainResourceTypeId, number[]>();
    for (const [type] of countsByType) {
      placedByType.set(type, []);
    }
    const allPlaced: number[] = [];

    for (const [type, target] of countsByType) {
      const typeResources = resourcesByType.get(type) || [];
      if (typeResources.length === 0 || target === 0) {
        continue;
      }

      // Candidates: any cell within 3 hexes of land that has at least ONE
      // resource of this type matching its terrain.
      const candidates: number[] = [];
      for (let i = 0; i < cells.length; i++) {
        if (distToLand[i] > 3) {
          continue;
        }
        if (resourceAssignment[i] !== TerrainResourceId.NONE) {
          continue;
        }
        for (const r of typeResources) {
          if (tileMatchesSuitability(i, r.suitableTerrain)) {
            candidates.push(i);
            break;
          }
        }
      }

      // Shuffle so the order in which we attempt placement is unbiased
      for (let i = candidates.length - 1; i > 0; i--) {
        const j = Math.floor(rnd() * (i + 1));
        const tmp = candidates[i];
        candidates[i] = candidates[j];
        candidates[j] = tmp;
      }

      const samePlaced = placedByType.get(type);
      let placed = 0;
      for (const cIdx of candidates) {
        if (placed >= target) {
          break;
        }
        // Same-type distance gate
        let tooClose = false;
        for (const p of samePlaced) {
          if (hexDistance(cIdx, p) < MIN_SAME_TYPE) {
            tooClose = true;
            break;
          }
        }
        if (tooClose) {
          continue;
        }
        // Any-type distance gate (no two resources directly adjacent)
        for (const p of allPlaced) {
          if (hexDistance(cIdx, p) < MIN_ANY) {
            tooClose = true;
            break;
          }
        }
        if (tooClose) {
          continue;
        }
        // Pick a random resource of this type that fits this tile's terrain
        const fitting = typeResources.filter(r => tileMatchesSuitability(cIdx, r.suitableTerrain));
        if (fitting.length === 0) {
          continue;
        }
        const chosen = fitting[Math.floor(rnd() * fitting.length)];
        resourceAssignment[cIdx] = chosen.id;
        samePlaced.push(cIdx);
        allPlaced.push(cIdx);
        placed += 1;
      }
    }

    // -------- Extra food pass --------
    // Doubles the BONUS-resource count (+4% of land). Unlike the main pass this
    // one is purely random — no even-spread distance. The only constraint is
    // that no two same-type resources end up adjacent (so a new BONUS won't
    // land next to any existing BONUS, original or extra).
    const resourceIdToType = new Map<TerrainResourceId, TerrainResourceTypeId>();
    for (const r of TERRAIN_RESOURCE_LIST) {
      resourceIdToType.set(r.id, r.type);
    }
    const bonusResources = resourcesByType.get(TerrainResourceTypeId.BONUS) || [];
    const extraTarget = Math.floor(totalLand * 0.04);
    if (bonusResources.length > 0 && extraTarget > 0) {
      const extraCandidates: number[] = [];
      for (let i = 0; i < cells.length; i++) {
        if (distToLand[i] > 3) {
          continue;
        }
        if (resourceAssignment[i] !== TerrainResourceId.NONE) {
          continue;
        }
        for (const r of bonusResources) {
          if (tileMatchesSuitability(i, r.suitableTerrain)) {
            extraCandidates.push(i);
            break;
          }
        }
      }
      for (let i = extraCandidates.length - 1; i > 0; i--) {
        const j = Math.floor(rnd() * (i + 1));
        const tmp = extraCandidates[i];
        extraCandidates[i] = extraCandidates[j];
        extraCandidates[j] = tmp;
      }
      let placed = 0;
      for (const cIdx of extraCandidates) {
        if (placed >= extraTarget) {
          break;
        }
        // Adjacency-only check: no immediate neighbor may already be BONUS
        const c = cells[cIdx];
        let neighborBonus = false;
        for (const n of neighbors(c.x, c.y)) {
          const nbRes = resourceAssignment[idx(n.x, n.y)];
          if (nbRes === TerrainResourceId.NONE) {
            continue;
          }
          if (resourceIdToType.get(nbRes) === TerrainResourceTypeId.BONUS) {
            neighborBonus = true;
            break;
          }
        }
        if (neighborBonus) {
          continue;
        }
        const fitting = bonusResources.filter(r => tileMatchesSuitability(cIdx, r.suitableTerrain));
        if (fitting.length === 0) {
          continue;
        }
        const chosen = fitting[Math.floor(rnd() * fitting.length)];
        resourceAssignment[cIdx] = chosen.id;
        placed += 1;
      }
    }
  }

  // Poisson-disk-ish thinning per resource type so no resource forms a dense clump.
  // For each placed resource, if a same-type resource exists within minSep at a lower
  // cell index (earlier in column-major order), we drop this one — earliest wins.
  private normalizeResources(ctx: MapGenContext): void {
    const { width, idx, cells, inBounds, resourceAssignment } = ctx;

    const minSepByType: { [k in TerrainResourceTypeId]: number } = {
      [TerrainResourceTypeId.BONUS]: 3,
      [TerrainResourceTypeId.STRATEGIC]: 4,
      [TerrainResourceTypeId.LUXURY]: 6,
    };
    const typeByResourceId = new Map<TerrainResourceId, TerrainResourceTypeId>();
    for (const r of TERRAIN_RESOURCE_LIST) {
      typeByResourceId.set(r.id, r.type);
    }

    for (let i = 0; i < cells.length; i++) {
      const rId = resourceAssignment[i];
      if (rId === TerrainResourceId.NONE) {
        continue;
      }
      const type = typeByResourceId.get(rId);
      if (type === undefined) {
        continue;
      }
      const minSep = minSepByType[type];
      const cc = cells[i];
      let tooClose = false;
      for (let dy = -minSep; dy <= minSep && !tooClose; dy++) {
        for (let dx = -minSep; dx <= minSep && !tooClose; dx++) {
          if (dx === 0 && dy === 0) {
            continue;
          }
          const ny = cc.y + dy;
          if (!inBounds(0, ny)) {
            continue;
          }
          const nx = (((cc.x + dx) % width) + width) % width;
          const nIdx = idx(nx, ny);
          if (nIdx < i && resourceAssignment[nIdx] === rId) {
            tooClose = true;
          }
        }
      }
      if (tooClose) {
        resourceAssignment[i] = TerrainResourceId.NONE;
      }
    }
  }

  private materializeMap(ctx: MapGenContext): Map {
    const { width, height, rnd, idx, cells, plates, baseAssignment, featureAssignment, resourceAssignment, polarMargin } = ctx;

    // Build plate-id → landmass-number map.
    // Continents enumerated as 1, 2, 3, … (in plate-id order, so the first-seeded
    // continent gets 1).
    // Regular islands enumerated as 100, 101, …
    // Archipelago CLUSTERS (sub-islands sharing parentPlateId) enumerated as
    // 200, 201, … — every sub-island of one cluster shares the same id.
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

        // Compute landmass id:
        //   - Polar-margin SNOW_FLAT → 300 (top half) or 301 (bottom half)
        //   - Plate-owned land (continent/island/archipelago) → mapped id
        //   - Otherwise (ocean/coast/lake/etc) → 0
        let landmass = 0;
        if (baseId === TerrainBaseId.SNOW_FLAT && (y < polarMargin || y >= height - polarMargin)) {
          landmass = y < height / 2 ? 300 : 301;
        } else {
          const pid = cells[i].plateId;
          if (pid >= 0) {
            const mapped = plateIdToLandmass.get(pid);
            if (mapped !== undefined) {
              landmass = mapped;
            }
          }
        }

        // Field name MUST be uiVariant — tile-css-classes.pipe reads
        // `tile.terrain.feature.uiVariant` and `tile.terrain.base.uiVariant` to
        // build the variant-suffixed CSS class. Writing `variation` produced
        // `m-feature-ice-undefined` and the ice didn't render.
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
}
