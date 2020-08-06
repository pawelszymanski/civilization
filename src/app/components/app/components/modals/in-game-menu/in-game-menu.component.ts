import {Component, ViewEncapsulation} from '@angular/core';

import {UiStore} from '../../../../../stores/ui.store';

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
    // TODO
  }

  onLoadGameClick() {
    // TODO
  }

  onOptionsClick() {
    // TODO
  }

  onExitToMainMenuClick() {
    // TODO
  }

  onExitToGoogleClick() {
    // TODO
  }


}
