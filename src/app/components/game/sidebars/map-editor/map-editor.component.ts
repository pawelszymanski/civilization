import {Component} from '@angular/core';

import {SidebarId, Ui} from '../../../../models/ui/ui';

import {UiStore} from '../../../../stores/ui.store';

@Component({
  selector: 'map-editor',
  templateUrl: './map-editor.component.html',
  styleUrls: ['./map-editor.component.sass']
})
export class MapEditorComponent {

  SIDEBAR_ID = SidebarId;

  ui: Ui;

  constructor(
    private uiStore: UiStore
  ) {}

  ngOnInit() {
    this.uiStore.ui.subscribe(ui => this.ui = ui);
  }

}
