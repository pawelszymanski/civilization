import { Component, DestroyRef, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { KeyBindings, UserActionId } from '../../models/key-bindings';
import { ModalId, ScreenId, SidebarId, Ui } from '../../models/ui';
import { GameplayUi, TileInfoOverlayId, TileResourceOverlayId } from '../../models/gameplay-ui';

import { KeyboardService } from '../../services/keyboard.service';

import { UiStore } from '../../stores/ui.store';
import { GameplayUiStore } from '../../stores/gameplay-ui.store';
import { KeyBindingsStore } from '../../stores/key-bindings.store';

@Component({
  selector: '.app-component',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class AppComponent implements OnInit {
  ModalId = ModalId;
  ScreenId = ScreenId;
  SidebarId = SidebarId;

  ui: Ui;
  gameplayUi: GameplayUi;
  keyBindings: KeyBindings;

  constructor(
    private destroyRef: DestroyRef,
    private keyboardService: KeyboardService,
    private uiStore: UiStore,
    private gameplayUiStore: GameplayUiStore,
    private keyBindingsStore: KeyBindingsStore
  ) {}

  ngOnInit(): void {
    this.subscribeToData();
  }

  subscribeToData(): void {
    this.uiStore.ui.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(ui => (this.ui = ui));
    this.gameplayUiStore.gameplayUi.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(gameplayUi => (this.gameplayUi = gameplayUi));
    this.keyBindingsStore.keyBindings.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(keyBindings => (this.keyBindings = keyBindings));
  }

  @HostListener('document:wheel', ['$event'])
  documentOnWheel(event: MouseEvent): void {
    if (event.ctrlKey) {
      event.preventDefault();
    }
  }

  @HostListener('document:contextmenu', ['$event'])
  documentOnContextMenu(event: MouseEvent): void {
    if (this.ui.sidebar !== SidebarId.DEV_TOOLS) {
      event.preventDefault();
    }
  }

  @HostListener('document:keydown', ['$event'])
  documentOnKeydown(event: KeyboardEvent): void {
    // proceed only if outside an input
    const isInput = (event.target as HTMLElement).tagName.toUpperCase() === 'INPUT';
    if (isInput) {
      return;
    }

    event.preventDefault();

    const keyBinding = this.keyboardService.keyBindingFromEvent(event);
    const userActionId = this.keyboardService.findMatchingActionId(this.keyBindings, keyBinding);

    if (userActionId === UserActionId.ESCAPE_VIEW) {
      this.uiStore.escapeView();
    } else if (userActionId === UserActionId.TOGGLE_TECH_TREE) {
      this.uiStore.toggleModal(ModalId.TECH_TREE);
    } else if (userActionId === UserActionId.TOGGLE_CIVICS_TREE) {
      this.uiStore.toggleModal(ModalId.CIVIC_TREE);
    } else if (userActionId === UserActionId.TOGGLE_WORLD_BUILDER) {
      this.uiStore.toggleSidebar(SidebarId.WORLD_BUILDER);
    } else if (userActionId === UserActionId.TOGGLE_DEV_TOOLS) {
      this.uiStore.toggleSidebar(SidebarId.DEV_TOOLS);
    } else if (userActionId === UserActionId.TOGGLE_TILE_INFO_OVERLAY_YIELD) {
      this.gameplayUiStore.toggleTileInfoOverlay(TileInfoOverlayId.YIELD);
    } else if (userActionId === UserActionId.TOGGLE_TILE_INFO_OVERLAY_TEXT) {
      this.gameplayUiStore.toggleTileInfoOverlay(TileInfoOverlayId.TEXT);
    } else if (userActionId === UserActionId.TOGGLE_TILE_RESOURCE_OVERLAY_ALL) {
      this.gameplayUiStore.toggleTileResourceOverlay(TileResourceOverlayId.ALL);
    } else if (userActionId === UserActionId.TOGGLE_MINIMAP) {
      this.gameplayUiStore.toggleMinimap();
    }
    if (userActionId === UserActionId.TOGGLE_GRID) {
      this.gameplayUiStore.toggleGrid();
    }
  }
}
