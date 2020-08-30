import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import {GameMap, GameMapTile} from '../models/game-map/game-map';

import {GameMapHelperService} from '../services/game-map/game-map-helper.service';

@Injectable()
export class GameMapStore {

  private _gameMap: BehaviorSubject<GameMap> = new BehaviorSubject(undefined);

  public readonly gameMap: Observable<GameMap> = this._gameMap.asObservable();

  constructor(
    private gameMapHelperService: GameMapHelperService,
  ) {}

  public next(gameMap: GameMap) {
    // TODO: for during development, remove later
    // gameMap.rows.forEach(row => row.tiles.forEach(tile => this.updateTile(tile)))
    this._gameMap.next(gameMap);
  }

  // private updateTile(tile: GameMapTile) {
  //   tile.cssClasses = this.gameMapHelperService.calcTileCssClasses(tile);
  //   tile.yield = this.gameMapHelperService.calcTileYield(tile);
  // }

}
