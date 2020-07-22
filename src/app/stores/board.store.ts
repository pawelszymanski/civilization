import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import {Board} from '../models/board';

@Injectable()
export class BoardStore {

  private _board: BehaviorSubject<Board> = new BehaviorSubject(undefined);

  public readonly board: Observable<Board> = this._board.asObservable();

  public setBoard(board: Board) {
    this._board.next(board);
  }

}
