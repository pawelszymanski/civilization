import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import {Tile} from '../models/map';

@Injectable()
export class WorldBuilderHoveredTilesStore {

  private _wbHoveredTiles: BehaviorSubject<Tile[]> = new BehaviorSubject([]);

  public readonly wbHoveredTiles: Observable<Tile[]> = this._wbHoveredTiles.asObservable();

  public next(hoveredTiles: Tile[]) {
    this._wbHoveredTiles.next(hoveredTiles);
  }

}
