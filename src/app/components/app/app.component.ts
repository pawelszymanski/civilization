import {Component, ViewEncapsulation} from '@angular/core';

import {ModalId, MapTypeId, SidebarId, Ui, TileOverlayId} from '../../models/ui/ui';
import {KeyBindings} from '../../models/ui/key-bindings';
import {UiActionId} from '../../models/ui/ui-action.enum';

import {KeyboardHelperService} from '../../services/ui/keyboard-helper.service';

import {KeyBindingsStore} from '../../stores/key-bindings.store';
import {UiStore} from '../../stores/ui.store';

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
    private keyboardHelperService: KeyboardHelperService,
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
    // if (this.ui.sidebar !== SidebarId.DEV_TOOLS) {
    //   event.preventDefault();
    // }
  }

  documentOnKeydown(event: KeyboardEvent) {
    // proceed only if outside of an input
    const isInput = (event.target as HTMLElement).tagName.toUpperCase() === 'INPUT';
    if (isInput) { return; }

    event.preventDefault();

    const keyBinding = this.keyboardHelperService.keyBindingFromEvent(event);
    const uiActionId = this.keyboardHelperService.findMatchingActionId(this.keyBindings, keyBinding);

    if (uiActionId == UiActionId.ESCAPE_VIEW)        {this.uiStore.escapeView()} else
    if (uiActionId == UiActionId.TOGGLE_TILE_YIELD)  {this.uiStore.toggleTileOverlay(TileOverlayId.YIELD) } else
    if (uiActionId == UiActionId.TOGGLE_TILE_TEXT)   {this.uiStore.toggleTileOverlay(TileOverlayId.TEXT)} else
    if (uiActionId == UiActionId.TOGGLE_TECH_TREE)   {this.uiStore.toggleModal(ModalId.TECHNOLOGY_TREE)} else
    if (uiActionId == UiActionId.TOGGLE_CIVICS_TREE) {this.uiStore.toggleModal(ModalId.CIVIC_TREE)} else
    if (uiActionId == UiActionId.TOGGLE_MAP_EDITOR)  {this.uiStore.toggleSidebar(SidebarId.MAP_EDITOR)} else
    if (uiActionId == UiActionId.TOGGLE_DEV_TOOLS)   {this.uiStore.toggleSidebar(SidebarId.DEV_TOOLS)}
  }

}
