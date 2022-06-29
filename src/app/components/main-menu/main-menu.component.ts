import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Subscription} from 'rxjs';

import {Map} from '../../models/map';
import {SaveHeader} from '../../models/saves';
import {MapSizeId} from '../../models/map-size';
import {ModalId, ScreenId, Ui} from '../../models/ui';
import {LandmassValueId, MapGeneratorSettings, RainfallId, TemperatureId, WorldAgeId} from '../../models/map-generator';

import {MAP_SIZE_SETTINGS_LIST} from '../../consts/map-size-settings.const';
import {EARTH_MAP} from '../../consts/earth-map';

import {MapGeneratorService} from '../../services/map-generator.service';
import {SaveService} from '../../services/save.service';
import {ZipService} from '../../services/zip.service';

import {UiStore} from '../../stores/ui.store';
import {MapStore} from '../../stores/map.store';
import {SaveHeadersStore} from '../../stores/save-headers.store';

@Component({
  selector: '.main-menu-component',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainMenuComponent implements OnInit, OnDestroy {

  ui: Ui;
  saveHeaders: SaveHeader[];

  showSinglePlayerMenu = false;

  subscriptions: Subscription[] = [];

  constructor(
    private mapGeneratorService: MapGeneratorService,
    private saveService: SaveService,
    private zipService: ZipService,
    private uiStore: UiStore,
    private mapStore: MapStore,
    private saveHeadersStore: SaveHeadersStore
  ) {}

  ngOnInit(): void {
    this.subscribeToData();
  }

  ngOnDestroy(): void {
    this.unsubscribeFromData();
  }

  subscribeToData(): void {
    this.subscriptions.push(
      this.uiStore.ui.subscribe(ui => this.ui = ui),
      this.saveHeadersStore.saveHeaders.subscribe(saveHeaders => this.saveHeaders = saveHeaders)
    );
  }

  unsubscribeFromData(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  get noSavesPresent(): boolean {
    return this.saveHeaders.length === 0;
  }

  onSinglePlayerClick(): void {
    this.showSinglePlayerMenu = true;
  }

  onOptionsClick(): void {
    // TODO
    this.showSinglePlayerMenu = false;
  }

  onExitToGoogleClick(): void {
    this.uiStore.openModal(ModalId.EXIT_GAME_CONFIRMATION);
  }

  onResumeGameClick(): void {
    if (this.noSavesPresent) { return; }
    const latestTimestamp = this.saveHeaders.map(save => save.timestamp).sort().pop();
    const saveToBeLoaded = this.saveHeaders.find(save => save.timestamp === latestTimestamp);
    this.saveService.load(saveToBeLoaded.uuid);
    this.uiStore.setScreen(ScreenId.GAMEPLAY);
  }

  onLoadGameClick(): void {
    if (this.noSavesPresent) { return; }
    this.uiStore.openModal(ModalId.LOAD_GAME);
  }

  onPlayNowClick(): void {
    const defaultMapSizeSettings = MAP_SIZE_SETTINGS_LIST.find(mss => mss.id === MapSizeId.STANDARD);
    const mapGeneratorSetting: MapGeneratorSettings = {
      width: defaultMapSizeSettings.width,
      height: defaultMapSizeSettings.height,
      landmass: LandmassValueId.STANDARD,
      continents: defaultMapSizeSettings.continents,
      islands: defaultMapSizeSettings.islands,
      worldAge: WorldAgeId.STANDARD,
      temperature: TemperatureId.STANDARD,
      rainfall: RainfallId.STANDARD
    };
    const newMap = this.mapGeneratorService.generateNewGameMap(mapGeneratorSetting);
    this.mapStore.next(newMap);
    this.uiStore.setScreen(ScreenId.GAMEPLAY);
  }

  onPlayOnEarthClick(): void {
    const earthMap = this.zipService.unzip(EARTH_MAP) as Map;
    this.mapStore.next(earthMap);
    this.uiStore.setScreen(ScreenId.GAMEPLAY);
  }

  onCreateGameClick(): void {
    // TODO
    this.showSinglePlayerMenu = false;
  }

}
