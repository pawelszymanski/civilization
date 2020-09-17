import {Injectable} from '@angular/core';

import {Tile} from '../models/map';

@Injectable({providedIn: 'root'})
export class TileService {

  public isTileInOddRow(tile: Tile): boolean {
    return tile.coords.y % 2 === 1;
  }

}
