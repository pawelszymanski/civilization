import {Component} from '@angular/core';

import {MapSizeConfigurationId} from '../../models/map-size-configuration';
import {
  LandmassValueId,
  BoardGeneratorSettings,
  RainfallId,
  TemperatureId,
  WorldAgeId
} from '../../models/board-generator-settings';
import {Camera} from '../../models/camera';

import {MAP_SIZE_CONFIGURATIONS} from '../../consts/map-size-configurations.const';

import {BoardGeneratorService} from '../../services/board-generator.service';

import {BoardStore} from '../../stores/board.store';
import {CameraStore} from '../../stores/camera.store';

@Component({
  selector: 'dev-tools',
  templateUrl: './dev-tools.component.html',
  styleUrls: ['./dev-tools.component.sass']
})
export class DevToolsComponent {

  readonly MAP_SIZE_CONFIGURATIONS = MAP_SIZE_CONFIGURATIONS;
  readonly DEFAULT_SIZE_CONFIGURATION = MAP_SIZE_CONFIGURATIONS[MapSizeConfigurationId.DUEL];

  mapConfigurationId = this.DEFAULT_SIZE_CONFIGURATION.id;

  boardGeneratorSettings: BoardGeneratorSettings = {
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
    private boardGeneratorService: BoardGeneratorService,
    private boardStore: BoardStore,
    private cameraStore: CameraStore
  ) {}

  ngOnInit() {
    this.cameraStore.camera.subscribe(camera => this.camera = camera);
  }

  onMapConfigurationIdChange(mapConfigurationId: MapSizeConfigurationId) {
    const mapConfig = MAP_SIZE_CONFIGURATIONS.find(mc => mc.id === Number(mapConfigurationId));
    if (mapConfig) {
      this.boardGeneratorSettings.width = mapConfig.width;
      this.boardGeneratorSettings.height = mapConfig.height;
      this.boardGeneratorSettings.continents = mapConfig.continents;
      this.boardGeneratorSettings.islands = mapConfig.islands;
    }
  }

  onGenerateMapClick() {
    const map = this.boardGeneratorService.generateNewBoard(this.boardGeneratorSettings);
    this.boardStore.setBoard(map);
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
