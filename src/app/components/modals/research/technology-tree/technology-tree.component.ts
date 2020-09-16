import {Component, ViewEncapsulation} from '@angular/core';

import {TechnologyIdWithEraCoords, TechnologyTreeEra} from '../../../../models/research/technology-tree';
import {Ui} from '../../../../models/ui/ui';

import {TECHNOLOGY_TREE} from '../../../../consts/research/technology-tree';

import {UiStore} from '../../../../stores/ui.store';

@Component({
  selector: '.technology-tree-component',
  templateUrl: './technology-tree.component.html',
  styleUrls: ['./technology-tree.component.scss', '../research-tree-modal.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TechnologyTreeComponent {

  TECHNOLOGY_TREE = TECHNOLOGY_TREE;

  ui: Ui;

  constructor(
    private uiStore: UiStore
  ) {}

  getEraElemClass(era: TechnologyTreeEra): string {
    const columns = era.technologies.map(tech => tech.eraCoords.x).sort().pop() + 1;
    return `m-columns-${columns}`;
  }

  getTechnologyElemClass(technologyIdWithEraCoords: TechnologyIdWithEraCoords): string {
    return `m-offset-${technologyIdWithEraCoords.eraCoords.x}-${technologyIdWithEraCoords.eraCoords.y}`;
  }

  onCloseButtonClick() {
    this.uiStore.closeModal();
  }

}
