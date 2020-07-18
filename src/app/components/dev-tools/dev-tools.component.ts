import {Component} from '@angular/core';

import {MapSizeConfiguration, MapSizeConfigurationId} from '../../models/map-size-configuration';
import {MapGeneratorSettings} from '../../models/map-generator-settings';
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

  readonly mapConfigurations: MapSizeConfiguration[] = MAP_SIZE_CONFIGURATIONS;

  mapGeneratorSettings: MapGeneratorSettings = {
    width: MAP_SIZE_CONFIGURATIONS[0].width,
    height:  MAP_SIZE_CONFIGURATIONS[0].height
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
    const mapConfig = this.mapConfigurations.find(mc => mc.id === Number(mapConfigurationId));
    if (mapConfig) {
      this.mapGeneratorSettings.width = mapConfig.width;
      this.mapGeneratorSettings.height = mapConfig.height;
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
