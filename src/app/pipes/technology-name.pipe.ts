import {Pipe, PipeTransform} from '@angular/core';

import {TechnologyId} from '../models/technologies';

@Pipe({name: 'technologyName'})
export class TechnologyNamePipe implements PipeTransform {

  transform(technologyId: TechnologyId): string {
    return TechnologyId[technologyId].toLowerCase().replace(/_/gi, ' ');
  }

}
