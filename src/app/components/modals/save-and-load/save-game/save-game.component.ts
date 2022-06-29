import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Subscription} from 'rxjs';

import {Camera} from '../../../../models/camera';
import {Map} from '../../../../models/map';
import {GameplayUi} from '../../../../models/gameplay-ui';
import {Save} from '../../../../models/saves';

import {GeneratorService} from '../../../../services/generator.service';
import {SaveService} from '../../../../services/save.service';
import {LocalStorageService} from '../../../../services/local-storage.service';

import {CameraStore} from '../../../../stores/camera.store';
import {MapStore} from '../../../../stores/map.store';
import {GameplayUiStore} from '../../../../stores/gameplay-ui.store';
import {UiStore} from '../../../../stores/ui.store';

@Component({
  selector: '.save-game-component',
  templateUrl: './save-game.component.html',
  styleUrls: ['./save-game.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SaveGameComponent implements OnInit, OnDestroy {

  saveName = '';

  map: Map;
  gameplayUi: GameplayUi;
  camera: Camera;

  usedStoragePc: number;

  subscriptions: Subscription[] = [];

  constructor(
    private generatorService: GeneratorService,
    private saveService: SaveService,
    private localStorageService: LocalStorageService,
    private cameraStore: CameraStore,
    private mapStore: MapStore,
    private gameplayUiStore: GameplayUiStore,
    private uiStore: UiStore,
  ) {}

  ngOnInit(): void {
    this.subscribeToData();
    this.getUsedLocalStorageSpace();
  }

  ngOnDestroy(): void {
    this.unsubscribeFromData();
  }

  subscribeToData(): void {
    this.subscriptions.push(
      this.mapStore.map.subscribe(map => this.map = map),
      this.gameplayUiStore.gameplayUi.subscribe(gameplayUi => this.gameplayUi = gameplayUi),
      this.cameraStore.camera.subscribe(camera => this.camera = camera)
    );
  }

  getUsedLocalStorageSpace(): void {
    this.usedStoragePc = this.localStorageService.getUsagePc();
  }

  unsubscribeFromData(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  canGameBeSaved(): boolean {
    return (this.usedStoragePc < 100 && this.saveName && !!this.map);
  }

  onSaveGameClick(): void {
    if (!this.canGameBeSaved()) { return; }

    const save: Save = {
      name: this.saveName,
      uuid: this.generatorService.uuid(),
      timestamp: this.generatorService.nowIsoString(),
      isAutosave: false,
      gameplayUi: this.gameplayUi,
      camera: this.camera,
      map: this.map,
    };

    this.saveService.save(save);
    this.saveName = '';
    this.uiStore.closeModal();
  }

}
