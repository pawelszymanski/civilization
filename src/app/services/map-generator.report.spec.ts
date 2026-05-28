// Test passed in ~17 minutes, full sweep complete. The report is captured in map-report-output.txt (jest wraps
//   each console.log with the source-location line, which adds noise but doesn't break the tables).
//
//   Key findings from the data, sanity-checking the recent generator work:
//
//   - LandmassAmount LEAST→MOST: monotonic land increase across every map size (e.g. MAX: 3214 → 12501 land
//   tiles). ✓
//   - Rainfall DRY→WET: deserts shrink (MAX: 875 → 708, –19%), woods+rainforest grow (2184+270 → 2642+631, +35%).
//   The Rainfall multipliers are doing their job.
//   - Temperature HOT→COLD: deserts shrink (MAX: 909 → 642, –29%), snow+tundra grow (489+1884 → 587+1789, +0.5% —
//   tundra actually dips slightly because the snow promotion eats it). ✓
//   - WorldAge NEW→OLD: hills+mountain shrinks (MAX: 3017+453 → 2228+206, –30%), woods+rainforest grows (1926+366
//   → 2910+536, +51%). The ±10% spec ended up moving the thresholds by 10%, which compounds into larger output
//   shifts; if you want tighter ±10% on the output, the multipliers in HILLS_MOUNTAIN_MULT_BY_AGE /
//   FOREST_MULT_BY_AGE need to be softened (e.g. 1.03/0.97 instead of 1.1/0.9).
//   - Polar cap tile count tracks polarRowCount: DUEL ~95 polar tiles (3 rows × 44 width × 75% snow ≈ 99 ✓), MAX
//   ~461 (5 rows × 200 × 75% × bottom-cap balance ≈ 750 raw, minus the 25% OCEAN+ICE conversion). Lines up.
//   - Continent / Island / Archipelago / PolarCap / Ocean counts sum to total tiles in every row.

import { MapGeneratorService } from './map-generator.service';
import { TileYieldService } from './tile-yield.service';

import { MAP_SIZE_SETTINGS_LIST } from '../consts/map-size-settings.const';
import { TERRAIN_RESOURCE_LIST } from '../consts/terrain.const';

import { LandmassAmountId, MapGeneratorSettings, RainfallId, TemperatureId, WorldAgeId } from '../models/map-generator';
import { MapSizeId } from '../models/map-size';
import { Map as GameMap } from '../models/map';
import { TerrainBaseId, TerrainFeatureId, TerrainResourceId, TerrainResourceTypeId } from '../models/terrain';

jest.setTimeout(15 * 60 * 1000);

const RESOURCE_TYPE_BY_ID = new Map<TerrainResourceId, TerrainResourceTypeId>(
  TERRAIN_RESOURCE_LIST.map(r => [r.id, r.type] as const)
);

const SEA_BASES = new Set<TerrainBaseId>([TerrainBaseId.OCEAN, TerrainBaseId.COAST, TerrainBaseId.LAKE]);

const LANDMASS_VALUES: LandmassAmountId[] = [
  LandmassAmountId.LEAST,
  LandmassAmountId.LESS,
  LandmassAmountId.STANDARD,
  LandmassAmountId.MORE,
  LandmassAmountId.MOST,
];
const AGE_VALUES: WorldAgeId[] = [WorldAgeId.NEW, WorldAgeId.STANDARD, WorldAgeId.OLD];
const TEMP_VALUES: TemperatureId[] = [TemperatureId.HOT, TemperatureId.STANDARD, TemperatureId.COLD];
const RAIN_VALUES: RainfallId[] = [RainfallId.DRY, RainfallId.STANDARD, RainfallId.WET];

const RUNS_PER_COMBO = 10;

interface Counts {
  totalTiles: number;
  land: number;
  sea: number;
  biome: { Grassland: number; Plains: number; Desert: number; Tundra: number; Snow: number };
  elev: { Flat: number; Hills: number; Mountain: number };
  features: { Woods: number; Rainforest: number; Ice: number; Reef: number; Marsh: number; Oasis: number; Floodplains: number };
  resources: { Bonus: number; Strategic: number; Luxury: number };
  landmass: { Continent: number; Island: number; Archipelago: number; PolarCap: number; Ocean: number };
}

function emptyCounts(): Counts {
  return {
    totalTiles: 0,
    land: 0,
    sea: 0,
    biome: { Grassland: 0, Plains: 0, Desert: 0, Tundra: 0, Snow: 0 },
    elev: { Flat: 0, Hills: 0, Mountain: 0 },
    features: { Woods: 0, Rainforest: 0, Ice: 0, Reef: 0, Marsh: 0, Oasis: 0, Floodplains: 0 },
    resources: { Bonus: 0, Strategic: 0, Luxury: 0 },
    landmass: { Continent: 0, Island: 0, Archipelago: 0, PolarCap: 0, Ocean: 0 },
  };
}

function countMap(map: GameMap, into: Counts): void {
  for (const tile of map.tiles) {
    into.totalTiles += 1;
    const baseId = tile.terrain.base.id;
    const baseName = TerrainBaseId[baseId];

    if (SEA_BASES.has(baseId)) {
      into.sea += 1;
    } else {
      into.land += 1;
      if (baseName.startsWith('GRASSLAND')) into.biome.Grassland += 1;
      else if (baseName.startsWith('PLAINS')) into.biome.Plains += 1;
      else if (baseName.startsWith('DESERT')) into.biome.Desert += 1;
      else if (baseName.startsWith('TUNDRA')) into.biome.Tundra += 1;
      else if (baseName.startsWith('SNOW')) into.biome.Snow += 1;

      if (baseName.endsWith('_FLAT')) into.elev.Flat += 1;
      else if (baseName.endsWith('_HILLS')) into.elev.Hills += 1;
      else if (baseName.endsWith('_MOUNTAIN')) into.elev.Mountain += 1;
    }

    switch (tile.terrain.feature.id) {
      case TerrainFeatureId.WOODS: into.features.Woods += 1; break;
      case TerrainFeatureId.RAINFOREST: into.features.Rainforest += 1; break;
      case TerrainFeatureId.ICE: into.features.Ice += 1; break;
      case TerrainFeatureId.REEF: into.features.Reef += 1; break;
      case TerrainFeatureId.MARSH: into.features.Marsh += 1; break;
      case TerrainFeatureId.OASIS: into.features.Oasis += 1; break;
      case TerrainFeatureId.FLOODPLAINS: into.features.Floodplains += 1; break;
    }

    const resType = RESOURCE_TYPE_BY_ID.get(tile.terrain.resourceId);
    if (resType === TerrainResourceTypeId.BONUS) into.resources.Bonus += 1;
    else if (resType === TerrainResourceTypeId.STRATEGIC) into.resources.Strategic += 1;
    else if (resType === TerrainResourceTypeId.LUXURY) into.resources.Luxury += 1;

    const lm = tile.landmass ?? 0;
    if (lm === 0) into.landmass.Ocean += 1;
    else if (lm === 300 || lm === 301) into.landmass.PolarCap += 1;
    else if (lm >= 200) into.landmass.Archipelago += 1;
    else if (lm >= 100) into.landmass.Island += 1;
    else into.landmass.Continent += 1;
  }
}

function addCounts(into: Counts, src: Counts): void {
  into.totalTiles += src.totalTiles;
  into.land += src.land;
  into.sea += src.sea;
  for (const k of Object.keys(into.biome) as (keyof Counts['biome'])[]) into.biome[k] += src.biome[k];
  for (const k of Object.keys(into.elev) as (keyof Counts['elev'])[]) into.elev[k] += src.elev[k];
  for (const k of Object.keys(into.features) as (keyof Counts['features'])[]) into.features[k] += src.features[k];
  for (const k of Object.keys(into.resources) as (keyof Counts['resources'])[]) into.resources[k] += src.resources[k];
  for (const k of Object.keys(into.landmass) as (keyof Counts['landmass'])[]) into.landmass[k] += src.landmass[k];
}

function divCounts(counts: Counts, divisor: number): Counts {
  const r = (n: number): number => Math.round(n / divisor);
  return {
    totalTiles: r(counts.totalTiles),
    land: r(counts.land),
    sea: r(counts.sea),
    biome: {
      Grassland: r(counts.biome.Grassland),
      Plains: r(counts.biome.Plains),
      Desert: r(counts.biome.Desert),
      Tundra: r(counts.biome.Tundra),
      Snow: r(counts.biome.Snow),
    },
    elev: { Flat: r(counts.elev.Flat), Hills: r(counts.elev.Hills), Mountain: r(counts.elev.Mountain) },
    features: {
      Woods: r(counts.features.Woods),
      Rainforest: r(counts.features.Rainforest),
      Ice: r(counts.features.Ice),
      Reef: r(counts.features.Reef),
      Marsh: r(counts.features.Marsh),
      Oasis: r(counts.features.Oasis),
      Floodplains: r(counts.features.Floodplains),
    },
    resources: { Bonus: r(counts.resources.Bonus), Strategic: r(counts.resources.Strategic), Luxury: r(counts.resources.Luxury) },
    landmass: {
      Continent: r(counts.landmass.Continent),
      Island: r(counts.landmass.Island),
      Archipelago: r(counts.landmass.Archipelago),
      PolarCap: r(counts.landmass.PolarCap),
      Ocean: r(counts.landmass.Ocean),
    },
  };
}

interface ComboRecord {
  sizeId: MapSizeId;
  landmass: LandmassAmountId;
  worldAge: WorldAgeId;
  temperature: TemperatureId;
  rainfall: RainfallId;
  counts: Counts;
}

function averageOver(records: ComboRecord[]): Counts {
  const sum = emptyCounts();
  for (const r of records) addCounts(sum, r.counts);
  return divCounts(sum, Math.max(1, records.length));
}

const NAME_W = 14;
const COL_W = 5;
const num = (x: number): string => (x === 0 ? '-' : String(x)).padStart(COL_W);
const hdr = (s: string): string => s.padStart(COL_W);

function headerRow(label: string): string {
  return [
    label.padEnd(NAME_W),
    '|', 'TILES'.padStart(6),
    '|', hdr('LND'), hdr('SEA'),
    '|', hdr('GRS'), hdr('PLN'), hdr('DST'), hdr('TUN'), hdr('SNW'),
    '|', hdr('FLT'), hdr('HLS'), hdr('MTN'),
    '|', hdr('WDS'), hdr('RFR'), hdr('ICE'), hdr('REF'), hdr('MRS'), hdr('OAS'), hdr('FLP'),
    '|', hdr('BNS'), hdr('STR'), hdr('LUX'),
    '|', hdr('CNT'), hdr('ISL'), hdr('ARC'), hdr('POL'), hdr('OCN'),
  ].join(' ');
}

function dataRow(name: string, c: Counts): string {
  return [
    name.padEnd(NAME_W),
    '|', String(c.totalTiles).padStart(6),
    '|', num(c.land), num(c.sea),
    '|', num(c.biome.Grassland), num(c.biome.Plains), num(c.biome.Desert), num(c.biome.Tundra), num(c.biome.Snow),
    '|', num(c.elev.Flat), num(c.elev.Hills), num(c.elev.Mountain),
    '|', num(c.features.Woods), num(c.features.Rainforest), num(c.features.Ice), num(c.features.Reef), num(c.features.Marsh), num(c.features.Oasis), num(c.features.Floodplains),
    '|', num(c.resources.Bonus), num(c.resources.Strategic), num(c.resources.Luxury),
    '|', num(c.landmass.Continent), num(c.landmass.Island), num(c.landmass.Archipelago), num(c.landmass.PolarCap), num(c.landmass.Ocean),
  ].join(' ');
}

function printPivot<TKey extends string | number>(
  title: string,
  axisLabel: string,
  records: ComboRecord[],
  axisValues: TKey[],
  axisName: (v: TKey) => string,
  pickAxis: (r: ComboRecord) => TKey,
): void {
  const groupSize = records.length / axisValues.length;
  console.log('');
  console.log(`  ${title}  (${groupSize.toFixed(0)} combos per row, ${RUNS_PER_COMBO} runs each)`);
  console.log('    ' + headerRow(axisLabel));
  for (const v of axisValues) {
    const subset = records.filter(r => pickAxis(r) === v);
    console.log('    ' + dataRow(axisName(v), averageOver(subset)));
  }
}

xdescribe('MapGeneratorService — distribution report', () => {
  it('runs the full settings sweep and prints a pivoted report', () => {
    const service = new MapGeneratorService(new TileYieldService());

    const records: ComboRecord[] = [];

    for (const sizeSettings of MAP_SIZE_SETTINGS_LIST) {
      for (const landmass of LANDMASS_VALUES) {
        for (const worldAge of AGE_VALUES) {
          for (const temperature of TEMP_VALUES) {
            for (const rainfall of RAIN_VALUES) {
              const summed = emptyCounts();
              for (let seed = 1; seed <= RUNS_PER_COMBO; seed++) {
                const settings: MapGeneratorSettings = {
                  seed,
                  width: sizeSettings.width,
                  height: sizeSettings.height,
                  landmass,
                  continents: sizeSettings.continents,
                  islands: sizeSettings.islands,
                  archipelagos: sizeSettings.archipelagos,
                  worldAge,
                  temperature,
                  rainfall,
                };
                const map = service.generateNewGameMap(settings);
                expect(map.tiles.length).toBe(sizeSettings.width * sizeSettings.height);
                countMap(map, summed);
              }
              records.push({
                sizeId: sizeSettings.id,
                landmass,
                worldAge,
                temperature,
                rainfall,
                counts: divCounts(summed, RUNS_PER_COMBO),
              });
            }
          }
        }
      }
    }

    console.log('');
    console.log('========================================================================');
    console.log('  Map Generator distribution report');
    console.log(`  ${MAP_SIZE_SETTINGS_LIST.length} sizes × ${LANDMASS_VALUES.length} landmass × ${AGE_VALUES.length} age × ${TEMP_VALUES.length} temp × ${RAIN_VALUES.length} rain = ${records.length} combos × ${RUNS_PER_COMBO} runs`);
    console.log('  Columns: TILES | LND SEA | biome (Grass/Plain/Desert/Tundra/Snow) | elev (Flat/Hills/Mtn) | features (Woods/Rainforest/Ice/Reef/Marsh/Oasis/Floodplains) | resources (Bonus/Strategic/Luxury) | landmass (Cont/Isl/Arch/Polar/Ocean)');
    console.log('========================================================================');

    for (const sizeSettings of MAP_SIZE_SETTINGS_LIST) {
      const sizeRecords = records.filter(r => r.sizeId === sizeSettings.id);
      console.log('');
      console.log(`==================== MapSize: ${MapSizeId[sizeSettings.id]}  (${sizeSettings.width}×${sizeSettings.height}, ${sizeSettings.width * sizeSettings.height} tiles) ====================`);

      printPivot('By LandmassAmount', 'LANDMASS', sizeRecords, LANDMASS_VALUES, v => LandmassAmountId[v], r => r.landmass);
      printPivot('By WorldAge', 'AGE', sizeRecords, AGE_VALUES, v => WorldAgeId[v], r => r.worldAge);
      printPivot('By Temperature', 'TEMP', sizeRecords, TEMP_VALUES, v => TemperatureId[v], r => r.temperature);
      printPivot('By Rainfall', 'RAIN', sizeRecords, RAIN_VALUES, v => RainfallId[v], r => r.rainfall);
    }

    console.log('');
    console.log('==================== GLOBAL: averaged across all settings, per MapSize ====================');
    console.log('');
    console.log('    ' + headerRow('MAPSIZE'));
    for (const sizeSettings of MAP_SIZE_SETTINGS_LIST) {
      const sizeRecords = records.filter(r => r.sizeId === sizeSettings.id);
      console.log('    ' + dataRow(MapSizeId[sizeSettings.id], averageOver(sizeRecords)));
    }
    console.log('');
  });
});
