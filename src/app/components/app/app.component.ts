import {Component, HostListener, ViewEncapsulation} from '@angular/core';

import {Ui} from '../../models/ui';

import {UiStore} from '../../stores/ui.store';

@Component({
  selector: 'app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {

  ui: Ui;

  constructor(
    private uiStore: UiStore
  ) {}

  ngOnInit() {
    this.uiStore.ui.subscribe(ui => this.ui = ui);
  }

  @HostListener('window:keypress', ['$event'])
  onWindowKeypress(event: KeyboardEvent) {

    if (event.key === '`' && !event.shiftKey) {
      this.uiStore.setIsDevToolsShown(!this.ui.isDevToolsShown);
    }

    if (event.key === 'y') {
      this.uiStore.setIsYieldShown(!this.ui.isYieldShown);
    }

  }

}
