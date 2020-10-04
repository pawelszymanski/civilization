import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import {SaveHeader} from '../models/saves';

import {LocalStorageService} from '../services/local-storage.service';
import {TileYieldService} from '../services/tile-yield.service';
import {ZipService} from '../services/zip.service';

@Injectable()
export class SaveHeadersStore {

  private readonly LOCAL_STORAGE_SAVE_HEADERS_KEY = 'Saves';

  private _saveHeaders: BehaviorSubject<SaveHeader[]> = new BehaviorSubject([]);

  public readonly saveHeaders: Observable<SaveHeader[]> = this._saveHeaders.asObservable();

  constructor(
    private localStorageService: LocalStorageService,
    private tileYieldService: TileYieldService,
    private zipService: ZipService,
  ) {
    this.getLocalSaveHeaders();
  }

  private getLocalSaveHeaders() {
    const data = this.localStorageService.get(this.LOCAL_STORAGE_SAVE_HEADERS_KEY);
    if (data) {
      const saveIds = this.zipService.unzip(data) as SaveHeader[];
      this.next(saveIds);
    }
  }

  private persistSaveHeaders() {
    const saveIdsZipped = this.zipService.zip(this._saveHeaders.value);
    this.localStorageService.set(this.LOCAL_STORAGE_SAVE_HEADERS_KEY, saveIdsZipped);
  }

  private next(saveHeaders: SaveHeader[]) {
    this._saveHeaders.next(saveHeaders);
  }

  public add(saveHeader: SaveHeader): void {
    this._saveHeaders.next(this._saveHeaders.value.concat(saveHeader));
    this.persistSaveHeaders();
  }

  public remove(saveUuid: string): void {
    this._saveHeaders.next(this._saveHeaders.value.filter(save => save.uuid !== saveUuid));
    this.persistSaveHeaders();
  }

}
