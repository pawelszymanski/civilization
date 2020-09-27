import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import {FullSize, HalfSize, QuarterSize, Size} from '../models/size';
import {Coords} from '../models/utils';

import {DEFAULT_SIZE} from '../consts/size.const';

@Injectable()
export class SizeStore {

  private _size: BehaviorSubject<Size> = new BehaviorSubject(DEFAULT_SIZE);

  public readonly size: Observable<Size> = this._size.asObservable();

  public next(sizeSet: Size) {
    this._size.next(sizeSet);
  }

  public setTileSize(tileSize: FullSize & HalfSize & QuarterSize) {
    this.next({...this._size.value, tile: tileSize});
  }

  public setRowSize(rowSize: FullSize) {
    this.next({...this._size.value, row: rowSize});
  }

  public setMapSize(mapSize: FullSize) {
    this.next({...this._size.value, map: mapSize});
  }

  public setViewportSize(viewportSize: FullSize & HalfSize) {
    this.next({...this._size.value, viewport: viewportSize});
  }

  public setVertices(vertices: Coords[]) {
    this.next({...this._size.value, vertices: vertices});
  }

}
