import {Component} from '@angular/core';

import {Save} from '../../../../models/save';
import {Uuid} from '../../../../models/utils/uuid';

import {SavesStore} from '../../../../stores/saves.store';
import {GameMapStore} from '../../../../stores/game-map.store';

@Component({
  selector: 'load-game-form',
  templateUrl: './load-game-form.component.html'
})
export class LoadGameFormComponent {

  saveUuid: Uuid;
  saves: Save[];

  constructor(
    private gameMapStore: GameMapStore,
    private savesStore: SavesStore
  ) {}

  ngOnInit() {
    this.savesStore.saves.subscribe(saves => this.saves = saves);
  }

  onLoadGameClick() {
    const saveGameToLoad = this.saves.find(save => save.uuid === this.saveUuid);
    this.gameMapStore.next(saveGameToLoad.gameMap);
    this.saveUuid = undefined;
  }

  onRemoveSaveClick() {
    this.savesStore.removeSave(this.saveUuid);
    this.saveUuid = undefined;
  }

}
