import {Component, ViewEncapsulation} from '@angular/core';

import {Ui} from '../../models/ui';

import {UiStore} from '../../stores/ui.store';

@Component({
  selector: 'map-editor',
  templateUrl: './map-editor.component.html',
  styleUrls: ['./map-editor.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class MapEditorComponent {

  ui: Ui;

  constructor(
    private uiStore: UiStore
  ) {}

  ngOnInit() {
    this.uiStore.ui.subscribe(ui => this.ui = ui);
  }

}
