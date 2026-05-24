import { Pipe, PipeTransform } from '@angular/core';

import { CivicId } from '../models/civics';

@Pipe({ standalone: false, name: 'civicName' })
export class CivicNamePipe implements PipeTransform {
  transform(civicId: CivicId): string {
    return CivicId[civicId].toLowerCase().replace(/_/gi, ' ');
  }
}
