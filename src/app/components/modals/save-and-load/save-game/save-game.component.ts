import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Subscription} from 'rxjs';

import {Camera} from '../../../../models/camera';
import {Map} from '../../../../models/map';
import {GameplayUi} from '../../../../models/gameplay-ui';
import {Save} from '../../../../models/saves';

import {GeneratorService} from '../../../../services/generator.service';
import {SaveService} from '../../../../services/save.service';

import {CameraStore} from '../../../../stores/camera.store';
import {MapStore} from '../../../../stores/map.store';
import {GameplayUiStore} from '../../../../stores/gameplay-ui.store';
import {SavesStore} from '../../../../stores/saves.store';
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

  save: Save;

  subscriptions: Subscription[] = [];

  constructor(
    private generatorService: GeneratorService,
    private saveService: SaveService,
    private cameraStore: CameraStore,
    private mapStore: MapStore,
    private gameplayUiStore: GameplayUiStore,
    private savesStore: SavesStore,
    private uiStore: UiStore
  ) {}

  ngOnInit() {
    this.subscribeToData();
  }

  ngOnDestroy() {
    this.unsubscribeFromData();
  }

  subscribeToData() {
    this.subscriptions.push(
      this.mapStore.map.subscribe(map => this.map = map),
      this.gameplayUiStore.gameplayUi.subscribe(gameplayUi => this.gameplayUi = gameplayUi),
      this.cameraStore.camera.subscribe(camera => this.camera = camera)
    );
  }

  unsubscribeFromData() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  canGameBeSaved(): boolean {
    return (this.saveName && !!this.map);
  }

  onSaveGameClick() {
    if (!this.canGameBeSaved()) { return; }

    const save: Save = {
      name: this.saveName,
      uuid: this.generatorService.uuid(),
      timestamp: this.generatorService.nowIsoString(),
      isAutosave: false,
      gameplayUi: this.gameplayUi,
      camera: this.camera,
      map: this.map,
    }

    this.savesStore.addSave(save);
    this.saveName = '';
    this.uiStore.closeModal();
  }

}
