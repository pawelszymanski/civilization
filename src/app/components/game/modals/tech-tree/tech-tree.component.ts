import {Component} from '@angular/core';

import {TechIdWithEraCoords, TechTreeEra} from '../../../../models/technology/tech-tree';
import {ModalId, Ui} from '../../../../models/ui/ui';

import {TECH_TREE} from '../../../../consts/technology/tech-tree';

import {UiStore} from '../../../../stores/ui.store';

@Component({
  selector: 'tech-tree',
  templateUrl: './tech-tree.component.html',
  styleUrls: ['./tech-tree.component.sass']
})
export class TechTreeComponent {

  MODAL_ID = ModalId;

  ui: Ui;

  TECH_TREE = TECH_TREE;

  constructor(
    private uiStore: UiStore
  ) {}

  subscribeToData() {
    this.uiStore.ui.subscribe(ui => this.ui = ui);
  }

  ngOnInit() {
    this.subscribeToData();
  }

  getEraElemClass(era: TechTreeEra): string {
    const columns = era.technologies.map(tech => tech.eraCoords.x).sort().pop() + 1;
    return `m-columns-${columns}`;
  }

  getTechnologyElemClass(techIdWithEraCoords: TechIdWithEraCoords): string {
    return `m-offset-${techIdWithEraCoords.eraCoords.x}-${techIdWithEraCoords.eraCoords.y}`;
  }

  onCloseButtonClick() {
    this.uiStore.closeModal();
  }

}
