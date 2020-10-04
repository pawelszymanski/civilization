import {Injectable} from '@angular/core';

import {Save, SaveListOptions, SaveSortOrderId} from '../models/saves';

import {GameplayUiStore} from '../stores/gameplay-ui.store';
import {CameraStore} from '../stores/camera.store';
import {MapStore} from '../stores/map.store';

@Injectable({providedIn: 'root'})
export class SaveService {

  constructor(
    private gameplayUiStore: GameplayUiStore,
    private cameraStore: CameraStore,
    private mapStore: MapStore,
  ) {}

  public getFilteredAndSortedSaves(saves: Save[], options: SaveListOptions): Save[] {
    let result = [...saves];

    if (!options.showAutosaves) {
      result = result.filter(save => !save.isAutosave)
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

  // Used in Load Game modal and Main Menu component
  public loadSave(save: Save): void {
    this.gameplayUiStore.next(save.gameplayUi);
    this.cameraStore.next(save.camera);
    this.mapStore.next(save.map);
  }

}
