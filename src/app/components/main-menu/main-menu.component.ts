import {Component, ViewEncapsulation} from '@angular/core';

import {Ui} from '../../models/ui';

import {UiStore} from '../../stores/ui.store';

@Component({
  selector: 'main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class MainMenuComponent {

  ui: Ui;

  constructor(
    private uiStore: UiStore
  ) {}

  ngOnInit() {
    this.uiStore.ui.subscribe(ui => this.ui = ui);
  }

}
