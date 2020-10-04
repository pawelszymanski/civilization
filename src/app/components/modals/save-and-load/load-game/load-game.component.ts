import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';

import {Save, SaveSortOrderId} from '../../../../models/saves';
import {Uuid} from '../../../../models/utils';
import {ModalId, ScreenId} from '../../../../models/ui';

import {GeneratorService} from '../../../../services/generator.service';
import {SaveService} from '../../../../services/save.service';

import {CameraStore} from '../../../../stores/camera.store';
import {MapStore} from '../../../../stores/map.store';
import {GameplayUiStore} from '../../../../stores/gameplay-ui.store';
import {SavesStore} from '../../../../stores/saves.store';
import {UiStore} from '../../../../stores/ui.store';

@Component({
  selector: '.load-game-component',
  templateUrl: './load-game.component.html',
  styleUrls: ['./load-game.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoadGameComponent implements OnInit, OnDestroy {

  SaveSortOrderId = SaveSortOrderId;

  saves: Save[] = [];
  filteredAndSortedSaves: Save[] = [];
  selectedSaveUuid: Uuid;

  saveListOptionsForm = new FormGroup({
    showAutosaves: new FormControl(false),
    sortOrder: new FormControl(SaveSortOrderId.NAME_ASCENDING)
  });

  subscriptions: Subscription[] = [];

  constructor(
    private generatorService: GeneratorService,
    private saveService: SaveService,
    private cameraStore: CameraStore,
    private mapStore: MapStore,
    private gameplayUiStore: GameplayUiStore,
    private savesStore: SavesStore,
    private uiStore: UiStore
  ) {}

  ngOnInit() {
    this.subscribeToData();
  }

  ngOnDestroy() {
    this.unsubscribeFromData();
  }

  subscribeToData() {
    this.subscriptions.push(
      this.savesStore.saves.subscribe(saves => { this.saves = saves; this.filterAndSortSaves(); }),
      this.saveListOptionsForm.valueChanges.subscribe(() => this.filterAndSortSaves())
    );
  }

  unsubscribeFromData() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  deselectSaveIfFilteredOut() {
    if (this.selectedSaveUuid && !this.filteredAndSortedSaves.find(save => save.uuid === this.selectedSaveUuid)) {
      this.selectedSaveUuid = null;
    }
  }

  filterAndSortSaves() {
    this.filteredAndSortedSaves = this.saveService.getFilteredAndSortedSaves(this.saves, this.saveListOptionsForm.value);
    this.deselectSaveIfFilteredOut();
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

  onSaveGameItemDblClick() {
    this.loadSelectedSaveAndUpdateUi();
  }

  onDeleteClick() {
    if (!this.selectedSave) { return; }
    this.savesStore.removeSave(this.selectedSaveUuid);
    this.selectedSaveUuid = undefined;
  }

  onLoadGameClick() {
    if (!this.selectedSave) { return; }
    this.loadSelectedSaveAndUpdateUi();
  }

  loadSelectedSaveAndUpdateUi() {
    const saveToBeLoaded = this.saves.find(save => save.uuid === this.selectedSaveUuid);
    this.saveService.loadSave(saveToBeLoaded);
    this.selectedSaveUuid = undefined;
    this.uiStore.toggleModal(ModalId.LOAD_GAME);
    this.uiStore.setScreen(ScreenId.GAMEPLAY);
  }

}

// ngOnInit() {
//   const saves$ = this.savesStore.saves;
//   const form$ = this.loadGameOptionsForm.valueChanges.pipe(
//     startWith(null)
//   );
//
//   const filteredSaves$ = combineLatest(saves$, form$).subscribe( ([saves, form]) =>
//     console.info(saves, form)
//   );
//
//
//   this.savesStore.saves.subscribe(saves => {
//     this.saves = saves;
//     this.filterAndSortSaves();
//   });
//
//   this.loadGameOptionsForm.valueChanges.pipe(
//     startWith(null)
//   )
//     .subscribe(() => {
//       this.filterAndSortSaves();
//     });
// }
