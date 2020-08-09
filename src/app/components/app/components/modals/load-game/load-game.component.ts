import {Component, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

import {SortOrderId} from '../../../../../models/sort-order';
import {Save} from '../../../../../models/save';
import {Uuid} from '../../../../../models/utils/uuid';
import {ModalId} from '../../../../../models/ui/ui';

import {GameMapStore} from '../../../../../stores/game-map.store';
import {SavesStore} from '../../../../../stores/saves.store';
import {UiStore} from '../../../../../stores/ui.store';

interface LoadGameOptionsForm {
  showAutosaves: boolean;
  sortOrder: SortOrderId;
}

@Component({
  selector: '.load-game-component',
  templateUrl: './load-game.component.html',
  styleUrls: ['./load-game.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoadGameComponent {

  SortOrderId = SortOrderId;

  saves: Save[] = [];
  filteredAndSortedSaves: Save[] = [];
  selectedSaveUuid: Uuid;

  loadGameOptionsForm = new FormGroup({
    showAutosaves: new FormControl(false),
    sortOrder: new FormControl(SortOrderId.NAME_ASCENDING)
  });

  constructor(
    private gameMapStore: GameMapStore,
    private savesStore: SavesStore,
    private uiStore: UiStore
  ) {}

  getFilteredAndSortedSaves(): Save[] {
    const options: LoadGameOptionsForm = this.loadGameOptionsForm.value;
    let result = [...this.saves];

    if (!options.showAutosaves) {
      result = result.filter(save => !save.isAutosave)
    }

    if (options.sortOrder == SortOrderId.DATE_ASCENDING) {
      return result.sort((a, b) => a.timestamp > b.timestamp ? 1 : -1);
    }
    if (options.sortOrder == SortOrderId.DATE_DESCENDING) {
      return result.sort((a, b) => a.timestamp < b.timestamp ? 1 : -1);
    }
    if (options.sortOrder == SortOrderId.NAME_ASCENDING) {
      return result.sort((a, b) => a.name > b.name ? 1 : -1);
    }
    if (options.sortOrder == SortOrderId.NAME_DESCENDING) {
      return result.sort((a, b) => a.name < b.name ? 1 : -1);
    }
  }

  deselectSaveIfFilteredOut() {
    if (this.selectedSaveUuid && !this.filteredAndSortedSaves.find(save => save.uuid === this.selectedSaveUuid)) {
      this.selectedSaveUuid = null;
    }
  }

  filterAndSortSaves() {
    this.filteredAndSortedSaves = this.getFilteredAndSortedSaves();
    this.deselectSaveIfFilteredOut();
  }

  ngOnInit() {
    this.savesStore.saves.subscribe(saves => {
      this.saves = saves;
      this.filterAndSortSaves();
    });

    this.loadGameOptionsForm.valueChanges.subscribe(() => this.filterAndSortSaves());
  }

  get selectedSave(): Save {
    return this.saves.find(s => s.uuid === this.selectedSaveUuid);
  }

  isSaveGameItemSelected(save: Save): boolean {
    return this.selectedSave && save.uuid === this.selectedSave.uuid;
  }

  onSaveGameItemClick(uuid: Uuid) {
    this.selectedSaveUuid = uuid;
  }

  onDeleteClick() {
    if (!this.selectedSave) { return; }
    this.savesStore.removeSave(this.selectedSaveUuid);
    this.selectedSaveUuid = undefined;
  }

  onLoadGameClick() {
    if (!this.selectedSave) { return; }
    const saveToBeLoaded = this.saves.find(save => save.uuid === this.selectedSaveUuid);
    this.gameMapStore.next(saveToBeLoaded.gameMap);
    this.selectedSaveUuid = undefined;
    this.uiStore.toggleModal(ModalId.LOAD_GAME);
    this.uiStore.hideMainMenu();
  }

}
