import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import {GameplayUi, TileInfoOverlayId, TileResourceOverlayId} from '../models/gameplay-ui';

import {DEFAULT_GAMEPLAY_UI} from '../consts/gameplay-ui.const';

@Injectable()
export class GameplayUiStore {

  private _gameplayUi: BehaviorSubject<GameplayUi> = new BehaviorSubject(DEFAULT_GAMEPLAY_UI);

  public readonly gameplayUi: Observable<GameplayUi> = this._gameplayUi.asObservable();

  public next(gameplayUi: GameplayUi) {
    this._gameplayUi.next(gameplayUi);
  }

  public toggleGrid() {
    this._gameplayUi.next({...this._gameplayUi.value, showGrid: !this._gameplayUi.value.showGrid});
  }

  public toggleMinimap() {
    this._gameplayUi.next({...this._gameplayUi.value, showMinimap: !this._gameplayUi.value.showMinimap});
  }

  public toggleTileInfoOverlay(tileInfoOverlayId: TileInfoOverlayId) {
    const newTileInfoOverlayId = this._gameplayUi.value.infoOverlay === tileInfoOverlayId ? TileInfoOverlayId.NONE : tileInfoOverlayId;
    this._gameplayUi.next({...this._gameplayUi.value, infoOverlay: newTileInfoOverlayId});
  }

  public toggleTileResourceOverlay(tileResourceOverlayId: TileResourceOverlayId) {
    const newTileResourceOverlayId = this._gameplayUi.value.resourceOverlay === tileResourceOverlayId ? TileResourceOverlayId.NONE : tileResourceOverlayId;
    this._gameplayUi.next({...this._gameplayUi.value, resourceOverlay: newTileResourceOverlayId});
  }

}
