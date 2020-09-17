import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Subscription} from 'rxjs';

import {Save} from '../../models/saves';
import {MapSizeId} from '../../models/map-size';
import {MapTypeId, ModalId, Ui} from '../../models/ui';
import {LandmassValueId, MapGeneratorSettings, RainfallId, TemperatureId, WorldAgeId} from '../../models/map-generator';

import {MAP_SIZE_SETTINGS_LIST} from '../../consts/map-size-settings.const';

import {MapGeneratorService} from '../../services/map-generator.service';
import {SaveService} from '../../services/save.service';

import {UiStore} from '../../stores/ui.store';
import {MapStore} from '../../stores/map.store';
import {SavesStore} from '../../stores/saves.store';

@Component({
  selector: '.main-menu-component',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainMenuComponent implements OnInit, OnDestroy {

  ui: Ui;
  saves: Save[];

  showSinglePlayerMenu = false;

  subscriptions: Subscription[] = [];

  constructor(
    private mapGeneratorService: MapGeneratorService,
    private saveService: SaveService,
    private uiStore: UiStore,
    private mapStore: MapStore,
    private savesStore: SavesStore
  ) {}

  ngOnInit() {
    this.subscribeToData();
  }

  ngOnDestroy() {
    this.unsubscribeFromData();
  }

  subscribeToData() {
    this.subscriptions.push(
      this.uiStore.ui.subscribe(ui => this.ui = ui),
      this.savesStore.saves.subscribe(saves => this.saves = saves)
    );
  }

  unsubscribeFromData() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  get noSavesPresent(): boolean {
    return this.saves.length === 0;
  }

  onSinglePlayerClick() {
    this.showSinglePlayerMenu = true;
  }

  onOptionsClick() {
    // TODO
    this.showSinglePlayerMenu = false;
  }

  onExitToGoogleClick() {
    this.uiStore.openModal(ModalId.EXIT_GAME_CONFIRMATION);
  }

  onResumeGameClick() {
    if (this.noSavesPresent) { return; }
    const latestTimestamp = this.saves.map(save => save.timestamp).sort().pop();
    const saveToBeLoaded = this.saves.find(save => save.timestamp === latestTimestamp);
    this.saveService.loadSave(saveToBeLoaded);
    this.uiStore.setMapType(MapTypeId.STRATEGIC);
    this.uiStore.hideMainMenu();
  }

  onLoadGameClick() {
    if (this.noSavesPresent) { return; }
    this.uiStore.openModal(ModalId.LOAD_GAME);
  }

  onPlayNowClick() {
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
    }
    const newMap = this.mapGeneratorService.generateNewGameMap(mapGeneratorSetting);
    this.mapStore.next(newMap);
    this.uiStore.setMapType(MapTypeId.STRATEGIC);
    this.uiStore.hideMainMenu();
  }

  onCreateGameClick() {
    // TODO
    this.showSinglePlayerMenu = false;
  }

}
