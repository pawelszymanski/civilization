import {Pipe, PipeTransform} from '@angular/core';

import {EraId} from '../models/era';

@Pipe({name: 'eraName'})
export class EraNamePipe implements PipeTransform {

  transform(eraId: EraId): string {
    return EraId[eraId].toLowerCase() + ' era';
  }

}
