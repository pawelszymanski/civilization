import {Component, ViewEncapsulation} from '@angular/core';

import {CivicIdWithEraCoords, CivicTreeEra} from '../../../../models/civics';
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

  getEraElemClass(era: CivicTreeEra): string {
    const columns = era.civics.map(tech => tech.eraCoords.x).sort().pop() + 1;
    return `m-columns-${columns}`;
  }

  getTechnologyElemClass(civicIdWithEraCoords: CivicIdWithEraCoords): string {
    return `m-offset-${civicIdWithEraCoords.eraCoords.x}-${civicIdWithEraCoords.eraCoords.y}`;
  }

  onCloseButtonClick() {
    this.uiStore.closeModal();
  }

}
