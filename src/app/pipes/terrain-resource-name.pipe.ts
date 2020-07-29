import {Pipe, PipeTransform} from '@angular/core';

import {TerrainResourceId} from '../models/game-map/terrain';

@Pipe({name: 'terrainResourceName'})
export class TerrainResourceNamePipe implements PipeTransform {
  transform(terrainResourceId: TerrainResourceId): string {
    if (terrainResourceId === TerrainResourceId.NONE) { return ''; }
    return TerrainResourceId[terrainResourceId].toLowerCase();
  }
}
