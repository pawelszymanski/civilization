import { Component } from '@angular/core';

import { MapSizeId } from '../../../../../models/map-size';
import { LandmassAmountId, MapGeneratorSettings, RainfallId, TemperatureId, WorldAgeId } from '../../../../../models/map-generator';

import { MAP_SIZE_SETTINGS_LIST } from '../../../../../consts/map-size-settings.const';
import { MAP_SEED_RANGE } from '../../../../../consts/map-size-range.const';

import { MapGeneratorService } from '../../../../../services/map-generator.service';

import { MapStore } from '../../../../../stores/map.store';

@Component({
  standalone: false,
  selector: '.generate-map-form-component',
  templateUrl: './generate-map-form.component.html',
  styleUrls: ['../dev-tools-form.scss'],
})
export class GenerateMapFormComponent {
  readonly MAP_SEED_RANGE = MAP_SEED_RANGE;
  readonly MAP_SIZE_SETTINGS_LIST = MAP_SIZE_SETTINGS_LIST;
  readonly DEFAULT_MAP_SIZE_SETTINGS = MAP_SIZE_SETTINGS_LIST[MapSizeId.HUGE];

  mapSizeId: MapSizeId = this.DEFAULT_MAP_SIZE_SETTINGS.id;
  mapGeneratorSettings: MapGeneratorSettings = {
    seed: 1234567, // TODO
    width: this.DEFAULT_MAP_SIZE_SETTINGS.width,
    height: this.DEFAULT_MAP_SIZE_SETTINGS.height,
    landmass: LandmassAmountId.STANDARD,
    continents: this.DEFAULT_MAP_SIZE_SETTINGS.continents,
    islands: this.DEFAULT_MAP_SIZE_SETTINGS.islands,
    archipelagos: this.DEFAULT_MAP_SIZE_SETTINGS.archipelagos,
    worldAge: WorldAgeId.STANDARD,
    temperature: TemperatureId.STANDARD,
    rainfall: RainfallId.STANDARD,
  };

  constructor(
    private mapGeneratorService: MapGeneratorService,
    private mapStore: MapStore
  ) {}

  onMapSizeIdChange(mapSizeId: MapSizeId): void {
    const mapSizeSettings = MAP_SIZE_SETTINGS_LIST.find(mss => mss.id === Number(mapSizeId));
    if (mapSizeSettings) {
      this.mapGeneratorSettings.width = mapSizeSettings.width;
      this.mapGeneratorSettings.height = mapSizeSettings.height;
      this.mapGeneratorSettings.continents = mapSizeSettings.continents;
      this.mapGeneratorSettings.islands = mapSizeSettings.islands;
    }
  }

  onGenerateGameMapClick(): void {
    const map = this.mapGeneratorService.generateNewGameMap(this.mapGeneratorSettings);
    this.mapStore.next(map);
  }
}
