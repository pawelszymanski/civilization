import {Component, ViewEncapsulation} from '@angular/core';

import {Ui} from '../../../../models/ui';

import {CIVIC_TREE} from '../../../../consts/civic-tree.const';
import {CIVIC_SET} from '../../../../consts/civics.const';

import {UiStore} from '../../../../stores/ui.store';

@Component({
  selector: '.civic-tree-component',
  templateUrl: './civic-tree.component.html',
  styleUrls: ['./civic-tree.component.scss', '../research-tree-modal.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CivicTreeComponent {

  CIVIC_TREE = CIVIC_TREE;
  CIVIC_SET = CIVIC_SET;

  ui: Ui;

  constructor(
    private uiStore: UiStore
  ) {}

  onCloseButtonClick(): void {
    this.uiStore.closeModal();
  }

}
