import {Component, ViewEncapsulation} from '@angular/core';

import {KeyBindings, UserActionId} from '../../models/key-bindings';
import {ModalId, MapTypeId, SidebarId, Ui} from '../../models/ui';
import {TileInfoOverlayId, TileResourceOverlayId} from '../../models/map-ui';

import {KeyboardService} from '../../services/keyboard.service';

import {KeyBindingsStore} from '../../stores/key-bindings.store';
import {UiStore} from '../../stores/ui.store';
import {MapUiStore} from '../../stores/map-ui.store';

@Component({
  selector: '.app-component',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {

  ModalId = ModalId;
  MapTypeId = MapTypeId;
  SidebarId = SidebarId;

  keyBindings: KeyBindings;
  ui: Ui;

  constructor(
    private keyboardService: KeyboardService,
    private keyBindingsStore: KeyBindingsStore,
    private uiStore: UiStore,
    private mapUiStore: MapUiStore
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
    // if (this.ui.sidebar !== SidebarId.DEV_TOOLS) {
    //   event.preventDefault();
    // }
  }

  documentOnKeydown(event: KeyboardEvent) {
    // proceed only if outside of an input
    const isInput = (event.target as HTMLElement).tagName.toUpperCase() === 'INPUT';
    if (isInput) { return; }

    event.preventDefault();

    const keyBinding = this.keyboardService.keyBindingFromEvent(event);
    const userActionId = this.keyboardService.findMatchingActionId(this.keyBindings, keyBinding);

    if (userActionId == UserActionId.ESCAPE_VIEW)        { this.uiStore.escapeView() } else
    if (userActionId == UserActionId.TOGGLE_TECH_TREE)   { this.uiStore.toggleModal(ModalId.TECHNOLOGY_TREE) } else
    if (userActionId == UserActionId.TOGGLE_CIVICS_TREE) { this.uiStore.toggleModal(ModalId.CIVIC_TREE) } else
    if (userActionId == UserActionId.TOGGLE_MAP_EDITOR)  { this.uiStore.toggleSidebar(SidebarId.WORLD_BUILDER) } else
    if (userActionId == UserActionId.TOGGLE_DEV_TOOLS)   { this.uiStore.toggleSidebar(SidebarId.DEV_TOOLS) } else

    if (userActionId == UserActionId.TOGGLE_TILE_INFO_OVERLAY_YIELD)   { this.mapUiStore.toggleTileInfoOverlay(TileInfoOverlayId.YIELD) } else
    if (userActionId == UserActionId.TOGGLE_TILE_INFO_OVERLAY_TEXT)    { this.mapUiStore.toggleTileInfoOverlay(TileInfoOverlayId.TEXT) } else
    if (userActionId == UserActionId.TOGGLE_TILE_RESOURCE_OVERLAY_ALL) { this.mapUiStore.toggleTileResourceOverlay(TileResourceOverlayId.ALL) } else
    if (userActionId == UserActionId.TOGGLE_GRID) { this.mapUiStore.toggleGrid() }
  }

}
