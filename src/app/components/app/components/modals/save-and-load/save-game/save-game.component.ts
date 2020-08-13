import {Component, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

import {SavesStore} from '../../../../../../stores/saves.store';
import {UiStore} from '../../../../../../stores/ui.store';

@Component({
  selector: '.save-game-component',
  templateUrl: './save-game.component.html',
  styleUrls: ['./save-game.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SaveGameComponent {

  saveGameOptionsForm = new FormGroup({
    saveName: new FormControl('')
  });

  constructor(
    private savesStore: SavesStore,
    private uiStore: UiStore
  ) {}

}




// import {Component} from '@angular/core';
//
// import {GameMap} from '../../../../../../../models/game-map/game-map';
// import {Save} from '../../../../../../../models/save';
//
// import {UtilsService} from '../../../../../../../services/utils.service';
//
// import {GameMapStore} from '../../../../../../../stores/game-map.store';
// import {SavesStore} from '../../../../../../../stores/saves.store';
//
// @Component({
//   selector: 'save-game-form',
//   templateUrl: './save-game-form.component.html',
//   styleUrls: ['../dev-tools-form.scss']
// })
// export class SaveGameFormComponent {
//
//   gameMap: GameMap;
//
//   saveName: string;
//
//   constructor(
//     private savesStore: SavesStore,
//     private gameMapStore: GameMapStore,
//     private utilsService: UtilsService,
//   ) {}
//
//   ngOnInit() {
//     this.gameMapStore.gameMap.subscribe(gameMap => this.gameMap = gameMap);
//   }
//
//   canGameBeSaved(): boolean {
//     return (this.saveName && !!this.gameMap);
//   }
//
//   onSaveGameClick() {
//     if (!this.canGameBeSaved()) { return; }
//
//     const save: Save = {
//       uuid: this.utilsService.generateUuid(),
//       name: this.saveName,
//       timestamp: this.utilsService.generateTimestamp(),
//       gameMap: this.gameMap,
//       isAutosave: false
//     }
//     this.savesStore.addSave(save);
//     this.saveName = '';
//   }
//
// }
