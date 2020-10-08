import {Component, ViewEncapsulation} from '@angular/core';

import {Ui} from '../../../../models/ui';

import {TECHNOLOGY_TREE} from '../../../../consts/technology-tree.const';
import {TECHNOLOGY_SET} from '../../../../consts/technologies.const';

import {UiStore} from '../../../../stores/ui.store';

@Component({
  selector: '.technology-tree-component',
  templateUrl: './technology-tree.component.html',
  styleUrls: ['./technology-tree.component.scss', '../research-tree-modal.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TechnologyTreeComponent {

  TECHNOLOGY_TREE = TECHNOLOGY_TREE;
  TECHNOLOGY_SET = TECHNOLOGY_SET;

  ui: Ui;

  constructor(
    private uiStore: UiStore
  ) {}

  onCloseButtonClick() {
    this.uiStore.closeModal();
  }

}
