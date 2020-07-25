import {Pipe, PipeTransform} from '@angular/core';

import {TerrainFeatureId} from '../models/terrain';

@Pipe({name: 'terrainFeatureName'})
export class TerrainFeatureNamePipe implements PipeTransform {
  transform(terrainFeatureId: TerrainFeatureId): string {
    return terrainFeatureId === TerrainFeatureId.NONE ? '' :  TerrainFeatureId[terrainFeatureId].toLowerCase();
  }
}
