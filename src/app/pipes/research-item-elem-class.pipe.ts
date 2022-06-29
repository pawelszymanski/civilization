import {Pipe, PipeTransform} from '@angular/core';

import {CivicIdWithEraCoords, TechnologyIdWithEraCoords} from '../models/research-tree';

@Pipe({name: 'researchItemElemClass'})
export class ResearchItemElemClassPipe implements PipeTransform {

  transform(research: TechnologyIdWithEraCoords | CivicIdWithEraCoords): string {
    return `m-offset-${research.eraCoords.x}-${research.eraCoords.y}`;
  }

}
