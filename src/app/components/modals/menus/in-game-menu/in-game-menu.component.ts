import {Component, ViewEncapsulation} from '@angular/core';

import {ModalId, ScreenId} from '../../../../models/ui';

import {DEFAULT_GAMEPLAY_UI} from '../../../../consts/gameplay-ui.const';
import {DEFAULT_CAMERA} from '../../../../consts/camera.const';
import {DEFAULT_MAP} from '../../../../consts/map.const';

import {UiStore} from '../../../../stores/ui.store';
import {MapStore} from '../../../../stores/map.store';
import {CameraStore} from '../../../../stores/camera.store';
import {GameplayUiStore} from '../../../../stores/gameplay-ui.store';

@Component({
  selector: '.in-game-menu-component',
  templateUrl: './in-game-menu.component.html',
  styleUrls: ['./in-game-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InGameMenuComponent {

  constructor(
    private uiStore: UiStore,
    private gameplayUiStore: GameplayUiStore,
    private cameraStore: CameraStore,
    private mapStore: MapStore,
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
    this.gameplayUiStore.next(DEFAULT_GAMEPLAY_UI);
    this.cameraStore.next(DEFAULT_CAMERA);
    this.mapStore.next(DEFAULT_MAP);
    this.uiStore.setScreen(ScreenId.MAIN_MENU);
  }

  onExitToGoogleClick() {
    this.uiStore.openModal(ModalId.EXIT_GAME_CONFIRMATION);
  }

}
