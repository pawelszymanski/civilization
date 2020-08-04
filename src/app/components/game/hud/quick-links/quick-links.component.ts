import {Component} from '@angular/core';

import {ModalId, Ui} from '../../../../models/ui/ui';
import {YieldId} from '../../../../models/game-map/yield';

import {YIELD_ICONS} from '../../../../consts/game-map/yield-icons.const';

import {UiStore} from '../../../../stores/ui.store';

@Component({
  selector: 'quick-links',
  templateUrl: './quick-links.component.html',
  styleUrls: ['./quick-links.component.sass']
})
export class QuickLinksComponent {

  YIELD_ICONS = YIELD_ICONS;

  YieldId = YieldId;

  ui: Ui;

  constructor(
    private uiStore: UiStore
  ) {}

  subscribeToData() {
    this.uiStore.ui.subscribe(ui => this.ui = ui);
  }

  ngOnInit() {
    this.subscribeToData();
  }

  onScienceIconClick() {
    this.uiStore.toggleModal(ModalId.TECH_TREE);
  }

  onCultureIconClick() {
    this.uiStore.toggleModal(ModalId.CIVICS_TREE);
  }


}
