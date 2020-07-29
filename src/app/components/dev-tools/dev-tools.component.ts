import {Component, ViewEncapsulation} from '@angular/core';

import {Ui} from '../../models/ui';

import {UiStore} from '../../stores/ui.store';

@Component({
  selector: 'dev-tools',
  templateUrl: './dev-tools.component.html',
  styleUrls: ['./dev-tools.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class DevToolsComponent {

  ui: Ui;

  constructor(
    private uiStore: UiStore
  ) {}

  ngOnInit() {
    this.uiStore.ui.subscribe(ui => this.ui = ui);
  }

}
