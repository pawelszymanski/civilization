import {Pipe, PipeTransform} from '@angular/core';

import {TerrainImprovementId} from '../models/terrain';

@Pipe({name: 'terrainImprovementName'})
export class TerrainImprovementNamePipe implements PipeTransform {

  transform(terrainImprovementId: TerrainImprovementId): string {
    if (terrainImprovementId === TerrainImprovementId.NONE) { return ''; }
    return  TerrainImprovementId[terrainImprovementId].toLowerCase().replace('_', ' ');
  }

}
