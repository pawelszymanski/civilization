import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import {FullSize, HalfSize, QuarterSize, Size} from '../models/size';
import {Coords} from '../models/utils';

import {DEFAULT_SIZE} from '../consts/size.const';

@Injectable()
export class SizeStore {

  // tslint:disable-next-line:variable-name
  private _size: BehaviorSubject<Size> = new BehaviorSubject(DEFAULT_SIZE);

  public readonly size: Observable<Size> = this._size.asObservable();

  public next(sizeSet: Size): void {
    this._size.next(sizeSet);
  }

  public setTileSize(tileSize: FullSize & HalfSize & QuarterSize): void {
    this.next({...this._size.value, tile: tileSize});
  }

  public setRowSize(rowSize: FullSize): void {
    this.next({...this._size.value, row: rowSize});
  }

  public setMapSize(mapSize: FullSize): void {
    this.next({...this._size.value, map: mapSize});
  }

  public setVertices(vertices: Coords[]): void {
    this.next({...this._size.value, vertices});
  }

  public setScreenSize(screenSize: FullSize & HalfSize): void {
    this.next({...this._size.value, screen: screenSize});
  }

}
