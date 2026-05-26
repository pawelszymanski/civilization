import { Component, DestroyRef, OnInit, ViewEncapsulation } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Camera } from '../../../../models/camera';
import { Map } from '../../../../models/map';
import { GameplayUi } from '../../../../models/gameplay-ui';
import { Save } from '../../../../models/saves';

import { GeneratorService } from '../../../../services/generator.service';
import { SaveService } from '../../../../services/save.service';
import { LocalStorageService } from '../../../../services/local-storage.service';

import { CameraStore } from '../../../../stores/camera.store';
import { MapStore } from '../../../../stores/map.store';
import { GameplayUiStore } from '../../../../stores/gameplay-ui.store';
import { UiStore } from '../../../../stores/ui.store';

@Component({
  standalone: false,
  selector: '.save-game-component',
  templateUrl: './save-game.component.html',
  styleUrls: ['./save-game.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SaveGameComponent implements OnInit {
  saveName = '';

  map: Map;
  gameplayUi: GameplayUi;
  camera: Camera;

  usedStoragePc: number;

  constructor(
    private destroyRef: DestroyRef,
    private generatorService: GeneratorService,
    private saveService: SaveService,
    private localStorageService: LocalStorageService,
    private cameraStore: CameraStore,
    private mapStore: MapStore,
    private gameplayUiStore: GameplayUiStore,
    private uiStore: UiStore
  ) {}

  ngOnInit(): void {
    this.subscribeToData();
    this.getUsedLocalStorageSpace();
  }

  subscribeToData(): void {
    this.mapStore.map.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(map => (this.map = map));
    this.gameplayUiStore.gameplayUi.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(gameplayUi => (this.gameplayUi = gameplayUi));
    this.cameraStore.camera.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(camera => (this.camera = camera));
  }

  getUsedLocalStorageSpace(): void {
    this.usedStoragePc = this.localStorageService.getUsagePc();
  }

  canGameBeSaved(): boolean {
    return this.usedStoragePc < 100 && this.saveName && !!this.map;
  }

  onSaveGameClick(): void {
    if (!this.canGameBeSaved()) {
      return;
    }

    const save: Save = {
      name: this.saveName,
      uuid: this.generatorService.uuid(),
      timestamp: this.generatorService.nowIsoString(),
      isAutosave: false,
      gameplayUi: this.gameplayUi,
      camera: this.camera,
      map: this.map,
    };

    this.saveService.save(save);
    this.saveName = '';
    this.uiStore.closeModal();
  }
}
