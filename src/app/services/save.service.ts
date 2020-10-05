import {Injectable, NgZone} from '@angular/core';

import {Save, SaveData, SaveHeader} from '../models/saves';
import {Uuid} from '../models/utils';

import {LocalStorageService} from './local-storage.service';
import {TileYieldService} from './tile-yield.service';
import {ZipService} from './zip.service';

import {GameplayUiStore} from '../stores/gameplay-ui.store';
import {CameraStore} from '../stores/camera.store';
import {MapStore} from '../stores/map.store';
import {SaveHeadersStore} from '../stores/save-headers.store';

@Injectable({providedIn: 'root'})
export class SaveService {

  private readonly LOCAL_STORAGE_SAVE_PREFIX = 'Save-';

  constructor(
    private localStorageService: LocalStorageService,
    private tileYieldService: TileYieldService,
    private zipService: ZipService,
    private gameplayUiStore: GameplayUiStore,
    private cameraStore: CameraStore,
    private mapStore: MapStore,
    private saveHeadersStore: SaveHeadersStore,
    private ngZone: NgZone,
  ) {}

  private extractSaveHeader(save: Save): SaveHeader {
    return {
      name: save.name,
      uuid: save.uuid,
      timestamp: save.timestamp,
      isAutosave: save.isAutosave,
    }
  }

  private extractSaveData(save: Save): SaveData {
    return {
      gameplayUi: save.gameplayUi,
      camera: save.camera,
      map: save.map,
    }
  }

  private stripCalculatedData(saveData: SaveData) {
    for (const tile of saveData.map.tiles) {
      delete tile.isVisible;
      delete tile.px;
      delete tile.yield;
    }
  }

  public save(save: Save): void {
    const saveHeader = this.extractSaveHeader(save);
    this.saveHeadersStore.add(saveHeader);

    const saveData = this.extractSaveData(save);
    this.stripCalculatedData(saveData);

    const worker = new Worker('./../workers/zip.worker', {type: 'module'})
    worker.postMessage(saveData);

    worker.onmessage = (message) => {
      const key = this.LOCAL_STORAGE_SAVE_PREFIX + save.uuid;
      const zippedSaveData = message.data;
      this.localStorageService.set(key, zippedSaveData);
    }
  }

  // Used in Load Game modal and Main Menu component
  public load(saveUuid: Uuid): void {
    const key = this.LOCAL_STORAGE_SAVE_PREFIX + saveUuid;
    const zippedSave = this.localStorageService.get(key);
    const saveData = this.zipService.unzip(zippedSave) as SaveData;
    this.gameplayUiStore.next(saveData.gameplayUi);
    this.cameraStore.next(saveData.camera);
    this.mapStore.next(saveData.map);
  }

  public delete(saveUuid: Uuid): void {
    this.saveHeadersStore.remove(saveUuid);
    const key = this.LOCAL_STORAGE_SAVE_PREFIX + saveUuid;
    this.localStorageService.remove(key);
  }

}
