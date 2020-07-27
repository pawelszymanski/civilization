import {Component} from '@angular/core';

import {GameMapSizeConfigurationId} from '../../../models/game-map-size-configuration';
import {
  LandmassValueId,
  GameMapGeneratorSettings,
  RainfallId,
  TemperatureId,
  WorldAgeId
} from '../../../models/game-map-generator-settings';

import {GAME_MAP_SIZE_CONFIGURATIONS} from '../../../consts/game-map-size-configurations.const';

import {GameMapGeneratorService} from '../../../services/game-map-generator.service';

import {GameMapStore} from '../../../stores/game-map.store';

@Component({
  selector: 'generate-map-form',
  templateUrl: './generate-map-form.component.html'
})
export class GenerateMapFormComponent {

  readonly GAME_MAP_SIZE_CONFIGURATIONS = GAME_MAP_SIZE_CONFIGURATIONS;
  readonly DEFAULT_SIZE_CONFIGURATION = GAME_MAP_SIZE_CONFIGURATIONS[GameMapSizeConfigurationId.DUEL];

  gameMapConfigurationId: GameMapSizeConfigurationId = this.DEFAULT_SIZE_CONFIGURATION.id;
  settings: GameMapGeneratorSettings = {
    width: this.DEFAULT_SIZE_CONFIGURATION.width,
    height:  this.DEFAULT_SIZE_CONFIGURATION.height,
    continents: this.DEFAULT_SIZE_CONFIGURATION.continents,
    islands: this.DEFAULT_SIZE_CONFIGURATION.islands,
    landmass: LandmassValueId.STANDARD,
    worldAge: WorldAgeId.STANDARD,
    temperature: TemperatureId.STANDARD,
    rainfall: RainfallId.STANDARD
  }

  constructor(
    private gameMapGeneratorService: GameMapGeneratorService,
    private gameMapStore: GameMapStore
  ) {}

  onGameMapConfigurationIdChange(gameMapConfigurationId: GameMapSizeConfigurationId) {
    const gameMapConfig = GAME_MAP_SIZE_CONFIGURATIONS.find(mc => mc.id === Number(gameMapConfigurationId));
    if (gameMapConfig) {
      this.settings.width = gameMapConfig.width;
      this.settings.height = gameMapConfig.height;
      this.settings.continents = gameMapConfig.continents;
      this.settings.islands = gameMapConfig.islands;
    }
  }

  onRandomizeTilesClick() {

  }

  onGenerateGameMapClick() {
    const gameMap = this.gameMapGeneratorService.generateNewGameMap(this.settings);
    this.gameMapStore.next(gameMap);
  }

}
