import {Component} from '@angular/core';

import {SidebarId, Ui} from '../../../../models/ui/ui';

import {UiStore} from '../../../../stores/ui.store';

@Component({
  selector: 'dev-tools',
  templateUrl: './dev-tools.component.html',
  styleUrls: ['./dev-tools.component.sass']
})
export class DevToolsComponent {

  SIDEBAR_ID = SidebarId;

  ui: Ui;

  constructor(
    private uiStore: UiStore
  ) {}

  ngOnInit() {
    this.uiStore.ui.subscribe(ui => this.ui = ui);
  }

}
