import {Component, ViewEncapsulation} from '@angular/core';

import {GameMap} from '../../../../../../models/game-map/game-map';
import {Save} from '../../../../../../models/saves/save';

import {GeneratorService} from '../../../../../../services/generator.service';

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

  save: Save;

  constructor(
    private generatorService: GeneratorService,
    private gameMapStore: GameMapStore,
    private savesStore: SavesStore,
    private uiStore: UiStore
  ) {}

  ngOnInit() {
    this.gameMapStore.gameMap.subscribe(gameMap => this.gameMap = gameMap);
  }

  canGameBeSaved(): boolean {
    return (this.saveName && !!this.gameMap);
  }

  onSaveGameClick() {
    if (!this.canGameBeSaved()) { return; }

    const save: Save = {
      uuid: this.generatorService.uuid(),
      name: this.saveName,
      timestamp: this.generatorService.nowIsoString(),
      gameMap: this.gameMap,
      isAutosave: false,
    }

    this.savesStore.addSave(save);
    this.saveName = '';
    this.uiStore.closeModal();
  }

}
