import {Pipe, PipeTransform} from '@angular/core';

import {TerrainBaseId} from '../models/game-map/terrain';

@Pipe({name: 'terrainBaseName'})
export class TerrainBaseNamePipe implements PipeTransform {
  transform(terrainBaseId: TerrainBaseId): string {
    return TerrainBaseId[terrainBaseId]
      .toLowerCase()
      .replace('_hills', ' (hills)')
      .replace('_mountain', ' (mountain)');
  }
}
