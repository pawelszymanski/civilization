import {Pipe, PipeTransform} from '@angular/core';

import {CivicId} from '../models/research/civic';

@Pipe({name: 'civicName'})
export class CivicNamePipe implements PipeTransform {
  transform(civicId: CivicId): string {
    return CivicId[civicId].toLowerCase().replace(/_/gi, ' ');
  }
}
