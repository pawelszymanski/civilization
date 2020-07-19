import {Component} from '@angular/core';

import {MapSizeConfigurationId} from '../../models/map-size-configuration';
import {
  LandmassValueId,
  MapGeneratorSettings,
  RainfallId,
  TemperatureId,
  WorldAgeId
} from '../../models/map-generator-settings';
import {Camera} from '../../models/camera';

import {MAP_SIZE_CONFIGURATIONS} from '../../consts/map-size-configurations.const';

import {MapGeneratorService} from '../../services/map-generator.service';

import {GameMapStore} from '../../stores/game-map.store';
import {CameraStore} from '../../stores/camera.store';

@Component({
  selector: 'dev-tools',
  templateUrl: './dev-tools.component.html',
  styleUrls: ['./dev-tools.component.sass']
})
export class DevToolsComponent {

  readonly MAP_SIZE_CONFIGURATIONS = MAP_SIZE_CONFIGURATIONS;
  readonly DEFAULT_SIZE_CONFIGURATION = MAP_SIZE_CONFIGURATIONS[MapSizeConfigurationId.SMALL];

  mapConfigurationId = this.DEFAULT_SIZE_CONFIGURATION.id;

  mapGeneratorSettings: MapGeneratorSettings = {
    width: this.DEFAULT_SIZE_CONFIGURATION.width,
    height:  this.DEFAULT_SIZE_CONFIGURATION.height,
    continents: this.DEFAULT_SIZE_CONFIGURATION.continents,
    islands: this.DEFAULT_SIZE_CONFIGURATION.islands,
    landmass: LandmassValueId.STANDARD,
    worldAge: WorldAgeId.STANDARD,
    temperature: TemperatureId.STANDARD,
    rainfall: RainfallId.STANDARD
  }

  camera: Camera;

  constructor(
    private mapGeneratorService: MapGeneratorService,
    private gameMapStore: GameMapStore,
    private cameraStore: CameraStore
  ) {}

  ngOnInit() {
    this.cameraStore.camera.subscribe(camera => this.camera = camera);
  }

  onMapConfigurationIdChange(mapConfigurationId: MapSizeConfigurationId) {
    const mapConfig = MAP_SIZE_CONFIGURATIONS.find(mc => mc.id === Number(mapConfigurationId));
    if (mapConfig) {
      this.mapGeneratorSettings.width = mapConfig.width;
      this.mapGeneratorSettings.height = mapConfig.height;
      this.mapGeneratorSettings.continents = mapConfig.continents;
      this.mapGeneratorSettings.islands = mapConfig.islands;
    }
  }

  onGenerateMapClick() {
    const map = this.mapGeneratorService.generateNewGameMap(this.mapGeneratorSettings);
    this.gameMapStore.setGameMap(map);
  }

  onTileSizeChange(tileSize: number) {
    this.cameraStore.setTileSize(tileSize);
  }

  onPerspectiveChange(perspective: number) {
    this.cameraStore.setPerspective(perspective);
  }

  onRotateXChange(rotateX: number) {
    this.cameraStore.setRotateX(rotateX);
  }

  onScaleChange(scale: number) {
    this.cameraStore.setScale(scale);
  }

  onResetZoomClick() {
    this.cameraStore.reset();
  }

}
