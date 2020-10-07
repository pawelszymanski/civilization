import {Component, ViewEncapsulation} from '@angular/core';

import {Ui} from '../../../../models/ui';

import {CIVIC_TREE} from '../../../../consts/civic-tree.const';

import {UiStore} from '../../../../stores/ui.store';

@Component({
  selector: '.civic-tree-component',
  templateUrl: './civic-tree.component.html',
  styleUrls: ['./civic-tree.component.scss', '../research-tree-modal.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CivicTreeComponent {

  CIVIC_TREE = CIVIC_TREE;

  ui: Ui;

  constructor(
    private uiStore: UiStore
  ) {}

  onCloseButtonClick() {
    this.uiStore.closeModal();
  }

}
