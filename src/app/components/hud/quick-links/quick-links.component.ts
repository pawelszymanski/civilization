import { Component, DestroyRef, OnInit, ViewEncapsulation } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { YieldId } from '../../../models/yield';
import { ModalId, Ui } from '../../../models/ui';

import { YIELD_ID_TO_ICON_CLASS_MAP } from '../../../consts/yield.const';

import { UiStore } from '../../../stores/ui.store';

@Component({
  standalone: false,
  selector: '.quick-links-component',
  templateUrl: './quick-links.component.html',
  styleUrls: ['./quick-links.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class QuickLinksComponent implements OnInit {
  YIELD_ICONS = YIELD_ID_TO_ICON_CLASS_MAP;

  ModalId = ModalId;
  YieldId = YieldId;

  ui: Ui;

  constructor(
    private destroyRef: DestroyRef,
    private uiStore: UiStore
  ) {}

  ngOnInit(): void {
    this.subscribeToData();
  }

  subscribeToData(): void {
    this.uiStore.ui.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(ui => (this.ui = ui));
  }

  onScienceIconClick(): void {
    this.uiStore.toggleModal(ModalId.TECH_TREE);
  }

  onCultureIconClick(): void {
    this.uiStore.toggleModal(ModalId.CIVIC_TREE);
  }
}
