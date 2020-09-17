import {Component, ViewEncapsulation} from '@angular/core';

import {UiStore} from '../../../../stores/ui.store';
import {ModalId} from '../../../../models/ui';

@Component({
  selector: '.in-game-menu-component',
  templateUrl: './in-game-menu.component.html',
  styleUrls: ['./in-game-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InGameMenuComponent {

  constructor(
    private uiStore: UiStore
  ) {}

  onReturnToGameClick() {
    this.uiStore.closeModal();
  }

  onSaveGameClick() {
    this.uiStore.openModal(ModalId.SAVE_GAME);
  }

  onLoadGameClick() {
    this.uiStore.openModal(ModalId.LOAD_GAME);
  }

  onOptionsClick() {
    this.uiStore.openModal(ModalId.GAMEPLAY_OPTIONS_MENU);
  }

  onExitToMainMenuClick() {
    this.uiStore.closeModal();
    this.uiStore.showMainMenu();
  }

  onExitToGoogleClick() {
    this.uiStore.openModal(ModalId.EXIT_GAME_CONFIRMATION);
  }

}
