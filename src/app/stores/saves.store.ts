import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import {Save} from '../models/saves';

import {LocalStorageService} from '../services/local-storage.service';
import {TileYieldService} from '../services/tile-yield.service';
import {ZipService} from '../services/zip.service';

@Injectable()
export class SavesStore {

  private readonly LOCAL_STORAGE_KEY = 'Saves';

  private _saves: BehaviorSubject<Save[]> = new BehaviorSubject([]);

  public readonly saves: Observable<Save[]> = this._saves.asObservable();

  constructor(
    private localStorageService: LocalStorageService,
    private tileYieldService: TileYieldService,
    private zipService: ZipService,
  ) {
    this.loadFromLocalStorageIfExisting();
  }

  private loadFromLocalStorageIfExisting() {
    const localData = this.localStorageService.get(this.LOCAL_STORAGE_KEY);
    if (localData) {
      const saves = this.zipService.unzip(localData) as Save[];
      this.next(saves);
    }
  }

  private saveToLocalStorage() {
    const savesArchive = this.zipService.zip(this._saves.value);
    this.localStorageService.set(this.LOCAL_STORAGE_KEY, savesArchive);
  }

  private next(saves: Save[]) {
    this._saves.next(saves);
  }

  public addSave(save: Save): void {
    this._saves.next(this._saves.value.concat(save));
    this.saveToLocalStorage();
  }

  public removeSave(uuid: string): void {
    this._saves.next(this._saves.value.filter(save => save.uuid !== uuid));
    this.saveToLocalStorage();
  }

}
