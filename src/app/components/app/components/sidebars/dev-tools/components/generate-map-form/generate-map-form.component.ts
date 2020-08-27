import {Component} from '@angular/core';

import {MapSizeConfigurationId} from '../../../../../../../models/map-generator/map-size-configuration';
import {
  LandmassValueId,
  MapGeneratorSettings,
  RainfallId,
  TemperatureId,
  WorldAgeId
} from '../../../../../../../models/map-generator/map-generator-settings';

import {MAP_SIZE_CONFIGURATIONS} from '../../../../../../../consts/map-generator/map-size-configurations.const';

import {GameMapGeneratorService} from '../../../../../../../services/game-map/game-map-generator.service';

import {GameMapStore} from '../../../../../../../stores/game-map.store';

@Component({
  selector: 'generate-map-form',
  templateUrl: './generate-map-form.component.html',
  styleUrls: ['../dev-tools-form.scss']
})
export class GenerateMapFormComponent {

  readonly MAP_SIZE_CONFIGURATIONS = MAP_SIZE_CONFIGURATIONS;
  readonly DEFAULT_MAP_SIZE_CONFIGURATION = MAP_SIZE_CONFIGURATIONS[MapSizeConfigurationId.DUEL];

  gameMapConfigurationId: MapSizeConfigurationId = this.DEFAULT_MAP_SIZE_CONFIGURATION.id;
  settings: MapGeneratorSettings = {
    width: this.DEFAULT_MAP_SIZE_CONFIGURATION.width,
    height:  this.DEFAULT_MAP_SIZE_CONFIGURATION.height,
    continents: this.DEFAULT_MAP_SIZE_CONFIGURATION.continents,
    islands: this.DEFAULT_MAP_SIZE_CONFIGURATION.islands,
    landmass: LandmassValueId.STANDARD,
    worldAge: WorldAgeId.STANDARD,
    temperature: TemperatureId.STANDARD,
    rainfall: RainfallId.STANDARD
  }

  constructor(
    private gameMapGeneratorService: GameMapGeneratorService,
    private gameMapStore: GameMapStore
  ) {}

  onGameMapConfigurationIdChange(gameMapConfigurationId: MapSizeConfigurationId) {
    const gameMapConfig = MAP_SIZE_CONFIGURATIONS.find(mc => mc.id === Number(gameMapConfigurationId));
    if (gameMapConfig) {
      this.settings.width = gameMapConfig.width;
      this.settings.height = gameMapConfig.height;
      this.settings.continents = gameMapConfig.continents;
      this.settings.islands = gameMapConfig.islands;
    }
  }

  onGenerateGameMapClick() {
    const gameMap = this.gameMapGeneratorService.generateNewGameMap(this.settings);
    this.gameMapStore.next(gameMap);
  }

}
