# Map Generator

Single-file procedural map generator that produces an earth-like hex world from a settings object (with a seed). The entry point `MapGeneratorService.generateNewGameMap(settings)` runs a fixed sequence of small phases against a shared `MapGenContext` and returns a populated `Map`.

This doc is the **only** documentation for the generator — the service file itself carries no block comments, only the method bodies. Read this first, then the code.

---

## Vocabulary

| Term | Meaning |
|------|---------|
| **Cell** | One hex tile on the map (`{ x, y, plateId, isLand, elevation, temperature, moisture }`). |
| **Plate** | A logical landmass placed by priority-queue flood-fill growth. Has `id`, `seedX/Y`, `target` (intended size), `grown` (actual size), and classification flags (`isContinent`, `isArchipelago`, `parentPlateId`). |
| **Continent** | A large plate group made of 2–7 sub-plates sharing `parentPlateId`. `isContinent = true`. |
| **Island** | A small plate placed near continents. `isContinent = false`, `isArchipelago = false`. `parentPlateId` = nearest continent plate id. |
| **Archipelago** | A cluster of 2–5 tiny sub-island plates in deep ocean. `isArchipelago = true`. Sub-islands share `parentPlateId`. |
| **Ice cap** | Top and bottom polar rows. SNOW_FLAT land plus an ICE feature belt on adjacent ocean. Row count scales linearly with map height: 3 rows (Duel, h=26) to 5 rows (Max, h=160). Stored as `polarRowCount`. |
| **Lake** | An inland water body ≤ 6 tiles, converted from isolated ocean to LAKE terrain. |
| **Biome** | A flat/hills/mountain variant of GRASSLAND / PLAINS / DESERT / TUNDRA / SNOW. |
| **Equator** | Center latitude (normalized ~0.5). DESERT and PLAINS biomes concentrated here. |
| **Poles** | Top and bottom polar margin rows (`y < polarMargin` and `y ≥ height − polarMargin`). Covered by SNOW_FLAT and ICE. |
| **`MapGenContext`** | Shared bag passed to every phase. Holds `cells[]`, `plates[]`, three parallel assignment arrays (`base / feature / resource`), the seeded PRNG `rnd()`, the position noise `noise(x,y)`, and derived settings knobs. |

---

## Settings

```typescript
interface MapGeneratorSettings {
  seed: number;                     // mulberry32 seed; reproducible per-seed
  width, height: number;            // hex grid dimensions
  landmass: LandmassAmountId;       // LEAST..MOST → land % {0.10, 0.17, 0.25, 0.32, 0.40}
  continents: number;               // exact continent count (≥1)
  islands: number;                  // exact island count
  archipelagos: number;             // exact archipelago cluster count
  worldAge: WorldAgeId;             // mountain mult 1.4/1.0/0.5; hills+mountains ±10% (NEW/OLD); forests ∓10%
  temperature: TemperatureId;       // shifts latitude bands ±0.1; desert weight ×1.1/×1.0/×0.8
  rainfall: RainfallId;             // shifts moisture ±0.15; desert weight ×1.1/×1.0/×0.9
}
```

---

## Generation pipeline

Each step is a private method called from `generateNewGameMap`. Steps share state via `ctx`; downstream steps depend on upstream output.

### 1. Ice caps

| Step | Method | What it does |
|------|--------|--------------|
| 1 | `placeIcecapSnow` | Row 0/h-1: 75% SNOW_FLAT, 25% OCEAN+ICE. Row 1/h-2 (if polarRowCount≥2): 50% chance per cell. Row 2/h-3 (if polarRowCount≥3): 5–10% fringe where connected to existing snow/ice. BFS from polar-edge snow: any SNOW_FLAT not reachable from row 0/h-1 → OCEAN+ICE (prevents isolated inland snow). |
| 2 | `placeIcecapIceBelt` | Adds ICE features to ocean tiles in sub-polar rows at 30/20/10/5% probability, gated by SNOW/ICE neighbor requirement. |

### 2. Continents

| Step | Method | What it does |
|------|--------|--------------|
| 3 | `seedContinents` | Places continent seeds in three thirds: first third grid-balanced (jittered cells), second third fully random, third third satellite (placed at r1+r2 distance from an existing seed). Each continent plans 2–7 sub-plates. A two-pass equator correction ensures the average seed latitude stays within ±1/12 of map height from center. Player counts distributed across continents then shuffled. |
| 4 | `growContinentPlates` | Two-pass priority-queue flood-fill. **Main pass** (80% of budget, chaos 3): primary sub-plates use high chaos (0.6–1.4) and high shear (±0.3); secondary use low chaos (0.2–0.4) and minimal shear (±0.1). **Fringe pass** (3% extra, chaos 9): both primary and secondary plates get an extra fringe growth round with higher chaos/shear for irregular coastal edges. |
| 5 | `fillInlandOcean` | BFS from all map edges to mark outer ocean. Any ocean tile not reachable from the edge → PLAINS_FLAT land, assigned to the nearest adjacent plate. Eliminates landlocked seas. |

### 3. Islands

| Step | Method | What it does |
|------|--------|--------------|
| 6 | `seedIslands` | Two BFSes via `bfsDistance`: distance-to-land and nearest-continent-id. Seeds candidates from ocean 5–8 hex from land (near, 40%) or 9+ hex (far, 60%). Far seeds pushed further by a random multiple of island radius. Each island's target = 3–30% of parent continent area ×1.1, averaged toward normal. Seeds marked with 3-hex exclusion radius. Polar-cap clearance of 1.1R enforced. |
| 7 | `growIslandPlates` | Priority-queue flood from seed. Candidates gated by `isSea` (ocean, unplated) and no-adjacency-to-foreign-land. After growth, calls `detectInlandLakes` then `reshapeIslands`. |
| 8 | `detectInlandLakes` | BFS finds enclosed ocean regions ≤ 6 tiles that don't touch outer ocean → converted to LAKE. Clears any ICE feature on those tiles. Called inside `growIslandPlates`. |
| 9 | `reshapeIslands` | Per island: (a) fills all adjacent lakes (GRASSLAND_FLAT, skips if would connect separate land masses); (b) fills inland canals (5-neighbor seeds → BFS 3-4-neighbor tiles); (c) removes 80% of narrow peninsulas (1–2 land neighbors); (d) near-polar islands: detects straight coastal runs > 4 tiles on any of 3 hex axes, moves interior tiles to the opposite side of the island (preserves size, breaks straight coastline). |
| 10 | `clearNoiseRelatedIslands` | BFS finds all connected land components. Any component with no continent or archipelago tiles AND size < 4 → OCEAN + ICE feature (cleans up noise specks). |

### 4. Archipelagos

| Step | Method | What it does |
|------|--------|--------------|
| 11 | `seedArchipelagos` | Cluster centers chosen from ocean ≥3 hex from land, weighted by dist². Each cluster: 2–5 sub-islands placed within ~4 hex of center, each with exponential-distribution target (mostly 1–10 tiles). |
| 12 | `growArchipelagoPlates` | Shared `growPlates` with chaos 7.5; no-touch gap from continents enforced. |

### 5. Coast

| Step | Method | What it does |
|------|--------|--------------|
| 13 | `applyCoastBand` | Pre-step: land tiles on the innermost polar row → OCEAN (clean buffer). Main: every OCEAN tile adjacent to non-ocean/non-coast/non-lake land → COAST. Skips polar margin and icecap-continent snow boundaries. |

### 6. Biomes

| Step | Method | What it does |
|------|--------|--------------|
| 14 | `computeElevation` | Ridge + rolling-hills noise + plate-boundary bonus (not counting sub-plates), one smoothing pass. |
| 15 | `computeTemperature` | Latitude − elevation + noise jitter. |
| 16 | `computeMoisture` | Latitude curve + westerly rain shadow (4-step westward moisture bleed). |
| 17 | `paintInitialBiomes` | Assigns flat/hills/mountain biome per cell from temperature × moisture × elevation. Skips SNOW_FLAT (icecaps survive). |
| 18 | `paintLatitudeBiomes` | Per-cell weighted-noise biome pick using `isBiomePaintable`: DESERT (bell center 0, σ 0.12), PLAINS (center 0.13, σ 0.10), GRASSLAND (center 0.28, σ 0.12), TUNDRA (linear ramp above lat 0.35). Uses `noise()` for spatial stability. |
| 19 | `smoothBiomes` | 3 iterations of majority-vote cellular automaton (self + 6 neighbors). Skips non-paintable tiles (water, snow). |

### 7. Biome fine-tuning

| Step | Method | What it does |
|------|--------|--------------|
| 20 | `convertGrasslandToPlains` | ~20% of GRASSLAND → PLAINS via mid-frequency noise. |
| 21 | `mixPlainsAndGrassland` | ~10% high-frequency PLAINS↔GRASSLAND swap for micro-texture. |
| 22 | `speckleTundraNearEquator` | Equatorial TUNDRA tiles → PLAINS or GRASSLAND based on noise. |
| 23 | `intrudeTundraWithFingers` | Warm-edge TUNDRA tiles where intrusion noise exceeds proximity factor → PLAINS or GRASSLAND fingers. |
| 24 | `promoteHighLatitudeTundraToSnow` | High-lat TUNDRA where `latFactor + noise > 0.65` → SNOW_FLAT. |

### 8. Elevation

| Step | Method | What it does |
|------|--------|--------------|
| 25 | `promoteFlatToHills` | Ridge noise (main + cross spines) + rolling-hill blobs → HILLS. Polar margin excluded. |
| 26 | `promoteRidgeHillsToMountain` | HILLS on strong ridges (rMain < 0.06) → MOUNTAINS. Sparse foothill mountains where `rMain < 0.18 AND speck > 0.92`. |
| 27 | `removeIsolatedMountains` | Any mountain with no mountain neighbors → demoted to HILLS. |
| 28 | `linkNearbyMountains` | For each mountain pair at hex-distance 3, fills the 2 intermediate tiles with mountain. Bridged cells get IRON resource. |
| 29 | `extendSmallMountainClusters` | Clusters < 4 tiles: random-walk 1–5 steps from one perimeter tile (MERCURY) into surrounding land (URANIUM). |

### 9. Features and resources

| Step | Method | What it does |
|------|--------|--------------|
| 30 | `clearAllResources` | Wipes all resource assignments (removes any temporary IRON/MERCURY/URANIUM from mountain passes). |
| 31 | `addTerrainFeatures` | Sub-polar ICE, equatorial REEF (ocean adjacent to coast, lat < 0.3), RAINFOREST (hot+wet), MARSH, OASIS, WOODS (noise-clustered). Archipelago clusters each get 0–3 bonus REEFs on surrounding ocean. |
| 32 | `sanityLandCleanup` | (a) RAINFOREST adjacent to SNOW/TUNDRA/ICE: if cell is in warm zone, warm the cold neighbor; else remove the rainforest feature. (b) Polar-cap SNOW_FLAT touching continent snow outside polar margin → OCEAN+ICE. |
| 33 | `addMainResources` | BONUS (4% of land) and LUXURY (3%) placed with Poisson-disk spacing: min 4 hex same-type, 2 hex any-type. STRATEGIC resources placed per-type at `players−1` or `players+2` count. |
| 34 | `addExtraFood` | Extra FISH on ocean/coast within 3 hex of land, targeting 9% of land count. No two FISH adjacent. |

### 10. Finalize

| Step | Method | What it does |
|------|--------|--------------|
| 35 | `materializeMap` | Builds `Tile[]`. Assigns `landmass` id per scheme below. Calls `TileYieldService.updateTileYield` per tile. |

---

## Landmass id scheme (`Tile.landmass`)

| Value | Meaning |
|-------|---------|
| `0` | Ocean / coast / lake / un-plated |
| `1, 2, 3, …` | Continents (in seed order; all sub-plates of one continent share an id) |
| `100, 101, …` | Islands |
| `200, 201, …` | Archipelago clusters (sub-islands of one cluster share an id) |
| `300` | Top ice cap (SNOW_FLAT in `y < polarMargin`) |
| `301` | Bottom ice cap (SNOW_FLAT in `y ≥ height − polarMargin`) |

---

## Hex coordinates

Odd-row offset layout (rows 1, 3, 5, … shifted right by half a tile). Storage is column-major: `tiles[x * height + y]`.

Neighbor offsets per row parity:

```
even y:  W(-1,0)  E(1,0)  NW(-1,-1) NE(0,-1)  SW(-1,1) SE(0,1)
odd  y:  W(-1,0)  E(1,0)  NW(0,-1)  NE(1,-1)  SW(0,1)  SE(1,1)
```

The map wraps horizontally; X-distance always uses the shorter wrap. Hex distance for Poisson-disk + mountain linking uses offset → cube conversion (`q = col − floor((row − (row & 1)) / 2)`), then standard cube max-abs.

---

## PRNG and noise

Two random sources, both deterministic for a given `settings.seed`:

- **`rnd()`** — mulberry32 PRNG. Stateful — every call advances state. Used for plate growth, jitter, shuffles, resource placement.
- **`noise(x, y)`** — stateless sin-hash. Pure function of `(x, y, seed)`. Used where spatial clustering matters or PRNG-state-drift would be visible (biome painting, feature placement, elevation ridges).

**Key rule:** anything visible across configurations should use `noise()`, not `rnd()`. Changing `settings.archipelagos` consumes different `rnd()` calls during growth, which would drift biomes if painting used `rnd()`.

---

## Shared helpers

| Helper | Purpose |
|--------|---------|
| `growPlates(ctx, plates, budget, chaos, ownPlateIdsFor, shapeFor?, gap?)` | Core priority-queue plate growth — used for continents and archipelagos |
| `bfsDistance(ctx, isSource, fillWith, maxDist)` | Generic BFS distance map from any set of source cells |
| `markOuterOcean(ctx)` | BFS from map edges; returns boolean array of ocean tiles reachable from outside |
| `buildContinentGroups(ctx)` | Groups continent plate ids by their `parentPlateId` |
| `isBiomePaintable(baseId)` | Returns true if a tile is eligible for biome painting (not ocean/coast/lake/snow) |
| `shuffleInPlace(arr, rnd)` | Fisher-Yates in-place shuffle |
| `insertSortedByPriority(arr, item)` | Binary-search sorted insert for priority queues |
| `inPolarRow(y, ctx)` | Returns true if y is inside the polar margin |
| `claimCellAsOcean(cellIdx, ctx)` | Sets cell to ocean: `isLand=false`, `plateId=-1`, `base=OCEAN`, `resource=NONE` |
| `cellFitsTerrain(cellIdx, suitable, ctx)` | Checks if cell's base+feature matches any entry in the suitable terrain list |
| `placeResourceCandidates(candidates, target, resourceFor, samePlaced, allPlaced, minSame, minAny, ctx)` | Poisson-disk resource placement with same-type and any-type spacing constraints |
| `hexDistance(cells, width, a, b)` | Cube-space hex distance between two cell indices |
| `ridge(noise, x, y, scale, ox, oy)` | Folded noise → ridge value (used for elevation and mountain promotion) |
| `isFlatLand` / `isHillsLand` / `isMountainLand` | Terrain base type predicates |
| `toHills` / `toMountain` / `demoteToHills` | Elevation transitions within same biome family |

---

## Tunable knobs

| Symptom | Knob | Location |
|---------|------|----------|
| Continents too circular | `chaosFactor` in `growContinentPlates` (3 main, 9 fringe) | `growContinentPlates` |
| Fringe irregularity too much/little | `shear` and `chaosScale` multipliers in `fringeShapeFor` | `growContinentPlates` |
| Too many or too few continents | `settings.continents` | settings |
| Continents too close to poles | `latTolerance = Math.round((height-1)/12)` | `seedContinents` |
| Islands too big/small | `pct` range (0.03–0.30) × 1.1 multiplier | `seedIslands` |
| Islands too near/far from continents | `nearCount` ratio (currently 40% near, 60% far) | `seedIslands` |
| Island shapes too round | `reshapeIslands` peninsula removal rate (currently 80%) | `reshapeIslands` |
| Straight polar coastlines | straight-coast threshold (currently > 4 tiles) and move probability (0.35) | `reshapeIslands` |
| Noise speck islands | minimum component size (currently < 4) | `clearNoiseRelatedIslands` |
| Too many tiny lakes | size cap in `detectInlandLakes` (currently ≤ 6) | `detectInlandLakes` |
| Icecaps too much/little snow | tier probabilities in `placeIcecapSnow` (75%/50%/5-10%) | `placeIcecapSnow` |
| Sub-polar ice belt density | `beltProbs` in `placeIcecapIceBelt` (30/20/10/5) | `placeIcecapIceBelt` |
| Polar belt too thick/thin | `polarRowCount` formula in `initContext` (3..5 lerped on height 26..160) | `initContext` |
| Latitude bands too sharp | smoothing noise jitter (currently ±0.075) | `paintLatitudeBiomes` |
| Hills/mountains too dense | ridge thresholds in `promoteFlatToHills` (0.17) and `promoteRidgeHillsToMountain` (0.06/0.18) | respective methods |
| Mountain ranges too short | link distance (currently 3 hex) | `linkNearbyMountains` |
| Too many forests | WOODS slope (`0.234 + moisture × 0.39`) | `addTerrainFeatures` |
| Resource clusters | min-distance gates (4 same-type, 2 any) | `addMainResources` |

---

## Phase notes (edge cases worth knowing)

- **Climate is computed after all landmasses are placed.** Islands, archipelagos, and coast all exist by the time `computeElevation` runs.
- **Polar caps (SNOW_FLAT in polar margin) survive every downstream pass.** Biome paint, hills promotion, etc. all check and skip them.
- **`fillInlandOcean` fills with PLAINS_FLAT** for continents. Inland fills from islands (in `reshapeIslands`) use GRASSLAND_FLAT.
- **`detectInlandLakes` is called from inside `growIslandPlates`**, not from the top-level pipeline. It detects isolated ocean ≤ 6 tiles and marks them LAKE.
- **`clearNoiseRelatedIslands` removes any land component** that has no continent or archipelago tiles and is smaller than 4 tiles, replacing it with OCEAN+ICE.
- **`growContinentPlates` merges the old fringe pass** — two calls to `growPlates` with different shape functions produce the main body (80%) and the fringe (3%).
- **Elevation plate boundaries** skip sub-plates of the same continent group when computing `touchesOtherPlate` (to avoid internal mountains within a continent).
