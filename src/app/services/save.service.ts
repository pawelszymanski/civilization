import {Injectable} from '@angular/core';

import {Save, SaveListOptions, SaveSortOrderId} from '../models/saves';

@Injectable({providedIn: 'root'})
export class SaveService {

  getFilteredAndSortedSaves(saves: Save[], options: SaveListOptions): Save[] {
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

}
