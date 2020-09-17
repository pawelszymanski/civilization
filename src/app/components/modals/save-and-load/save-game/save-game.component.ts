import {Component, ViewEncapsulation} from '@angular/core';

import {Camera} from '../../../../models/camera';
import {Map} from '../../../../models/map';
import {Save} from '../../../../models/saves';

import {GeneratorService} from '../../../../services/generator.service';

import {CameraStore} from '../../../../stores/camera.store';
import {MapStore} from '../../../../stores/map.store';
import {SavesStore} from '../../../../stores/saves.store';
import {UiStore} from '../../../../stores/ui.store';

@Component({
  selector: '.save-game-component',
  templateUrl: './save-game.component.html',
  styleUrls: ['./save-game.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SaveGameComponent {

  saveName = '';

  map: Map;
  camera: Camera;

  save: Save;

  constructor(
    private generatorService: GeneratorService,
    private cameraStore: CameraStore,
    private mapStore: MapStore,
    private savesStore: SavesStore,
    private uiStore: UiStore
  ) {}

  ngOnInit() {
    this.mapStore.map.subscribe(map => this.map = map);
    this.cameraStore.camera.subscribe(camera => this.camera = camera);
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
      map: this.map,
      camera: this.camera,
      isAutosave: false,
    }

    this.savesStore.addSave(save);
    this.saveName = '';
    this.uiStore.closeModal();
  }

}
