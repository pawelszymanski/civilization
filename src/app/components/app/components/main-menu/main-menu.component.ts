import {Component, ViewEncapsulation} from '@angular/core';

import {Save} from '../../../../models/save';
import {MapTypeId, Ui} from '../../../../models/ui/ui';

import {GameMapStore} from '../../../../stores/game-map.store';
import {SavesStore} from '../../../../stores/saves.store';
import {UiStore} from '../../../../stores/ui.store';

@Component({
  selector: '.main-menu-component',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainMenuComponent {

  ui: Ui;
  saves: Save[];

  showSinglePlayerMenu = false;

  constructor(
    private uiStore: UiStore,
    private savesStore: SavesStore,
    private gameMapStore: GameMapStore
  ) {}

  ngOnInit() {
    this.uiStore.ui.subscribe(ui => this.ui = ui);
    this.savesStore.saves.subscribe(saves => this.saves = saves);
  }

  onSinglePlayerClick() {
    this.showSinglePlayerMenu = true;
  }

  onOptionsClick() {
    // TODO
  }

  onExitToGoogleClick() {
    window.location.href = 'http://google.com';
  }

  onResumeGameClick() {
    if (this.saves.length === 0) { return; }
    const latestTimestamp = this.saves.map(save => save.timestamp).sort().pop();
    const saveToBeLoaded = this.saves.find(save => save.timestamp === latestTimestamp);
    this.gameMapStore.next(saveToBeLoaded.gameMap);
    this.uiStore.setMapType(MapTypeId.STRATEGIC);
    this.uiStore.hideMainMenu();
  }

  onLoadGameClick() {
    if (this.saves.length === 0) { return; }
    // TODO
  }

  onPlayNowClick() {
    // TODO
  }

  onCreateGameClick() {
    // TODO
  }

}
