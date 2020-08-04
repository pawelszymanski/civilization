import {Component} from '@angular/core';

import {Save} from '../../../../../../../models/save';
import {Uuid} from '../../../../../../../models/utils/uuid';

import {GameMapStore} from '../../../../../../../stores/game-map.store';
import {SavesStore} from '../../../../../../../stores/saves.store';

@Component({
  selector: 'load-game-form',
  templateUrl: './load-game-form.component.html',
  styleUrls: ['../dev-tools-form.sass']
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
    const saveToBeLoaded = this.saves.find(save => save.uuid === this.saveUuid);
    this.gameMapStore.next(saveToBeLoaded.gameMap);
    this.saveUuid = undefined;
  }

  onRemoveSaveClick() {
    this.savesStore.removeSave(this.saveUuid);
    this.saveUuid = undefined;
  }

}
