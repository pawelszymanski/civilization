import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Subscription} from 'rxjs';

import {YieldId} from '../../../models/yield';
import {ModalId, Ui} from '../../../models/ui';

import {YIELD_ID_TO_ICON_CLASS_MAP} from '../../../consts/yield.const';

import {UiStore} from '../../../stores/ui.store';

@Component({
  selector: '.quick-links-component',
  templateUrl: './quick-links.component.html',
  styleUrls: ['./quick-links.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class QuickLinksComponent implements OnInit, OnDestroy {

  YIELD_ICONS = YIELD_ID_TO_ICON_CLASS_MAP;

  ModalId = ModalId;
  YieldId = YieldId;

  ui: Ui;

  subscriptions: Subscription[] = [];

  constructor(
    private uiStore: UiStore
  ) {}

  ngOnInit(): void {
    this.subscribeToData();
  }

  ngOnDestroy(): void {
    this.unsubscribeFromData();
  }

  subscribeToData(): void {
    this.subscriptions.push(
      this.uiStore.ui.subscribe(ui => this.ui = ui)
    );
  }

  unsubscribeFromData(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onScienceIconClick(): void {
    this.uiStore.toggleModal(ModalId.TECH_TREE);
  }

  onCultureIconClick(): void {
    this.uiStore.toggleModal(ModalId.CIVIC_TREE);
  }

}
