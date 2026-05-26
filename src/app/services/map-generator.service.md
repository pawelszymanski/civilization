# Map Generator

Single-file procedural map generator that produces an earth-like hex world from a settings object (with a seed). The entry point `MapGeneratorService.generateNewGameMap(settings)` runs a fixed sequence of small phases against a shared `MapGenContext` and returns a populated `Map`.

This doc is the **only** documentation for the generator — the service file itself carries no block comments, only the method bodies. Read this first, then the code.

---

## Vocabulary

| Term | Meaning |
|------|---------|
| **Cell** | One hex tile on the map (`{ x, y, plateId, isLand, elevation, temperature, moisture }`). |
| **Plate** | A logical landmass placed by Voronoi-flood-fill growth. Has `id`, `seedX/Y`, `target` (intended size), `grown` (actual size), and three classification flags (`isContinent`, `isArchipelago`, `parentPlateId`). |
| **Continent** | A large plate. `isContinent = true`. |
| **Island** | A small plate placed near continents. `isContinent = false`, `isArchipelago = false`. `parentPlateId` = nearest continent. |
| **Archipelago** | A small **cluster** of 2–5 tiny sub-island plates in deep ocean. `isArchipelago = true`. All sub-islands of one cluster share `parentPlateId`. |
| **Ice cap** | The top and bottom polar rows. SNOW_FLAT land plus an ICE feature belt on adjacent ocean. Total polar row count scales linearly with `height`: 3 rows on the smallest map (Duel, h=26) up to 5 rows on the largest (Max, h=160). Stored as `polarRowCount` in `MapGenContext`. |
| **Lake** | An inland water body ≤ 6 tiles, with FISH resource. |
| **Biome** | A flat/hills/mountain variant of GRASSLAND / PLAINS / DESERT / TUNDRA / SNOW. |
| **Equator** | The center latitude band (normalized latitude ~0.5). DESERT and PLAINS biomes are concentrated here. |
| **Poles** | The top and bottom polar margin rows (`y < polarMargin` and `y ≥ height − polarMargin`). Covered by SNOW_FLAT and ICE features. |
| **`MapGenContext`** | The shared bag passed to every phase. Holds `cells[]`, `plates[]`, three parallel assignment arrays (`base / feature / resource`), the seeded PRNG `rnd()`, the position noise `noise(x,y)`, and derived knobs. |

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
  worldAge: WorldAgeId;             // initial-paint mountain mult 1.4/1.0/0.5; hills+mountains ±10% (NEW/OLD); forests/jungles ∓10% (NEW/OLD)
  temperature: TemperatureId;       // shifts latitude bands ±0.1; desert weight ×1.1 / ×1.0 / ×0.8 (HOT/STD/COLD)
  rainfall: RainfallId;             // shifts moisture ±0.15; desert weight ×1.1 / ×1.0 / ×0.9 (DRY/STD/WET)
}
```

---

## Pipeline

Every step is a private method called from `generateNewGameMap`. Steps share state via `ctx`; downstream steps depend on upstream output.

| # | Step | Owns |
|---|------|------|
| **Continents** | | |
| 1 | `seedContinents` | continent plate seed positions (with min spacing) |
| 2 | `growContinentPlates` | flood-fills continent plates into `cells[].isLand` and `baseAssignment` (GRASSLAND_FLAT) |
| 3 | `carveContinentBays` | random-walk erodes 4–8 bays per continent (cuts ~15–25% of land away) |
| **Lakes** | | |
| 4 | `detectInlandLakes` | every connected OCEAN component ≤ 6 tiles → LAKE + FISH. Polar zone (rows < `polarRowCount` and mirrors) is excluded — BFS neither starts in nor crosses through it. |
| **Ice caps** | | |
| 5 | `placeIcecapSnow` | tier 1 row 0/h-1 = 75% SNOW + 25% OCEAN-with-ICE; tier 2 row 1/h-2 = 50% per cell (only if `polarRowCount ≥ 2`); tier 3 row 2/h-3 = 5–10% fringe with neighbor check (only if `polarRowCount ≥ 3`). Final step: BFS from row 0/h-1 SNOW_FLAT through SNOW_FLAT neighbors; any SNOW_FLAT not reached (isolated from the polar edge) is converted to OCEAN + ICE feature. |
| 6 | `placeIcecapIceBelt` | ICE feature on ocean tiles in rows 1..`polarRowCount-1` (and mirrors) at 30/20/10/5%, gated by SNOW/ICE neighbor for connectivity |
| **Climate + initial biomes** | | |
| 7 | `computeElevation` | per-land cell elevation from ridge + rolling-hills noise + plate-boundary bonus, with one smoothing pass |
| 8 | `computeTemperature` | latitude − elevation + jitter |
| 9 | `computeMoisture` | latitude curve + westerly rain shadow |
| 10 | `paintInitialBiomes` | flat biome from (temperature × moisture). Skips SNOW_FLAT (icecaps survive). |
| 11 | `applyCoastBand` | pre-step: any LAND tile sitting on the innermost cap row (`polarRowCount - 1` or `height - polarRowCount`) is converted to OCEAN with no feature (no ICE) — creates a clean ocean buffer at the cap/world boundary. Main step: every OCEAN tile adjacent to land → COAST. Polar zone (rows < `polarRowCount` and mirrors) is skipped — no COAST inside the ice cap. Ice cap continent neighbours (SNOW_FLAT within `polarMargin`, i.e. tiles materialized as landmass 300/301) are also skipped — so the icecap doesn't grow a coast band into adjacent open ocean. |
| **Islands** | | |
| 12 | `seedIslands` | two BFSes: distance-to-land (sources = all non-OCEAN) and nearest-continent-id (sources = continent cells only). Seeds picked from ocean tiles 2–6 hex from land. |
| 13 | `growIslandPlates` | grow with chaos 7.0; islands carry their nearest continent's id via `parentPlateId` |
| **Archipelagos** | | |
| 14 | `seedArchipelagos` | exactly `settings.archipelagos` clusters. Centers chosen from ocean tiles ≥ 3 hex from any non-ocean, weighted by `min(distToLand, 20)²` → deep-ocean bias. Each cluster has 2–5 sub-islands within ~4 hexes of center. |
| 15 | `growArchipelagoPlates` | grow with chaos 7.5; plates refuse to grow into cells adjacent to continents (no-touch rule) |
| 16 | `applyCoastBand` (2nd) | coast ring for new island + archipelago land |
| **Land reset** | | |
| 17 | `resetLandToGrassland` | every land tile → GRASSLAND_FLAT; clears every feature except ICE; clears every resource. Keeps SNOW_FLAT polar caps. |
| **Biome painting (latitude probability)** | | |
| 18 | `paintLatitudeBiomes` | per-cell weighted-noise pick across four bell curves: DESERT (center 0, σ 0.12), PLAINS (center 0.13, σ 0.10), GRASSLAND (center 0.28, σ 0.12), TUNDRA (linear ramp `(lat-0.35)/0.65 × 0.64` after 35%). Uses `noise()` not `rnd()` so result is independent of upstream PRNG state. |
| 19 | `smoothBiomes` | 3 iterations of cellular-automata majority vote (self + 6 neighbors). Kills ≤3-tile clusters in one pass; later passes mop up secondaries. |
| 20 | `promoteHighLatitudeTundraToSnow` | every TUNDRA tile rolls `latFactor + smallNoise > 0.65` → SNOW. `latFactor = max(0, (lat-0.55)/0.45)`. ~10% of tundra → snow, biased to extremes. |
| 21 | `intrudeTundraWithFingers` | warm-edge tundra reverts to PLAINS or GRASSLAND. `proxFactor = max(0, (0.65-lat)/0.30)` × intrusion noise > 0.4. Cohesive plains/grassland fingers reaching into the tundra band. |
| 22 | `speckleTundraNearEquator` | sparse single-tile plains/grassland specks inside tundra, period ~3 tiles, hard equator bias (gone past lat 0.60). |
| 23 | `convertGrasslandToPlains` | ~20% of grassland flips to plains where mid-freq noise > 0.80. |
| 24 | `mixPlainsAndGrassland` | ~10% high-freq swap of plains↔grassland for micro-texture. |
| 25 | `lockArchipelagoTemperatureFamily` | per cluster (grouped by `parentPlateId`): if cluster has BOTH desert AND tundra/snow, flip the minority to match — average cluster latitude decides which side wins. |
| 26 | `removeIceNextToTundra` | any ICE feature adjacent to TUNDRA_FLAT is cleared. Avoids redundant "frozen ocean next to land tundra" reading. |
| **Elevation** | | |
| 27 | `promoteFlatToHills` | ridge noise (main + cross spines) + jitter + rolling-hill blobs → HILLS. Same biome family. Polar margin excluded. |
| 28 | `promoteRidgeHillsToMountain` | HILLS along the narrow main ridge (`rMain < 0.06`) → MOUNTAIN. Sparse foothill mountains where `rMain < 0.18 AND speck > 0.92`. |
| 29 | `removeIsolatedMountains` | snapshot-based: any mountain with zero mountain neighbors is demoted back to hills. |
| 30 | `linkNearbyMountains` | for each mountain, scan hex-distance-3 ring; if another mountain found, fill the 2 intermediate cells with mountain (preserving biome family). Skips water, snow caps, polar margin. **Marks bridged cells with IRON.** |
| 31 | `extendSmallMountainClusters` | snapshot-flood-fill mountain clusters; clusters < 4 tiles get ONE random perimeter source (**marked MERCURY**), which random-walks 1–5 tiles into surrounding land (**marked URANIUM**). |
| **Final markers + resources** | | |
| 32 | `markContinentsWithDebugFood` | each non-mountain land tile in a continent/island plate gets `debugFood[plate.parentPlateId % 6]` (wheat/rice/cattle/sheep/bananas/fish). Archipelagos stay blank. |
| 33 | `clearAllResources` | wipes resource layer (kills the iron/mercury/uranium markers AND the debug-food markers). Clean slate. |
| 34 | `addTerrainFeatures` | one feature per cell: sub-polar ICE (only within `polarRowCount` of an edge, with probability `1 - distFromPole/polarRowCount`; row 0/h-1 always), REEF (ocean adjacent to COAST, equatorial band), RAINFOREST (hot+wet plains, noise-clustered, scaled by `forestMult`), MARSH, OASIS, WOODS (noise-clustered, scaled by `forestMult`). After the per-cell pass, each archipelago cluster gets 0–3 extra REEFs (distribution 15/35/35/15%) on its surrounding coastal ocean. |
| 35 | `sanityLandCleanup` | (a) any RAINFOREST adjacent to SNOW/TUNDRA family or ICE feature: if rainforest cell's `latNorm < 0.5` (warm zone), the cold neighbor is warmified (SNOW/TUNDRA → PLAINS, ICE feature cleared); otherwise the rainforest feature itself is stripped. (b) any polar-cap SNOW_FLAT (in `polarMargin`) touching a continent SNOW (any variant outside `polarMargin`) is converted to OCEAN + ICE feature (matching `placeSnowOrIce`'s ice branch). |
| 36 | `addMainResources` | BONUS / STRATEGIC / LUXURY placement with Poisson-disk-style gates: min hex distance 4 between same-type, 2 between any-two. Targets 4% / 3% / 3% of land. |
| 37 | `addExtraFood` | extra FISH on ocean/coast near land, targeting 9% of land tile count, no two FISH adjacent. |
| **Materialize** | | |
| 38 | `materializeMap` | builds `Tile[]`, computes per-cell `landmass` id (see scheme below), computes yield via `TileYieldService`. |

---

## Landmass id scheme (`Tile.landmass`)

| Value | Meaning |
|-------|---------|
| `0` | Ocean / coast / lake / un-plated |
| `1, 2, 3, …` | Continents (in seed order) |
| `100, 101, …` | Islands |
| `200, 201, …` | Archipelago clusters (sub-islands of one cluster share an id) |
| `300` | Top ice cap (SNOW_FLAT in `y < polarMargin`, top half) |
| `301` | Bottom ice cap (SNOW_FLAT in `y ≥ height − polarMargin`, bottom half) |

---

## Hex coordinates

Odd-row offset layout (rows 1, 3, 5, … shifted right by half a tile). Storage is column-major: `tiles[x * height + y]`.

Neighbor offsets per row parity:

```
even y:  W(-1,0)  E(1,0)  NW(-1,-1) NE(0,-1)  SW(-1,1) SE(0,1)
odd  y:  W(-1,0)  E(1,0)  NW(0,-1)  NE(1,-1)  SW(0,1)  SE(1,1)
```

The map wraps horizontally; X-distance always uses the shorter wrap. Hex distance for Poisson-disk + mountain linking is computed via offset → cube conversion (`q = col − floor((row − (row & 1)) / 2)`, then standard cube max-abs).

---

## PRNG and noise

Two random sources, both deterministic for a given `settings.seed`:

- **`rnd()`** — `mulberry32` PRNG. Stateful. Every call advances the state. Used where order-independence isn't needed (plate seed placement, growth jitter, resource shuffling).
- **`noise(x, y)`** — Stateless sin-hash. Pure function of `(x, y, seed)`. Used everywhere clustering matters or PRNG-state-drift would be visible (biome painting, feature placement, elevation ridges).

**Key rule:** anything visible across multiple settings configurations should use `noise()`, not `rnd()`. Otherwise changing `settings.archipelagos` (which consumes a different number of `rnd()` calls during archipelago growth) would drift continent biomes downstream. We learned this the hard way; the biome paint pass in `paintLatitudeBiomes` was migrated from `rnd()` to `noise()` for exactly that reason.

---

## Shared helpers

| Helper | Used by |
|--------|---------|
| `growPlates(ctx, plates, budget, chaos)` | continent / island / archipelago growth (3 callers) |
| `applyCoastBand(ctx)` | after initial biomes; after archipelagos |
| `ridge(noise, x, y, scale, ox, oy)` | elevation, hills/mountains |
| `offsetToCube` / `cubeToOffset` / `cubeRound` | mountain linking, resource distance |
| `hexDistance(cells, width, a, b)` | resource Poisson-disk |
| `isFlatLand` / `isHillsLand` / `isMountainLand` | elevation passes, mountain cleanup |
| `toHills` / `toMountain` / `demoteToHills` | elevation transitions (FLAT → HILLS → MOUNTAIN) |

---

## Tunable knobs (where to start when output looks wrong)

| Symptom | Knob | Location |
|---------|------|----------|
| Continents too circular | `chaosFactor` in `growPlates` (continents=5.5, islands=7.0, archipelagos=7.5) | `growContinentPlates` |
| Too many or too few continents | `settings.continents` | settings |
| Continents too round, no bays | `numBays`, `maxSteps` in `carveContinentBays` | per-continent constants 4–8, 5–12 |
| Too many tiny lakes | size cap in `detectInlandLakes` | currently `≤ 6` |
| Icecaps too / not enough snow | tier probabilities in `placeIcecapSnow` (75/50/5-10) and the 25% snow→ice swap | `placeSnowOrIce` helper |
| Sub-polar ice belt density | row probabilities `beltProbs` (30/20/10/5) in `placeIcecapIceBelt` | |
| Polar belt too thick / too thin overall | `polarRowCount` formula in `createContext` (3..5 lerped on `height`, range 26..160) | |
| Latitude bands too sharp | smoothing noise jitter in `paintLatitudeBiomes` | |
| Hills/mountains too dense | ridge thresholds in `promoteFlatToHills` (0.17) and `promoteRidgeHillsToMountain` (0.06 / 0.18) | |
| Mountains scattered | adjust `removeIsolatedMountains` (currently snaps singletons to hills) | |
| Mountain ranges too short | `linkNearbyMountains` distance (currently 3 hexes) | |
| Too many forests | `WOODS` slope in `addTerrainFeatures` (`0.234 + moisture × 0.39`) | |
| Resource clusters | min-distance gates in `addMainResources` (4 same-type, 2 any) | |

---

## Phase notes (edge cases worth knowing)

- **Climate is computed once after continents only.** Islands and archipelagos exist as ocean at that point, so their cells get default moisture `0.7`. That's why `WOODS` density uses a mild slope — islands would otherwise be wall-to-wall forest.
- **`landReset` wipes biomes back to grassland before `paintLatitudeBiomes` runs.** This is intentional: it lets the latitude paint pass start from a clean canvas regardless of what continents/islands/archipelagos were colored as during growth.
- **Polar caps (SNOW_FLAT in polar margin) survive every downstream pass.** The biome paint pass, hills promotion, etc. all check for SNOW_FLAT and skip.
- **Archipelagos write no debug-food during growth.** `growPlates` checks `plate.isArchipelago` and skips the write. They get no resources from `markContinentsWithDebugFood` either.
- **`materializeMap` writes `landmass` per the scheme above.** Polar SNOW_FLAT in polar margin maps to 300/301; otherwise the plate-id mapping decides.
- **`Tile.terrain.base.uiVariant`** is the field name read by the CSS pipe. Earlier code wrote `variation`, which silently rendered as `m-feature-ice-undefined`. Keep using `uiVariant`.
