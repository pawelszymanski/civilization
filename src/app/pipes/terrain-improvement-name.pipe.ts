import {Pipe, PipeTransform} from '@angular/core';

import {TerrainImprovementId} from '../models/terrain';

@Pipe({name: 'terrainImprovementName'})
export class TerrainImprovementNamePipe implements PipeTransform {
  transform(terrainImprovementId: TerrainImprovementId): string {
    if (!terrainImprovementId) { return ''; }
    // return terrainImprovementId === TerrainImprovementId.NONE ? '' :  TerrainImprovementId[terrainImprovementId].toLowerCase();
  }
}
