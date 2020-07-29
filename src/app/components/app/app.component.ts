import {Component} from '@angular/core';

import {Ui} from '../../models/ui';

import {UiStore} from '../../stores/ui.store';

@Component({
  selector: 'app',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  ui: Ui;

  constructor(
    private uiStore: UiStore
  ) {}

  ngOnInit() {
    this.subscribeToData();
    this.addEventListeners();
  }

  subscribeToData() {
    this.uiStore.ui.subscribe(ui => this.ui = ui);
  }

  addEventListeners() {
    // Using listeners rather than @HostListener since they could be called with .stopPropagation()
    document.addEventListener('wheel', this.documentOnWheel.bind(this), {passive: false});
    document.addEventListener('contextmenu', this.documentOnContextMenu.bind(this));
    document.addEventListener('keypress', this.documentOnKeypress.bind(this));
  }

  documentOnWheel(event) {
    if (event.ctrlKey) {
      event.preventDefault();
    }
  }

  documentOnContextMenu(event: MouseEvent) {
    if (!this.ui.showDevTools) {
      event.preventDefault();
    }
  }

  documentOnKeypress(event: KeyboardEvent) {
    const isBody = (<Element>event.target).tagName === 'BODY';

    if (isBody && event.key === '`' && !event.shiftKey) {
      this.uiStore.setShowDevTools(!this.ui.showDevTools);
    }

    if (isBody && event.key === 'y') {
      this.uiStore.setShowTileYield(!this.ui.showTileYield);
    }

    if (isBody && event.key === 'i') {
      this.uiStore.setShowTileInfo(!this.ui.showTileInfo);
    }

    if (isBody && event.key === 't') {
      this.uiStore.setShowTechTree(!this.ui.showTechTree);
    }

  }

}
