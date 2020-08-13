import {Component, ViewEncapsulation} from '@angular/core';

import {UiStore} from '../../../../../../stores/ui.store';

@Component({
  selector: '.exit-game-confirmation-component',
  templateUrl: './exit-game-confirmation.component.html',
  styleUrls: ['./exit-game-confirmation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ExitGameConfirmationComponent {

  constructor(
    private uiStore: UiStore
  ) {}

  onNoClick() {
    this.uiStore.closeModal();
  }

  onYesClick() {
    window.location.href = 'http://google.com';
  }

}
