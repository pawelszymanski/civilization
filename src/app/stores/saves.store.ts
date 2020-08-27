import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import {Save} from '../models/saves/save';

import {LocalStorageService} from '../services/utils/local-storage.service';

@Injectable()
export class SavesStore {

  private readonly LOCAL_STORAGE_KEY = 'Saves';

  private _saves: BehaviorSubject<Save[]> = new BehaviorSubject([]);

  public readonly saves: Observable<Save[]> = this._saves.asObservable();

  constructor(
    private localStorageService: LocalStorageService
  ) {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage() {
    const localSaves = this.localStorageService.get(this.LOCAL_STORAGE_KEY);
    if (localSaves) {
      this.next(JSON.parse(localSaves));
    }
  }

  private saveToLocalStorage() {
    this.localStorageService.set(this.LOCAL_STORAGE_KEY, JSON.stringify(this._saves.value));
  }

  private next(saves: Save[]) {
    this._saves.next(saves);
    this.saveToLocalStorage();
  }

  public addSave(save: Save) {
    this._saves.next(this._saves.value.concat(save));
    this.saveToLocalStorage();
  }

  public removeSave(uuid: string) {
    this._saves.next(this._saves.value.filter(save => save.uuid !== uuid));
    this.saveToLocalStorage();
  }

}
