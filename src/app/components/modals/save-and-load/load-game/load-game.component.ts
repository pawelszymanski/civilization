import { Component, DestroyRef, OnInit, ViewEncapsulation } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';

import { SaveHeader, SaveSortOrderId } from '../../../../models/saves';
import { Uuid } from '../../../../models/utils';
import { ModalId, ScreenId } from '../../../../models/ui';
import { SaveService } from '../../../../services/save.service';
import { SaveHeadersStore } from '../../../../stores/save-headers.store';
import { UiStore } from '../../../../stores/ui.store';

@Component({
  standalone: false,
  selector: '.load-game-component',
  templateUrl: './load-game.component.html',
  styleUrls: ['./load-game.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LoadGameComponent implements OnInit {
  SaveSortOrderId = SaveSortOrderId;

  saveHeaders: SaveHeader[] = [];
  filteredAndSortedSaveHeaders: SaveHeader[] = [];
  selectedSaveUuid: Uuid;

  saveHeaderListOptionsForm = new FormGroup({
    showAutosaves: new FormControl(false),
    sortOrder: new FormControl(SaveSortOrderId.NAME_ASCENDING),
  });

  constructor(
    private destroyRef: DestroyRef,
    private saveService: SaveService,
    private saveHeadersStore: SaveHeadersStore,
    private uiStore: UiStore
  ) {}

  ngOnInit(): void {
    this.subscribeToData();
  }

  subscribeToData(): void {
    this.saveHeadersStore.saveHeaders.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(saveHeaders => {
      this.saveHeaders = saveHeaders;
      this.filterAndSortSaveHeaders();
    });
    this.saveHeaderListOptionsForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.filterAndSortSaveHeaders());
  }

  deselectSaveHeaderIfFilteredOut(): void {
    if (this.selectedSaveUuid && !this.filteredAndSortedSaveHeaders.find(sh => sh.uuid === this.selectedSaveUuid)) {
      this.selectedSaveUuid = null;
    }
  }

  getFilteredAndSortedSaveHeaders(): SaveHeader[] {
    let result = [...this.saveHeaders];

    const options = this.saveHeaderListOptionsForm.value;

    if (!options.showAutosaves) {
      result = result.filter(saveHeader => !saveHeader.isAutosave);
    }

    if (options.sortOrder === SaveSortOrderId.DATE_ASCENDING) {
      return result.sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1));
    }
    if (options.sortOrder === SaveSortOrderId.DATE_DESCENDING) {
      return result.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
    }
    if (options.sortOrder === SaveSortOrderId.NAME_ASCENDING) {
      return result.sort((a, b) => (a.name > b.name ? 1 : -1));
    }
    if (options.sortOrder === SaveSortOrderId.NAME_DESCENDING) {
      return result.sort((a, b) => (a.name < b.name ? 1 : -1));
    }
  }

  filterAndSortSaveHeaders(): void {
    this.filteredAndSortedSaveHeaders = this.getFilteredAndSortedSaveHeaders();
    this.deselectSaveHeaderIfFilteredOut();
  }

  get selectedSaveHeader(): SaveHeader {
    return this.saveHeaders.find(s => s.uuid === this.selectedSaveUuid);
  }

  isSaveGameHeaderSelected(saveHeader: SaveHeader): boolean {
    return this.selectedSaveHeader && saveHeader.uuid === this.selectedSaveHeader.uuid;
  }

  onSaveHeaderClick(uuid: Uuid): void {
    this.selectedSaveUuid = uuid;
  }

  onSaveHeaderDblClick(): void {
    this.loadSelectedAndUpdateUi();
  }

  onDeleteClick(): void {
    if (!this.selectedSaveHeader) {
      return;
    }
    this.saveService.delete(this.selectedSaveUuid);
    this.selectedSaveUuid = undefined;
  }

  onLoadGameClick(): void {
    if (!this.selectedSaveHeader) {
      return;
    }
    this.loadSelectedAndUpdateUi();
  }

  loadSelectedAndUpdateUi(): void {
    this.saveService.load(this.selectedSaveUuid);
    this.selectedSaveUuid = undefined;
    this.uiStore.toggleModal(ModalId.LOAD_GAME);
    this.uiStore.setScreen(ScreenId.GAMEPLAY);
  }
}
