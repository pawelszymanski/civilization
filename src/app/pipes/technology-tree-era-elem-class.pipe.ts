import {Pipe, PipeTransform} from '@angular/core';

import {TechnologyTreeEra} from '../models/research-tree';

@Pipe({name: 'technologyTreeEraElemClass'})
export class TechnologyTreeEraElemClassPipe implements PipeTransform {

  transform(technologyTreeEra: TechnologyTreeEra): string {
    const columns = technologyTreeEra.technologies
      .map(tech => tech.eraCoords.x)
      .sort()
      .pop() + 1;
    return `m-columns-${columns}`;
  }

}
