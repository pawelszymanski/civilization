import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import {MapUi, TileInfoOverlayId, TileResourceOverlayId} from '../models/map-ui';

import {DEFAULT_MAP_UI} from '../consts/map-ui.const';

@Injectable()
export class MapUiStore {

  private _mapUi: BehaviorSubject<MapUi> = new BehaviorSubject(DEFAULT_MAP_UI);

  public readonly mapUi: Observable<MapUi> = this._mapUi.asObservable();

  public next(mapUi: MapUi) {
    this._mapUi.next(mapUi);
  }

  public toggleGrid() {
    this._mapUi.next({...this._mapUi.value, showGrid: !this._mapUi.value.showGrid});
  }

  public toggleTileInfoOverlay(tileInfoOverlayId: TileInfoOverlayId) {
    const newTileInfoOverlayId = this._mapUi.value.infoOverlay === tileInfoOverlayId ? TileInfoOverlayId.NONE : tileInfoOverlayId;
    this._mapUi.next({...this._mapUi.value, infoOverlay: newTileInfoOverlayId});
  }

  public toggleTileResourceOverlay(tileResourceOverlayId: TileResourceOverlayId) {
    const newTileResourceOverlayId = this._mapUi.value.resourceOverlay === tileResourceOverlayId ? TileResourceOverlayId.NONE : tileResourceOverlayId;
    this._mapUi.next({...this._mapUi.value, resourceOverlay: newTileResourceOverlayId});
  }

}
