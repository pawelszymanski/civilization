import {Component} from '@angular/core';

import {Save} from '../../models/save';
import {ScreenId, Ui} from '../../models/ui/ui';

import {GameMapStore} from '../../stores/game-map.store';
import {SavesStore} from '../../stores/saves.store';
import {UiStore} from '../../stores/ui.store';

@Component({
  selector: 'main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.sass']
})
export class MainMenuComponent {

  SCREEN_ID = ScreenId;

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
    // TODO
  }

  onResumeGameClick() {
    if (this.saves.length === 0) { return; }
    const latestTimestamp = this.saves.map(save => save.timestamp).sort().pop();
    const saveToBeLoaded = this.saves.find(save => save.timestamp === latestTimestamp);
    this.gameMapStore.next(saveToBeLoaded.gameMap);
    this.uiStore.setScreen(ScreenId.STRATEGIC_VIEW);
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
