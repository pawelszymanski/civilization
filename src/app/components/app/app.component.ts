import {Component} from '@angular/core';

import {KeyBindings} from '../../models/ui/key-bindings';
import {ModalId, SidebarId, TileOverlayId, Ui} from '../../models/ui/ui';

import {KeyBindingsStore} from '../../stores/key-bindings.store';
import {UiStore} from '../../stores/ui.store';

@Component({
  selector: 'app',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  keyBindings: KeyBindings;
  ui: Ui;

  constructor(
    private keyBindingsStore: KeyBindingsStore,
    private uiStore: UiStore
  ) {}

  ngOnInit() {
    this.subscribeToData();
    this.addEventListeners();
  }

  subscribeToData() {
    this.keyBindingsStore.keyBindings.subscribe(keyBindings => this.keyBindings = keyBindings);
    this.uiStore.ui.subscribe(ui => this.ui = ui);
  }

  addEventListeners() {
    // Using listeners rather than @HostListener since they could be called with .stopPropagation()
    document.addEventListener('wheel', this.documentOnWheel.bind(this), {passive: false});
    document.addEventListener('contextmenu', this.documentOnContextMenu.bind(this));
    document.addEventListener('keydown', this.documentOnKeydown.bind(this));
  }

  documentOnWheel(event) {
    if (event.ctrlKey) {
      event.preventDefault();
    }
  }

  documentOnContextMenu(event: MouseEvent) {
    if (this.ui.sidebar !== SidebarId.DEV_TOOLS) {
      event.preventDefault();
    }
  }

  documentOnKeydown(event: KeyboardEvent) {
    event.preventDefault();

    // const isBody = (<Element>event.target).tagName === 'BODY';
    // if (!isBody) { return; }

    switch (event.code) {
      case this.keyBindings.toggleTileYield:
        this.uiStore.toggleTileOverlay(TileOverlayId.YIELD); break;
      case this.keyBindings.toggleTileText:
        this.uiStore.toggleTileOverlay(TileOverlayId.TEXT); break;
      case this.keyBindings.toggleTechTree:
        this.uiStore.toggleTileOverlay(ModalId.TECH_TREE); break;
      case this.keyBindings.toggleCivicsTree:
        this.uiStore.toggleTileOverlay(ModalId.CIVICS_TREE); break;
      case this.keyBindings.toggleMapEditor:
        this.uiStore.toggleTileOverlay(SidebarId.MAP_EDITOR); break;
      case this.keyBindings.toggleDevTools:
        this.uiStore.toggleTileOverlay(SidebarId.DEV_TOOLS); break;
    }
  }

}
