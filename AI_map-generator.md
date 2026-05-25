# Map Generator — Design Doc

Design for `MapGeneratorService.generateNewGameMap` — an earth-like, latitude-aware,
tectonic-plate-driven hex world generator. Phase-based architecture: the main entry
point is an orchestrator that calls a sequence of private phase methods, each owning
one concern.

---

## 0. Vocabulary

Quick reference for the geography concepts this generator produces. Every number
below reflects what the code actually does today — keep this section in sync when
you change `map-generator.service.ts`.

### Biome

A type of terrain — the "kind of land" a tile is. Independent from elevation: a
biome can come in flat, hills, or mountain variants (the generator currently only
emits the flat variant — hills/mountains are reserved for a future
`addElevation` phase).

- **Families:** `GRASSLAND`, `PLAINS`, `DESERT`, `TUNDRA`, `SNOW` (each backed
  by a `*_FLAT` / `*_HILLS` / `*_MOUNTAIN` terrain id in `TerrainBaseId`).
- **Painted by:** `setLandBase` (the four temperate families) and `generateIcecaps`
  (the SNOW family, polar caps only).
- **Earth analogue mapping:** see Phase 7 (`setLandBase`) for the latitude → biome
  table.

### Continent

A large landmass; a few per map. The dominant geography type. Each continent owns
a flat-id "debug color" that its associated islands inherit.

- **Count:** `settings.continents` (clamped to ≥ 1). Typical: 2–5.
- **Total land budget:** **85%** of `landPct × width × height`, where `landPct ∈
  {0.10, 0.17, 0.25, 0.32, 0.40}` for LEAST..MOST landmass settings.
- **Per-continent size:** drawn from random weights `[0.3, 2.3]` normalized to the
  budget — sizes can differ ~7×. Minimum target: 8 tiles.
- **Placement:** seeds restricted to the temperate band `y ∈ [height × 0.20,
  height × 0.80]`, with minimum spacing `max(4, width / (continentCount + 1))`.
- **Shape:** plate flood-fill with anisotropic distance + two-octave per-plate
  noise + per-tile random jitter. Then `carveBays` runs 4–8 random walks (5–12
  steps each) from interior toward ocean, erasing ~15–25% of the land for bays /
  peninsulas / split-off subcontinents.
- **Default base** (before `generateCoasts` paints biomes): `GRASSLAND_FLAT`.

### Island

A relatively small landmass placed close to a continent. Logically "belongs to"
the nearest continent — inherits its debug color via `parentPlateId`.

- **Count:** `settings.islands ± 2` (uniform random adjustment).
- **Total land budget:** **15%** of total land (the complement of continents).
- **Per-island size:** exponential distribution with mean = `islandLandTotal /
  count`, factor 0.6. Hard-capped at **35% of average continent size**
  (`floor(0.35 × continentLand / continentCount)`) so an island can never read as
  a "small continent". Heavy tail toward 1–2 tile specks.
- **Placement:** seeds restricted to OCEAN tiles **2–6 hexes** from existing
  continental land (BFS distance).
- **`parentPlateId`:** nearest continent's plate id (multi-source BFS from
  continent cells).
- **Default base:** `PLAINS_FLAT`.

### Archipelago

A tiny cluster of 2–5 sub-islands in the deep ocean. "Continent-less" — does not
inherit any continent's color and never touches a continent.

- **Count:** exactly `settings.archipelagos` clusters (clamped ≥ 0). If 0, the
  phase is a no-op.
- **Sub-islands per cluster:** 2–5.
- **Sub-island size:** exponential with factor 1.5, hard cap 15 tiles. At most
  **one** sub-island per cluster may exceed 10 tiles; further oversized rolls
  are clamped to 1–10.
- **Cluster center placement:** OCEAN tiles ≥ **3 hexes** from any non-OCEAN
  cell, weighted by `min(distToLand, 20)²` so picks are biased toward **10+
  hexes** of distance (deep ocean).
- **Sub-island placement:** within ~4 hexes of the cluster center, on pure
  OCEAN tiles only.
- **No-contact rule:** `growPlates` refuses to grow an archipelago tile into any
  cell adjacent to a continent plate. Guarantees at least one ocean/coast hex
  between archipelago and continent.
- **`parentPlateId`:** self (own plate id) — no inheritance.
- **Default base:** `DESERT_FLAT`.
- **Resource:** none (the `debugFoodFor` write is skipped for archipelago plates).

### Ice cap

The very top and bottom of the map — like Earth's polar caps. No COAST is ever
generated against ice-cap snow; the polar belt reads as `SNOW_FLAT` (land) and
`OCEAN + ICE` (water) only.

- **Span:** rows `0..3` and `height-4..height-1` (6 rows total — 3 per pole).
- **Tier 1 (rows 0 / h-1):** every cell calls `placeSnowOrIce` — **75%
  SNOW_FLAT**, **25% OCEAN+ICE** (floating-ice break).
- **Tier 2 (rows 1 / h-2):** 50% per cell calls `placeSnowOrIce`.
- **Tier 3 (rows 2 / h-3, "fringe"):** 5–10% per cell calls `placeSnowOrIce`,
  conditional on at least one `SNOW_FLAT` or `ICE` neighbor.
- **ICE feature belt (separate pass):** every OCEAN cell in rows 1 / 2 / 3 (and
  h-2 / h-3 / h-4) rolls **30% / 20% / 10%** respectively for the `ICE` feature,
  gated by a connectivity check (must have a `SNOW_FLAT` or `ICE` neighbor).
  Rows processed cap-outward so each row can build on the previous.
- **Coast rule:** `applyCoastBand` deliberately excludes `SNOW_FLAT` as a
  coast-trigger neighbor, so the polar belt stays as OCEAN+ICE rather than
  COAST. ICE survives the later OCEAN→COAST conversion (valid on both).
- **Continent override:** if a continent polar-grew into a row 0 or h-1 cell,
  `placeSnowOrIce` will overwrite it (and reset `isLand=false`, `plateId=-1`,
  clear resource) when it picks the OCEAN+ICE path.

### Lake

A small inland body of water. Not connected to the world ocean. Every lake tile
carries `FISH` as a guaranteed bonus food.

- **Definition:** a connected `OCEAN` component of size **≤ 6 tiles** at the
  moment `generateLakes` runs (immediately after continents). Inland water
  larger than 6 tiles stays as `OCEAN` and becomes a "small sea" with a coast
  ring after `applyCoastBand`.
- **Where lakes come from:** bays carved by `carveBays` that didn't reach the
  open ocean. Since `generateLakes` runs before islands/archipelagos, lakes
  formed by tight island clusters are NOT detected.
- **Resource:** every lake tile gets `FISH`.
- **Feature cleanup:** `ICE` is stripped if a polar OCEAN cell happened to be
  part of a small lake-eligible component (ICE isn't valid on `LAKE`).

---

## 1. Research insights

### Civilization VI map generation (selected references)

Civ VI ships a family of map scripts (Continents, Pangaea, Fractal, Archipelago, Island
Plates, Inland Sea, Terra, etc.). They share a layered pipeline that's well-documented in
the Lua scripts under `Base\Assets\Maps\Utility\` in the game install:

1. **Plate / fractal landmass pass** — `MapUtilities.lua` + `FractalWorld.lua`.
   Continents script seeds N "plates" (Voronoi seed points), assigns each tile to its
   nearest plate, then carves coast/ocean using a fractal water-line threshold derived
   from a diamond-square fractal. The fractal's "grain" parameter controls coastline
   roughness; higher water cutoff → more ocean. Polar bands and equatorial cutoffs are
   forced regardless of fractal output.
2. **Elevation pass** — `MountainsCliffs.lua`. Plate boundaries get a probability boost
   for mountains; hills bloom outward from mountain seeds with falloff. World Age
   controls how aggressively mountains erode into hills/flats (NEW = jagged, OLD = worn
   down).
3. **Climate pass** — `Climate.lua` / `TerrainGenerator.lua`. Two scalar fields are
   computed per tile: **temperature** (driven by latitude with elevation penalty and a
   small noise jitter so the equator isn't a flat band) and **rainfall** (driven by
   prevailing wind crossing landmasses — windward sides wet, leeward dry — plus a noise
   field). Biomes are looked up from the (temperature × rainfall) grid:
   - Hot+Dry → Desert
   - Hot+Wet → Plains + Rainforest feature
   - Temperate → Grassland / Plains
   - Cold → Tundra
   - Polar → Snow
4. **Feature pass** — `FeatureGenerator.lua`. Woods clump on temperate land; rainforest
   clumps on hot/wet equatorial land; floodplains follow rivers across deserts; marsh
   sprinkles on grassland; ice ringing polar coasts; reefs on warm ocean.
5. **Resource pass** — `ResourceGenerator.lua`. Strategic resources are placed first to
   fixed quotas, then luxuries (each luxury type gets a few clusters, spread out so no
   two same-type luxuries are adjacent), then bonus resources fill in for tile-yield
   balance. Suitability checks (`ValidateResourcePlacement`) reject mismatched terrain.
6. **Starting position pass** — outside our scope here.

### Procedural 2D map generation primers

- **Voronoi / nearest-seed expansion** produces large, organic-shaped regions cheaply;
  ideal for tectonic plates because plate shapes look natural and the boundaries are
  where geological action happens (mountains, trenches). Pure flood-fill yields
  circular blobs — add per-plate noise valleys and an anisotropic distance metric to
  break that up.
- **Diamond-square fractal** and **Perlin / simplex noise** are the two classic
  height-field generators. For a one-shot game map a simple multi-octave value noise is
  usually enough; the smoothness/frequency knob doubles as the "world age" lever.
- **Latitude → climate** is the cheap path to earth-likeness: any decent generator must
  bias temperature by `|y - equator| / equator` so poles freeze and the equator burns.
- **Rain shadow** = the most impactful single trick for realistic deserts. Pick a
  prevailing wind direction; for each land tile, raise rainfall if upwind tiles are
  ocean (moist wind), lower it if upwind tiles are mountains (rain shadow). The Sahara,
  Atacama, and Gobi all owe their existence to this mechanism.
- **Wrap awareness** — hex grids with horizontal wrap need the wind/distance math to
  wrap too, otherwise the seam shows.
- **Flood fill** is the standard tool for "find contiguous landmass" passes — used here
  to identify the small inland water bodies that should be reclassified as LAKE rather
  than OCEAN.
- **Lloyd relaxation** can post-process Voronoi seeds for more even plate sizes, but
  the asymmetry without it looks more like real Earth — skipping it on purpose.

### Hex grid context for this codebase

Confirmed by reading `tile-ui.service.ts` (in particular the `tilesInRadius` math):

- Storage layout is **column-major**: `tiles[x * height + y]`.
- Hex offset is **odd-row indented**: odd `y` rows are shifted RIGHT by half a tile.
  - Tile (0,0) at top-left, tile (1,0) to its right.
  - Tile (0,1) sits horizontally between (0,0) and (1,0), touching both.
- Canonical neighbour offsets:
  ```
  even y:  W (-1, 0), E (+1, 0), NW (-1, -1), NE (0, -1), SW (-1, +1), SE (0, +1)
  odd  y:  W (-1, 0), E (+1, 0), NW (0, -1),  NE (+1, -1), SW (0, +1),  SE (+1, +1)
  ```
- The map **wraps horizontally** (`(x + width) % width`) but **not vertically** — Y=0
  and Y=height-1 are the poles. The generator must mirror this: ice caps fixed at top
  and bottom rows, distances measured with x-wrap.

---

## 2. Settings interpretation

```
MapGeneratorSettings {
  seed                 // required; mulberry32 seed for reproducibility
  width, height        // grid dimensions
  landmass             // LEAST..MOST → land % of total tiles (~10% .. ~40%)
  continents           // soft target: aim for this many large landmasses (±1 OK)
  islands              // soft target: number of small landmasses (count varies ±2)
  worldAge             // NEW → many sharp mountains, OLD → eroded, mostly hills
  temperature          // HOT shifts climate band toward equator, COLD toward poles
  rainfall             // DRY → more deserts/plains, WET → more grassland/rainforest
}
```

`seed` is a **required field**. Callers that want a random map pick a random seed at
the call site (e.g. `Math.floor(Math.random() * 2147483647)`) before invoking; the
generator itself never calls `Math.random`.

Numeric mappings used in the implementation (all empirically tuned):

| Setting                | Effect                                                       |
|------------------------|--------------------------------------------------------------|
| `landmass` LEAST..MOST | landPct ∈ {0.10, 0.17, 0.25, 0.32, 0.40} — STANDARD ≈ Earth |
| `continents`           | seeds N plate centers; plate sizes vary via random weights   |
| `islands`              | seeds `islands ± 2` island plates; sizes drawn from exp dist |
| `worldAge` NEW/STD/OLD | mountain probability multiplier 1.4 / 1.0 / 0.5              |
| `temperature` HOT/STD/COLD | latitude bands shifted by +0.10 / 0 / −0.10              |
| `rainfall` DRY/STD/WET | global moisture offset −0.15 / 0 / +0.15                     |

---

## 3. Architecture — phase pipeline

The entry point is purely an orchestrator:

```typescript
public generateNewGameMap(settings: MapGeneratorSettings): Map {
  const ctx = this.initContext(settings);

  this.generateContinents(ctx);   // place continents + carveBays
  this.generateLakes(ctx);        // ≤6-tile inland ocean → LAKE + FISH
  this.generateIcecaps(ctx);      // force polar SNOW_FLAT (4 rows + 2 fringe) + ICE belt
  this.generateCoasts(ctx);       // biomes + applyCoastBand (1st pass)
  this.generateIslands(ctx);      // place islands on pure OCEAN only
  this.generateArchipelagos(ctx); // deep-ocean clusters + applyCoastBand (2nd pass)
  this.landReset(ctx);            // clean-slate land view: all land → GRASSLAND_FLAT, strip features/resources (snow caps + ICE preserved)
  this.setLandBase(ctx);          // repaint land by latitude band (grassland/desert/plains/tundra) with smoothing + sparse patches
  this.addTerrainElevation(ctx);  // promote some flat land to HILLS / MOUNTAIN via ridge noise (range-shaped)
  this.markContinents(ctx);       // restore per-continent debug food markers on non-mountain land
  this.clearResources(ctx);       // wipe ALL resource markers — clean slate for the next phase
  this.addTerrainFeatures(ctx);   // sparse woods / rainforest / marsh / oasis / reef / sub-polar ice
  this.addResources(ctx);         // BONUS / STRATEGIC / LUXURY placement, Poisson-disk even spread
  // this.addTerrainFeatures(ctx);
  // this.addResources(ctx);
  // this.normalizeResources(ctx);

  return this.materializeMap(ctx);
}
```

State flows via a single `MapGenContext` object: `cells[]`, `plates[]`, the parallel
`baseAssignment / featureAssignment / resourceAssignment` arrays, derived knobs
(`landPct`, `mountainMult`, `tempOffset`, `rainfallOffset`, …), and the helpers
(`rnd`, `noise`, `idx`, `neighbours`, `inBounds`). No instance state is used —
everything's local to one `generateNewGameMap` call.

### Composability rule

**Every phase must leave the map in a renderable state by writing to the assignment
arrays its concern owns.** Phases can be commented out independently — the result
won't necessarily look earth-like but it will always be visible:

| Skip…                  | Result                                                       |
|------------------------|--------------------------------------------------------------|
| `generateContinents`   | No continents; only islands (if not also skipped) on ocean.  |
| `generateIslands`      | No islands; only continents.                                 |
| `generateCoasts`       | Land cells stay as raw `GRASSLAND_FLAT`; ocean touches land directly. |
| `generateIcecaps`      | No forced polar snow/ice on the top/bottom rows.             |
| `addTerrainFeatures`   | No woods/rainforest/marsh/oasis/reef (sub-polar ice still skipped too). |
| `addResources`         | No resources placed.                                         |
| `normalizeResources`   | Resources placed but not thinned — some may cluster.         |

To make this work, `generateContinents` and `generateIslands` write
`GRASSLAND_FLAT` into `baseAssignment` for every cell they mark as land — that's the
"default visible biome". `generateCoasts` then overwrites those cells with proper
climate-driven biomes when it runs.

### Phase 1 — `generateContinents(ctx)`

Seeds `continentCount` plates in the temperate band `[height*0.20, height*0.80]` with
minimum spacing of `width / (continentCount + 1)`. Plate target sizes are drawn from
per-plate weights ∈ `[0.3, 2.3]` normalized to `continentLand` (= 85% of total land
quota), so one plate can be ~7× larger than another — Eurasia next to Australia rather
than five identical blobs.

Calls `growPlates(ctx, newPlates, continentLand, chaosFactor=5.5)`. Each cell the
helper grows is marked `isLand = true` AND written into `baseAssignment` as
`GRASSLAND_FLAT`, so the continent is renderable on its own.

Then calls `carveBays(ctx, continentPlates)` — random-walk erosion from random interior
points, each walking downhill on a BFS distance-to-ocean field for 5–12 steps and
converting each stepped-on cell to ocean. Carves bays, fjords, inlets; the un-eroded
ridges between walks become peninsulas. Frequently pinches off subcontinents (Africa-
horn / Indian-subcontinent feel). 4–8 walks per continent. Bias is 60% downhill, 40%
random so bays meander instead of running straight. This is what breaks the egg shape
— a Pangaea-split feel without simulating actual plate tectonics. Note: ~15–25% of
land budget is lost to erosion so final land coverage runs slightly below
`landmass`-setting target.

### Phase 2 — `generateLakes(ctx)`

Runs immediately after continents (which is when the only inland water bodies exist
— the small carved-bay enclaves that didn't make it back to the open ocean). Find
every connected `OCEAN` component; convert components **≤ 6 tiles** to `LAKE`.
Larger inland bodies stay as `OCEAN` and will become a "small sea" with a coast
ring after `applyCoastBand` runs. Every cell flipped to `LAKE` also:

- gets the `FISH` resource (guaranteed bonus food at every lake)
- has its `ICE` feature stripped if it happened to be set (ICE isn't valid on LAKE)

Note this phase doesn't catch inland water formed later by islands/archipelagos —
those are rare in practice (islands seed in deep ocean, not around partially-
enclosed bays).

### Phase 3 — `generateIslands(ctx)`

Island count varies as `islandCount ± 2`. Per-island target sizes are drawn from an
exponential distribution (`-log(rnd()) * meanSize`), giving a heavy tail toward 1–2
tile specks. Targets are re-normalized to keep the total within ±10% of
`islandLandTotal` (= 15% of land quota).

Island sizes are additionally **hard-capped at 35% of the average continent size**
(`maxIslandSize = floor(0.35 * continentLand / continentCount)`), so the
exponential distribution's long tail can't produce islands that look like small
continents.

Island seeds are restricted to ocean tiles **within 2–6 hexes of continental land**
via a multi-source BFS. The same BFS also records each ocean cell's nearest
continent plate.id, so each new island plate gets `parentPlateId =
nearestContinentByCell[seedIdx]`. The debug-resource colour is keyed by
`parentPlateId`, so an island visually inherits its parent continent's marker — you
can see at a glance which continent each island belongs to. If no continents exist
yet (running the phase standalone), it falls back to any non-polar ocean tile and
each island is its own parent.

Calls `growPlates(ctx, newPlates, islandLandTotal, chaosFactor=7.0)` — islands use a
higher chaos factor so they look even more irregular than continents. Like continents,
each grown cell is written into `baseAssignment`, but with `PLAINS_FLAT` as the default
(versus `GRASSLAND_FLAT` for continents) so continents and islands are visually
distinguishable in the bare landmass view.

After islands, this phase calls `generateArchipelagos(ctx, nearestContinentByCell)` —
see below.

### Phase 2b — `generateArchipelagos(ctx)` (sub-step of islands)

Spawns **exactly `settings.archipelagos`** clusters of 2–5 tiny islands each. Cluster
centers are picked from a global pool of non-polar ocean tiles **at least 3 hexes from
any land**, weighted by `min(distToLand, 20)²` so picks are strongly biased toward
deep-ocean cells (10+ hexes out). Each sub-island is seeded within ~4 hexes of the
chosen center. If `settings.archipelagos === 0` the phase is a no-op.

**Size policy:** sub-island targets are drawn from `max(1, round(-log(rnd()) * 1.5))`
so most land in the cluster is 1–3 tiles. **At most one sub-island per archipelago
may exceed 10 tiles**; subsequent oversized rolls are clamped to 1–10. The lone
allowed large island is hard-capped at 15.

**Continent-less:** unlike regular islands, archipelago sub-islands set
`parentPlateId = self.id` — they do NOT inherit the parent continent's debug colour.
They also set `isArchipelago = true`, which makes `growPlates` use **`DESERT_FLAT`**
as their default base terrain (versus `GRASSLAND_FLAT` for continents and
`PLAINS_FLAT` for regular islands), AND skip the `debugFoodFor` resource write so
archipelago tiles carry no resource at all. So in the bare-landmass view you can
see at a glance: green w/ resource = continent, yellow plains w/ resource = island
attached to a continent, sandy desert w/ no resource = continent-less archipelago.

**No-contact rule:** `growPlates` refuses to expand an archipelago plate into any
cell adjacent to a continent. So archipelago tiles never touch continent tiles —
there's always at least one ocean/coast hex between them. Enforced via a
precomputed `continentPlateIds` set so the adjacency check is O(neighbours) per
candidate cell.

Skips silently if no continents exist.

### Phase 6 — `landReset(ctx)` (clean-slate view)

Flattens every variation back to a uniform "what does the geography look like?"
view BEFORE `setLandBase` repaints climate biomes. Originally added as a standalone
debug view; now serves as the canvas wipe ahead of Phase 7.

| State                                              | Action               |
|----------------------------------------------------|----------------------|
| Continent / island / archipelago land (any biome)  | → `GRASSLAND_FLAT`   |
| `SNOW_FLAT` polar cap                              | kept as-is           |
| `OCEAN` / `COAST` / `LAKE`                         | kept as-is           |
| `ICE` feature (polar belt)                         | kept                 |
| Any other feature (woods, rainforest, etc.)        | cleared              |
| Resources (continent/island debug markers + lake `FISH`) | cleared            |

Result: every map renders as solid green continents/islands/archipelagos in a sea
of ocean+coast+lake, framed by white polar caps and an icy polar belt. Useful for
visually inspecting just the landmass topology without biome / feature / resource
noise.

### Phase 7 — `setLandBase(ctx)` (probabilistic latitude biomes)

Repaints every land cell (skipping `OCEAN`, `COAST`, `LAKE`, and the `SNOW_FLAT`
polar caps) with one of four flat biomes. Two passes:

**Paint pass** — at each cell, four biome weights are computed from the
effective latitude `effLat = latNorm + jitter` (jitter is small noise, period
~12 tiles, ±0.075). The cell rolls weighted-random across the four weights.

| Biome              | Weight curve                                      | Where it peaks                |
|--------------------|---------------------------------------------------|-------------------------------|
| `DESERT_FLAT`      | Gaussian: center `0.00`, σ `0.12` (+50% width)    | equator, fades by ~30%        |
| `PLAINS_FLAT`      | Gaussian: center `0.13`, σ `0.10`                 | ~13% from equator             |
| `GRASSLAND_FLAT`   | Gaussian: center `0.28`, σ `0.12`                 | ~28% (gradually phases in)    |
| `TUNDRA_FLAT`      | Linear ramp `(lat - 0.35) / 0.65 × 0.64`, ≥ 0     | starts at 35%; 36% trimmed off cumulatively (round 1: ×0.8, round 2: ×0.8 again) |

So the cell at the equator is overwhelmingly desert (DESERT weight = 1, others
small). At 13% latitude desert and plains are roughly equal, with grassland
starting to compete. By 35% latitude grassland dominates and tundra begins
appearing. By 55% latitude tundra is the dominant biome.

Because each cell rolls independently, the paint pass produces noisy speckle
near band boundaries — which is the desired input to the smooth pass:

**Smooth pass** — **3 iterations** of cellular-automata majority vote (self +
6 hex neighbors, snapshot per pass). Math:

- 1-tile patch: 1 self vote vs up to 6 outsider votes → dies in pass 1
- 2-tile pair: 2 vs ≤5 → dies
- 3-tile cluster: 3 vs ≤4 → dies
- 4-tile cluster: 4 vs ≤3 → survives

Ties favor self (initialized as best). Net effect: the dominant biome at each
latitude wins out across cohesive regions; minority biomes survive only where
their independent rolls happened to cluster (≥4 same-biome neighbors). The
transition zones between bands become organic mixed-biome fingers rather than
straight horizontal lines.

**Tundra → SNOW pass** — every `TUNDRA_FLAT` tile rolls
`latFactor + smallNoise > 0.65` where `latFactor = max(0, (latNorm - 0.55) /
0.45)` and `smallNoise ∈ ±0.075`. Threshold raised from 0.45 → 0.65 in round
2 to halve conversion: ends up around 10% of tundra → snow, very strongly
biased to the highest-latitude tiles.

**Plains / Grassland intrusion into TUNDRA** — every `TUNDRA_FLAT` tile gets
a chance to flip BACK to plains or grassland, with the chance falling off
rapidly with latitude:

| latNorm | `proxFactor`                   | Effect                                  |
|---------|---------------------------------|-----------------------------------------|
| 0.35    | 1.0                             | strong intrusion (boundary fuzz)        |
| 0.50    | 0.5                             | moderate                                |
| 0.65    | 0                               | no intrusion (deep tundra stays clean)  |

A medium-freq noise (period ~7 tiles) `intrusionNoise` rolls; intrusion
fires when `intrusionNoise * proxFactor > 0.4`. A separate choice noise
decides plains vs grassland (50/50, spatially coherent). Produces fingered
plains/grassland tongues reaching into the tundra band near its warm edge.

**Sparse equator-biased specks in TUNDRA** — runs right after the intrusion
pass. Same intent (warm-up the tundra near the equator) but uses
high-frequency noise (period ~3 tiles) for individual scattered specks
rather than fingers. Steeper equator falloff:

| latNorm | `equatorBias`                  | Effect                  |
|---------|---------------------------------|-------------------------|
| 0.35    | 1.0                             | speck candidates common |
| 0.50    | 0.4                             | rare                    |
| 0.60    | 0                               | none                    |

Speck fires when `speckNoise × equatorBias > 0.55`. A separate choice noise
picks plains vs grassland. Produces tiny single-tile pockets that survive the
later passes (no CA smoothing after this).

**Grassland → Plains pass** — every `GRASSLAND_FLAT` tile checks a
medium-frequency noise (period ~5 tiles). When `noise > 0.80` (~20% of
tiles), the tile flips to `PLAINS_FLAT`. Shifts the mid-latitude balance
toward plains without affecting other biomes; uses noise (not random) so
converted tiles form small patches rather than scattered singletons.

**Plains ↔ Grassland mix pass** — every `PLAINS_FLAT` and `GRASSLAND_FLAT`
tile checks a high-frequency noise (period ~4 tiles). When `noise > 0.9`
(roughly 10% of tiles), the tile flips to the opposite of the pair. Tiny
mixed-biome pockets break up the two largest bands.

**Archipelago cluster mutual exclusion** — runs LAST. Archipelagos can host
ANY biome; the only restriction is per-cluster: a cluster cannot contain BOTH
`DESERT_FLAT` AND `TUNDRA_FLAT`/`SNOW_FLAT`. Sub-islands of one cluster share
`parentPlateId` (set during `generateArchipelagos` — `clusterId = firstSubIsland.id`),
so we group cells by `parentPlateId` to identify the cluster.

For each cluster:
1. Tally tiles by biome and sum latitude.
2. If desert AND cold (tundra or snow) coexist, the cluster's average latitude
   decides which side survives:
   - `avgLat ≥ 0.5` → keep cold: every `DESERT_FLAT` flips to `TUNDRA_FLAT`
   - `avgLat < 0.5` → keep warm: every `TUNDRA_FLAT`/`SNOW_FLAT` flips to `DESERT_FLAT`

Plains, grassland, snow, tundra all remain valid biomes for archipelagos
under this rule — only the desert ↔ cold conflict is resolved.

**Icecap cleanup (ICE next to TUNDRA → NONE)** — runs as the very last step
of `setLandBase`. The polar ICE belt was placed by `generateIcecaps` early in
the pipeline, before any tundra existed (tundra is painted here in
`setLandBase`). Now that tundra placement is final, walk every cell with the
`ICE` feature and clear it if ANY neighbor is `TUNDRA_FLAT`. The land tundra
already conveys "cold" at that boundary; frozen ocean against it is visually
redundant. Lives at the end of `setLandBase` (not `generateIcecaps`) because
that's the earliest point tundra exists.

### Phase 8 — `addTerrainElevation(ctx)` (hills + mountains via ridge noise)

Promotes some flat land to HILLS / MOUNTAIN, preserving biome family
(`GRASSLAND_FLAT → GRASSLAND_HILLS → GRASSLAND_MOUNTAIN`, same for plains /
desert / tundra / snow). Skips water, coast, and lake tiles.

Uses **ridge noise**: `ridge(x, y, scale) = |noise(...) − 0.5| × 2`, which is
zero along the noise=0.5 contour (a sweeping curve through the map) and grows
outward. Two octaves used:

- **Main spine** — `scale 0.07` (period ~14 tiles, ~1–3 long curving ridges
  across a map)
- **Secondary spine** — `scale 0.14` (period ~7 tiles, denser and shorter)

**Polar cap exclusion:** every pass below skips cells where
`y < polarMargin` or `y >= height - polarMargin` — the polar ice cap region
stays perfectly flat snow, no hills or mountains poking through.

**PASS 1 — FLAT → HILLS:**
```
ridgeScore = min(rMain, rCross) + jitter   // jitter ∈ ±0.09
rolling    = noise(...)                    // low-freq blob noise
if ridgeScore < 0.17 OR rolling > 0.89 → HILLS
```
The `min` of two ridge octaves gives hills along EITHER the main or secondary
spine — produces hill ranges that follow the noise curves. Jitter widens /
breaks the ridge edge so the band looks fringed. The `rolling > 0.89` clause
adds occasional hill patches that aren't tied to any spine. Thresholds tuned
−25% from the first iteration (0.22 → 0.17 and 0.85 → 0.89) for slightly
sparser hills overall.

**PASS 2 — HILLS → MOUNTAIN:**
```
if rMain < 0.06              → MOUNTAIN                    (narrow core)
if rMain < 0.18 AND speck > 0.92 → MOUNTAIN                (sparse foothills)
```
Mountains only along the MAIN spine's narrow core (so mountain ranges follow
just the longest/cleanest ridges), plus sparse individual mountain specks
scattered through the foothill band (period ~3 tiles). Speck threshold raised
from 0.85 → 0.92 to cut the singleton mountain count; Pass 3 below kills any
that still slip through.

**PASS 3 — cluster cleanup:** snapshot `baseAssignment`, then for every
mountain tile count its mountain neighbors (snapshot-based). Any mountain with
**zero** mountain neighbors is demoted back to hills (same biome family).
Forces mountains to appear only as connected groups of ≥2 cells — scattered
single mountains are eliminated, ranges read as cohesive clusters.

**PASS 4 — range linking:** for every mountain `M`, scan its hex-distance-3
ring (18 cells in a 7×7 bbox, filtered by exact cube-distance). If another
mountain `N` is found, fill the 2 intermediate hexes of the shortest path
between them with mountains (preserving biome family — `FLAT → HILLS →
MOUNTAIN`). Uses offset-↔-cube coord conversion + cube line-draw at
`t = 1/3, 2/3`. Water tiles (ocean/coast/lake), snow caps on the path, AND
polar-margin rows are SKIPPED. Effect: small 2–4-tile clusters that PASS 3
leaves behind get joined into longer connected ranges. **Each tile created by
this pass is stamped with `IRON` resource as a visual debug marker.**

**PASS 5 — single-source cluster extension:** snapshot `baseAssignment` at the
start (so we only group EXISTING mountains, not newly added ones), then
flood-fill clusters from the snapshot. For each cluster with **fewer than 4
tiles**:
1. Filter the cluster to its "perimeter" — members that have at least one
   extendable land neighbor (FLAT or HILLS, non-polar).
2. Pick **ONE** random perimeter cell as the SOURCE; stamp it with `MERCURY`.
3. Random-walk extend from that single source by 1–5 steps. Each step picks
   a random non-mountain land neighbor of the current tile (skipping water,
   polar margin), converts it to mountain (biome family preserved), stamps
   it with `URANIUM`, and steps onto it. Stops early on dead ends.

So a 1-3 tile cluster grows into a tendril of up to 6-8 tiles total: the
MERCURY-marked source plus a meandering chain of URANIUM extensions. Only
ONE source per cluster is extended (not one per tile, as the previous
implementation did), so cluster extensions are far more conservative.

Passes 1–4 use `noise()` only; Pass 5 uses `rnd()` for its random
extensions.

### Phase 9 — `markContinents(ctx)` (restore continent debug-food markers)

`landReset` wipes every resource, including the debug-food markers that
`growPlates` originally stamped onto continent/island tiles. This phase
restores them, but only on non-mountain land — mountains keep the IRON /
MERCURY / URANIUM markers placed by `addTerrainElevation`.

For each cell:
- Skip if `plateId < 0` (water, lake, polar ocean reset by icecaps)
- Skip if the plate is `isArchipelago` (archipelagos remain resource-less)
- Skip if the base is any `*_MOUNTAIN` variant (preserve elevation markers)
- Otherwise stamp `debugFoodByPlateIndex[parentPlateId % 6]` —
  `WHEAT / RICE / CATTLE / SHEEP / BANANAS / FISH`

So at the very end every continent and its associated islands show their
shared per-continent food marker, mountain tiles show `IRON` (Pass 4
bridges), `MERCURY` (Pass 5 sources), or `URANIUM` (Pass 5 extensions), and
archipelagos plus polar caps remain blank.

### Phase 10 — `clearResources(ctx)` (wipe resource markers)

One-liner: `ctx.resourceAssignment.fill(TerrainResourceId.NONE)`. Wipes ALL
resources from every cell — the debug-food markers from `markContinents` and
the IRON / MERCURY / URANIUM markers from `addTerrainElevation`. Leaves
`baseAssignment` (terrain) and `featureAssignment` (ICE etc.) untouched.

Lives as a separate phase so the upstream marker phases can stay for
debugging — toggle this phase off and the markers reappear, or comment out
`markContinents` upstream to skip just that set. Sets the resource layer to
a clean slate ready for a real resource-placement phase.

### Phase 3 (shared) — `growPlates(ctx, plates, landBudget, chaosFactor)`

Priority flood-fill with three anti-oval tricks layered on top of each other:

1. **Anisotropic distance** — each plate picks a random stretch axis (`plateAngle ∈
   [0, 2π)`). The priority distance is `sqrt(xp² × 0.4 + yp² × 1.6)` in the rotated
   frame, so tiles along the preferred axis are cheaper to grow into → elongated
   continents.
2. **Two-octave per-plate noise** — `plateChaos(x, y, plateId)` returns
   `lowFreq + highFreq * 0.6`. The low octave (frequency 0.17, period ~6 tiles) carves
   big lobes; the high octave (frequency 0.55, period ~2 tiles) breaks up smooth edges
   so coasts look jagged rather than oval. Each plate gets its own pattern via the
   plateId offset.
3. **Per-tile random jitter** — `(rnd() - 0.5) * 2.0` is added to each newly enqueued
   tile's priority, so identical-noise neighbours don't expand in lockstep — keeps the
   coastline frayed at the smallest scale.

X-wrap handled in the distance math via `wrapDx`. A 15% chance lets land grow into the
top/bottom `polarMargin` rows (8% of height) — most polar land still gets blocked.

**Debug resource marker:** each grown cell is also written into `resourceAssignment`
with a food bonus resource cycled by `plateId % 6` (`WHEAT, RICE, CATTLE, SHEEP,
BANANAS, FISH`). This is purely for visual identification of which landmass is
which — `addResources` wipes the assignment array before placing real resources, so
the debug markers never reach the final map.

### Phase 4 — `generateCoasts(ctx)`

This phase owns everything that depends on the final land/water shape: elevation,
climate, base terrain, lakes, and the coast band.

- **Elevation** — `0.35 + rnd()*0.2` base, plus ridge-noise `|noise(...) - 0.5| * 2 ×
  0.35` (gives sharp mountain spines) and a lower-frequency `(noise - 0.5) * 0.3`
  rolling-hills component. Plate-boundary tiles get a `+0.35 + rnd()*0.35` bonus;
  coast-adjacent tiles a `-0.2` penalty. One hex-average smoothing pass to kill speckle.
- **Temperature** — `1 - latNorm + tempOffset + jitter - elevation_penalty`, clamped
  to `[0, 1]`.
- **Moisture** — hand-tuned latitude curve (wet at equator/temperate, dry at ~30° and
  poles), plus westerly rain shadow (walk up to 4 tiles upwind; ocean adds moisture,
  mountain blocks and subtracts), plus `rainfallOffset` and jitter.
- **Base terrain** — only three families produced at this stage: `GRASSLAND_FLAT`,
  `PLAINS_FLAT`, `DESERT_FLAT` (all flat — no hills/mountains, no snow/tundra). Hot+dry
  → desert; dry → plains; otherwise grassland. `cell.elevation` is still computed
  per-cell so a future `addElevation` phase can promote some flats to hills/mountains;
  polar snow is owned by `generateIcecaps`.
- **Coast band only** (lake detection lives in its own phase now — see Phase 2).
  Every OCEAN tile adjacent to non-snow land becomes COAST. Snow caps
  (`SNOW_FLAT`) deliberately do NOT trigger coast conversion, so the polar belt
  stays as OCEAN+ICE rather than COAST. Continents/islands/archipelagos still get
  the normal coast ring. Called twice via `applyCoastBand`: once at the end of
  `generateCoasts`, and again at the end of `generateArchipelagos` so the new
  geography also gets its ring.
- **Coast band** — every `OCEAN` tile adjacent to non-water (land or lake) is
  reclassified to `COAST`. Result: `OCEAN` never touches land directly.

### Phase 2 — `generateIcecaps(ctx)` (runs after continents, before coasts)

Three-tier polar cap with a gradually softening edge. At each "place a cap tile"
decision a shared helper `placeSnowOrIce` is used: 75% of the time the cell becomes
`SNOW_FLAT` (land), 25% of the time it becomes `OCEAN` with the `ICE` feature
(floating-ice break). So the cap reads as fragmented ice + snow rather than a
solid white wall. If the cell was a continent that polar-grew into the cap, it's
also reset (`isLand=false`, `plateId=-1`, resource cleared) when it flips to
ocean.

| Rows                  | Trigger to call `placeSnowOrIce`                    |
|-----------------------|-----------------------------------------------------|
| `0` and `height-1`    | every cell (formerly unconditional `SNOW_FLAT`)     |
| `1` and `height-2`    | 50% per cell                                        |
| `2` and `height-3`    | 5–10% per cell, only if a neighbor is `SNOW_FLAT` or has `ICE` |

The 50% row gives the cap a frayed inner edge; the 5–10% fringe scatters a few
outlier tiles even further inland. The fringe connectivity check accepts either
`SNOW_FLAT` neighbors OR `ICE` neighbors so the 25% breaks from the rows above
can still seed fringe extensions. `fringeProb` is rolled once per generation so
each map has a consistent fringe density.

**ICE feature belt:** after the snow pass, OCEAN cells in rows 1, 2, 3 (and
mirrored at height-2, height-3, height-4) get a probabilistic `ICE` feature gated
by a connectivity check — each candidate must have at least one neighbor that is
already `SNOW_FLAT` or has the `ICE` feature. Rows are processed from the cap
outward so later rows can build on the ice placed in earlier ones, producing
fragmented sheets extending from the snow rather than scattered isolated tiles.

| Rows               | ICE chance on connected OCEAN cells |
|--------------------|--------------------------------------|
| `1` and `height-2` | 30%                                  |
| `2` and `height-3` | 20%                                  |
| `3` and `height-4` | 10%                                  |

ICE survives the later OCEAN→COAST conversion (valid on both). `growPlates`
clears `featureAssignment` when it overwrites an ocean cell so a later island
can't inherit leftover polar ice. `landReset` explicitly preserves the `ICE`
feature when it strips everything else.

### Phase 11 — `addTerrainFeatures(ctx)`

Single per-cell pass, at most one feature per cell, first-match-wins. Skips any
cell that already has a feature (so the icecap `ICE` belt placed back in Phase 2
isn't overwritten). Probabilities tuned for Earth-like sparsity — WOODS is the
only common one; the rest are rare and only fire in their proper climate windows.

| Feature       | Where (gates)                                                  | Decision                                                    |
|---------------|----------------------------------------------------------------|-------------------------------------------------------------|
| `ICE`         | coast/ocean, latNorm > 0.92 OR (> 0.85 with linear fade)       | always at > 0.92, `rnd`-fade between                        |
| `REEF`        | OCEAN, latNorm < 0.3                                           | `rnd < 0.015`                                               |
| `RAINFOREST`  | plains tiles (flat/hills), `temp ≥ 0.7`, `moist ≥ 0.55`        | **`noise(x×0.15, y×0.15) < 0.715`** — clustered, +30%       |
| `MARSH`       | grassland flat, `moist > 0.7`                                  | `rnd < 0.10`                                                |
| `OASIS`       | desert flat                                                    | `rnd < 0.03`                                                |
| `WOODS`       | grassland/plains/tundra flat or hills                          | **`noise(x×0.12, y×0.12) < 0.234 + moist × 0.39`** — clustered, +30% |

**RAINFOREST and WOODS use `noise()` instead of `rnd()`** for their pick — neighboring
cells share roughly the same noise value, so the feature forms clusters (forests
and jungle bands) instead of speckle. Period ~6–8 tiles. Thresholds bumped +30%
from the previous round, so woods coverage runs ~24–62% of qualifying tiles
(was 18–48%) and rainforest runs ~71% of qualifying tiles (was 55%).

`FLOODPLAINS` is skipped (no river model). Note: islands carry the default
moisture 0.7 (they were ocean when `generateCoasts` computed climate).

### Phase 12 — `addResources(ctx)`

Places BONUS (food), STRATEGIC (industry), and LUXURY resources across the map
with Poisson-disk-style even spread. Uses every entry in `TERRAIN_RESOURCE_LIST`
grouped by `TerrainResourceTypeId`.

**Targets** (per type, fraction of land tiles):

| Type       | Target            |
|------------|-------------------|
| BONUS      | 4%                |
| STRATEGIC  | 3%                |
| LUXURY     | 3%                |

Total ~10% of land carries a resource.

**Distance gates** (Poisson-disk pattern, prevents clustering):

| Constraint                          | Min hex distance |
|-------------------------------------|------------------|
| Two resources of the SAME type      | 4                |
| Any two resources (across all types)| 2                |

**Algorithm:** for each type in turn — gather candidates (cells within 3 hexes of
land where at least one resource of this type matches the tile's
`suitableTerrain`), Fisher-Yates shuffle, walk in order and accept those that
pass both distance gates against already-placed resources. Each accepted tile is
assigned a random resource from this type's list that fits its specific terrain
(so e.g. a tile fitting both WHEAT and RICE gets one or the other 50/50).

`distToLand ≤ 3` ensures sea resources (FISH, WHALES, PEARLS, …) only appear
near coastlines, never in deep ocean. Hex distance is computed with x-wrap
awareness via offset → cube conversion.

**Extra food pass** — after the main even-spread pass, an additional ~4% of
land gets BONUS resources (so total food coverage doubles to ~8%). Unlike
the main pass, this one is purely random — Fisher-Yates shuffle of all
remaining BONUS-eligible candidates and walk in order. The only constraint
is the **same-type adjacency check**: a new BONUS cell can't have any
immediate neighbor that's already BONUS (whether placed in this pass or the
main one). Other types unaffected — STRATEGIC and LUXURY keep their main
counts.

### Phase 8 — `normalizeResources(ctx)`

Poisson-disk-style thinning. For each placed resource, scan a `minSep`-radius square
neighbourhood (x-wrap aware); if a same-type resource exists at a *lower* cell index,
drop the current one. Earliest-wins keeps the result deterministic.

Per-type `minSep`:
- Bonus: 3
- Strategic: 4
- Luxury: 6

### Phase 9 — `materializeMap(ctx)`

Walks every cell and emits a `Tile` with the assigned base/feature/resource, a random
`base.variation ∈ [1, variantCount]`, then calls `tileYieldService.updateTileYield`
so yields populate. Returns `{ tiles, width, height }`.

---

## 4. Performance notes

- `width * height` is typically ≤ 128 * 80 = 10 240 tiles. All passes are O(N) or O(N
  log N). Total well under 50 ms.
- The priority queue is a sorted array (binary-insert) — fine for these sizes; no need
  for a real heap.
- `cells[]` is allocated once and reused across phases; the same goes for the three
  assignment arrays.

---

## 5. Out of scope (deliberately)

- Rivers (model has no river concept)
- True Lloyd-relaxed plates
- Per-civilization start positions
- Map-script variants (Pangaea, Archipelago etc.) — current scope is "one generator
  that produces an earth-like map and respects every setting"
