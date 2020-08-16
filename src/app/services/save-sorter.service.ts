import {Injectable} from '@angular/core';

import {Save} from '../models/saves/save';
import {SaveListOptions} from '../models/saves/save-list-options';
import {SortOrderId} from '../models/sort-order';

@Injectable({providedIn: 'root'})
export class SaveSorterService {

  getFilteredAndSortedSaves(saves: Save[], options: SaveListOptions): Save[] {
    let result = [...saves];

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

}
