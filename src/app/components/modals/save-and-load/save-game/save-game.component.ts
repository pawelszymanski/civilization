import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Subscription} from 'rxjs';

import {Camera} from '../../../../models/camera';
import {Map} from '../../../../models/map';
import {MapUi} from '../../../../models/map-ui';
import {Save} from '../../../../models/saves';

import {GeneratorService} from '../../../../services/generator.service';

import {CameraStore} from '../../../../stores/camera.store';
import {MapStore} from '../../../../stores/map.store';
import {MapUiStore} from '../../../../stores/map-ui.store';
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
  mapUi: MapUi;
  camera: Camera;

  save: Save;

  subscriptions: Subscription[] = [];

  constructor(
    private generatorService: GeneratorService,
    private cameraStore: CameraStore,
    private mapStore: MapStore,
    private mapUiStore: MapUiStore,
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
      this.mapUiStore.mapUi.subscribe(mapUi => this.mapUi = mapUi),
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
      map: this.map,
      mapUi: this.mapUi,
      camera: this.camera,
    }

    this.savesStore.addSave(save);
    this.saveName = '';
    this.uiStore.closeModal();
  }

}
