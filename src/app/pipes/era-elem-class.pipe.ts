import {Pipe, PipeTransform} from '@angular/core';

import {TechnologyTreeEra} from '../models/research-tree';
import {CivicTreeEra} from '../models/research-tree';

@Pipe({name: 'eraElemClass'})
export class EraElemClassPipe implements PipeTransform {

  transform(researchEra: TechnologyTreeEra | CivicTreeEra): string {
    const key = researchEra['technologies'] ? 'technologies' : 'civics';
    const columns = researchEra[key]
      .map(tech => tech.eraCoords.x)
      .sort()
      .pop() + 1;
    return `m-columns-${columns}`;
  }

}
