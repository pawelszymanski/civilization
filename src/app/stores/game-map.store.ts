import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import {GameMap} from '../models/game-map';

@Injectable()
export class GameMapStore {

  private _gameMap: BehaviorSubject<GameMap> = new BehaviorSubject(undefined);

  public readonly gameMap: Observable<GameMap> = this._gameMap.asObservable();

  public setGameMap(gameMap: GameMap) {
    this._gameMap.next(gameMap);
  }

}
