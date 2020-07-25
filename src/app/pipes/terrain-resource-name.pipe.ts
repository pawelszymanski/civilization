import {Pipe, PipeTransform} from '@angular/core';

import {TerrainResourceId} from '../models/terrain';

@Pipe({name: 'terrainResourceName'})
export class TerrainResourceNamePipe implements PipeTransform {
  transform(terrainResourceId: TerrainResourceId): string {
    return terrainResourceId === TerrainResourceId.NONE ? '' :  TerrainResourceId[terrainResourceId].toLowerCase();
  }
}
