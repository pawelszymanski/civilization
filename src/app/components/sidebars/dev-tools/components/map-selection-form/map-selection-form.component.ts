import {Component, ViewEncapsulation} from '@angular/core';

import {MapTypeId, Ui} from '../../../../../models/ui';

import {UiStore} from '../../../../../stores/ui.store';

@Component({
  selector: '.map-selection-form-component',
  templateUrl: './map-selection-form.component.html',
  styleUrls: ['./map-selection-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MapSelectionFormComponent {

  ui: Ui;

  MapTypeId = MapTypeId;

  constructor(
    private uiStore: UiStore
  ) {}

  ngOnInit() {
    this.subscribeToData();
  }

  subscribeToData() {
    this.uiStore.ui.subscribe(ui => this.ui = ui);
  }

  setMapType(mapTypeId: MapTypeId) {
    this.uiStore.setMapType(mapTypeId);
  }

}
