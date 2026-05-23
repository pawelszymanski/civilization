import {Pipe, PipeTransform} from '@angular/core';

import {CivicTreeEra} from '../models/research-tree';

@Pipe({standalone: false, name: 'civicTreeEraElemClass'})
export class CivicTreeEraElemClassPipe implements PipeTransform {

  transform(civicTreeEra: CivicTreeEra): string {
    const columns = civicTreeEra.civics
      .map(tech => tech.eraCoords.x)
      .sort()
      .pop() + 1;
    return `m-columns-${columns}`;
  }

}
