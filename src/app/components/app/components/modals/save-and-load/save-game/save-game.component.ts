import {Component, ViewEncapsulation} from '@angular/core';

import {Camera} from '../../../../../../models/camera/camera';
import {GameMap} from '../../../../../../models/game-map/game-map';
import {Save} from '../../../../../../models/saves/save';

import {GeneratorService} from '../../../../../../services/utils/generator.service';

import {CameraStore} from '../../../../../../stores/camera.store';
import {GameMapStore} from '../../../../../../stores/game-map.store';
import {SavesStore} from '../../../../../../stores/saves.store';
import {UiStore} from '../../../../../../stores/ui.store';

@Component({
  selector: '.save-game-component',
  templateUrl: './save-game.component.html',
  styleUrls: ['./save-game.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SaveGameComponent {

  saveName = '';

  gameMap: GameMap;
  camera: Camera;

  save: Save;

  constructor(
    private generatorService: GeneratorService,
    private cameraStore: CameraStore,
    private gameMapStore: GameMapStore,
    private savesStore: SavesStore,
    private uiStore: UiStore
  ) {}

  ngOnInit() {
    this.gameMapStore.gameMap.subscribe(gameMap => this.gameMap = gameMap);
    this.cameraStore.camera.subscribe(camera => this.camera = camera);
  }

  canGameBeSaved(): boolean {
    return (this.saveName && !!this.gameMap);
  }

  onSaveGameClick() {
    if (!this.canGameBeSaved()) { return; }

    const save: Save = {
      name: this.saveName,
      uuid: this.generatorService.uuid(),
      timestamp: this.generatorService.nowIsoString(),
      gameMap: this.gameMap,
      camera: this.camera,
      isAutosave: false,
    }

    this.savesStore.addSave(save);
    this.saveName = '';
    this.uiStore.closeModal();
  }

}
