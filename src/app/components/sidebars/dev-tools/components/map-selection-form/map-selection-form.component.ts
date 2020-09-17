import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Subscription} from 'rxjs';

import {MapTypeId, Ui} from '../../../../../models/ui';

import {UiStore} from '../../../../../stores/ui.store';

@Component({
  selector: '.map-selection-form-component',
  templateUrl: './map-selection-form.component.html',
  styleUrls: ['./map-selection-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MapSelectionFormComponent implements OnInit, OnDestroy {

  ui: Ui;

  MapTypeId = MapTypeId;

  subscriptions: Subscription[] = [];

  constructor(
    private uiStore: UiStore
  ) {}

  ngOnInit() {
    this.subscribeToData();
  }

  ngOnDestroy() {
    this.unsubscribeFromData();
  }

  subscribeToData() {
    this.subscriptions.push(
      this.uiStore.ui.subscribe(ui => this.ui = ui)
    );
  }

  unsubscribeFromData() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  setMapType(mapTypeId: MapTypeId) {
    this.uiStore.setMapType(mapTypeId);
  }

}
