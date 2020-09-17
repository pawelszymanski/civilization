import {Injectable} from '@angular/core';

import {Save, SaveListOptions, SaveSortOrderId} from '../models/saves';

import {MapStore} from '../stores/map.store';
import {MapUiStore} from '../stores/map-ui.store';
import {CameraStore} from '../stores/camera.store';

@Injectable({providedIn: 'root'})
export class SaveService {

  constructor(
    private mapStore: MapStore,
    private mapUiStore: MapUiStore,
    private cameraStore: CameraStore
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
  public loadSave(save: Save) {
    this.mapStore.next(save.map);
    this.mapUiStore.next(save.mapUi);
    this.cameraStore.next(save.camera);
  }

}
