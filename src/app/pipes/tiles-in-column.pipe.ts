import {Pipe, PipeTransform} from '@angular/core';

import {Map, Tile} from '../models/map';

@Pipe({name: 'tilesInColumn'})
export class TilesInColumnPipe implements PipeTransform {

  // column is 1-indexed
  transform(map: Map, column: number): Tile[] {
    const start = (column - 1) * map.height;
    const end = column * map.height;
    return map.tiles.slice(start, end);
  }

}
