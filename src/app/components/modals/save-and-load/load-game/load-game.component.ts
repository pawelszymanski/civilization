import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';

import {SaveHeader, SaveSortOrderId} from '../../../../models/saves';
import {Uuid} from '../../../../models/utils';
import {ModalId, ScreenId} from '../../../../models/ui';

import {GeneratorService} from '../../../../services/generator.service';
import {SaveService} from '../../../../services/save.service';

import {CameraStore} from '../../../../stores/camera.store';
import {MapStore} from '../../../../stores/map.store';
import {GameplayUiStore} from '../../../../stores/gameplay-ui.store';
import {SaveHeadersStore} from '../../../../stores/save-headers.store';
import {UiStore} from '../../../../stores/ui.store';

@Component({
  selector: '.load-game-component',
  templateUrl: './load-game.component.html',
  styleUrls: ['./load-game.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoadGameComponent implements OnInit, OnDestroy {

  SaveSortOrderId = SaveSortOrderId;

  saveHeaders: SaveHeader[] = [];
  filteredAndSortedSaveHeaders: SaveHeader[] = [];
  selectedSaveUuid: Uuid;

  saveHeaderListOptionsForm = new FormGroup({
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
    private saveHeadersStore: SaveHeadersStore,
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
      this.saveHeadersStore.saveHeaders.subscribe(saveHeaders => {
        this.saveHeaders = saveHeaders;
        this.filterAndSortSaveHeaders();
      }),
      this.saveHeaderListOptionsForm.valueChanges.subscribe(() => this.filterAndSortSaveHeaders())
    );
  }

  unsubscribeFromData() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  deselectSaveHeaderIfFilteredOut() {
    if (this.selectedSaveUuid && !this.filteredAndSortedSaveHeaders.find(sh => sh.uuid === this.selectedSaveUuid)) {
      this.selectedSaveUuid = null;
    }
  }

  getFilteredAndSortedSaveHeaders(): SaveHeader[] {
    let result = [...this.saveHeaders];

    const options = this.saveHeaderListOptionsForm.value;

    if (!options.showAutosaves) {
      result = result.filter(saveHeader => !saveHeader.isAutosave)
    }

    if (options.sortOrder == SaveSortOrderId.DATE_ASCENDING) {
      return result.sort((a, b) => a.timestamp > b.timestamp ? 1 : -1);
    }
    if (options.sortOrder == SaveSortOrderId.DATE_DESCENDING) {
      return result.sort((a, b) => a.timestamp < b.timestamp ? 1 : -1);
    }
    if (options.sortOrder == SaveSortOrderId.NAME_ASCENDING) {
      return result.sort((a, b) => a.name > b.name ? 1 : -1);
    }
    if (options.sortOrder == SaveSortOrderId.NAME_DESCENDING) {
      return result.sort((a, b) => a.name < b.name ? 1 : -1);
    }
  }

  filterAndSortSaveHeaders() {
    this.filteredAndSortedSaveHeaders = this.getFilteredAndSortedSaveHeaders();
    this.deselectSaveHeaderIfFilteredOut();
  }

  get selectedSaveHeader(): SaveHeader {
    return this.saveHeaders.find(s => s.uuid === this.selectedSaveUuid);
  }

  isSaveGameHeaderSelected(saveHeader: SaveHeader): boolean {
    return this.selectedSaveHeader && saveHeader.uuid === this.selectedSaveHeader.uuid;
  }

  onSaveHeaderClick(uuid: Uuid) {
    this.selectedSaveUuid = uuid;
  }

  onSaveHeaderDblClick() {
    this.loadSelectedAndUpdateUi();
  }

  onDeleteClick() {
    if (!this.selectedSaveHeader) { return; }
    this.saveService.delete(this.selectedSaveUuid);
    this.selectedSaveUuid = undefined;
  }

  onLoadGameClick() {
    if (!this.selectedSaveHeader) { return; }
    this.loadSelectedAndUpdateUi();
  }

  loadSelectedAndUpdateUi() {
    this.saveService.load(this.selectedSaveUuid);
    this.selectedSaveUuid = undefined;
    this.uiStore.toggleModal(ModalId.LOAD_GAME);
    this.uiStore.setScreen(ScreenId.GAMEPLAY);
  }

}

// ngOnInit() {
//   const saves$ = this.saveHeadersStore.saves;
//   const form$ = this.loadGameOptionsForm.valueChanges.pipe(
//     startWith(null)
//   );
//
//   const filteredSaves$ = combineLatest(saves$, form$).subscribe( ([saves, form]) =>
//     console.info(saves, form)
//   );
//
//
//   this.saveHeadersStore.saves.subscribe(saves => {
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
