import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Subscription} from 'rxjs';

import {KeyBindings, UserActionId} from '../../models/key-bindings';
import {ModalId, ScreenId, SidebarId, Ui} from '../../models/ui';
import {GameplayUi, TileInfoOverlayId, TileResourceOverlayId} from '../../models/gameplay-ui';

import {KeyboardService} from '../../services/keyboard.service';

import {UiStore} from '../../stores/ui.store';
import {GameplayUiStore} from '../../stores/gameplay-ui.store';
import {KeyBindingsStore} from '../../stores/key-bindings.store';

@Component({
  selector: '.app-component',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy {

  ModalId = ModalId;
  ScreenId = ScreenId;
  SidebarId = SidebarId;

  ui: Ui;
  gameplayUi: GameplayUi;
  keyBindings: KeyBindings;

  subscriptions: Subscription[] = [];

  constructor(
    private keyboardService: KeyboardService,
    private uiStore: UiStore,
    private gameplayUiStore: GameplayUiStore,
    private keyBindingsStore: KeyBindingsStore,
  ) {}

  ngOnInit() {
    this.subscribeToData();
    this.addEventListeners();
  }

  subscribeToData() {
    this.subscriptions.push(
      this.uiStore.ui.subscribe(ui => this.ui = ui),
      this.gameplayUiStore.gameplayUi.subscribe(gameplayUi => this.gameplayUi = gameplayUi),
      this.keyBindingsStore.keyBindings.subscribe(keyBindings => this.keyBindings = keyBindings),
    );
  }

  ngOnDestroy() {
    this.unsubscribeFromData();
  }

  addEventListeners() {
    // Using listeners rather than @HostListener since they could be called with .stopPropagation()
    document.addEventListener('wheel', this.documentOnWheel.bind(this), {passive: false});
    document.addEventListener('contextmenu', this.documentOnContextMenu.bind(this));
    document.addEventListener('keydown', this.documentOnKeydown.bind(this));
  }

  unsubscribeFromData() {
    this.subscriptions.forEach(s => s.unsubscribe());
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

    if (userActionId == UserActionId.TOGGLE_TILE_INFO_OVERLAY_YIELD)   { this.gameplayUiStore.toggleTileInfoOverlay(TileInfoOverlayId.YIELD) } else
    if (userActionId == UserActionId.TOGGLE_TILE_INFO_OVERLAY_TEXT)    { this.gameplayUiStore.toggleTileInfoOverlay(TileInfoOverlayId.TEXT) } else
    if (userActionId == UserActionId.TOGGLE_TILE_RESOURCE_OVERLAY_ALL) { this.gameplayUiStore.toggleTileResourceOverlay(TileResourceOverlayId.ALL) } else
    if (userActionId == UserActionId.TOGGLE_MINIMAP) { this.gameplayUiStore.toggleMinimap() }
    if (userActionId == UserActionId.TOGGLE_GRID) { this.gameplayUiStore.toggleGrid() }
  }

}
