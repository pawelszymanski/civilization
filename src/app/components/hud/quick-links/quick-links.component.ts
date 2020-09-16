import {Component, ViewEncapsulation} from '@angular/core';

import {YieldId} from '../../../models/game-map/yield';
import {ModalId, Ui} from '../../../models/ui/ui';

import {YIELD_ID_TO_ICON_CLASS_MAP} from '../../../consts/game-map/yield-id-to-icon-class-map.const';

import {UiStore} from '../../../stores/ui.store';

@Component({
  selector: '.quick-links-component',
  templateUrl: './quick-links.component.html',
  styleUrls: ['./quick-links.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class QuickLinksComponent {

  YIELD_ICONS = YIELD_ID_TO_ICON_CLASS_MAP;

  ModalId = ModalId;
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
    this.uiStore.toggleModal(ModalId.TECHNOLOGY_TREE);
  }

  onCultureIconClick() {
    this.uiStore.toggleModal(ModalId.CIVIC_TREE);
  }


}
