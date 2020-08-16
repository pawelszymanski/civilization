import {Injectable} from '@angular/core';

import {Milliseconds} from '../models/utils/milliseconds';
import {Timestamp} from '../models/utils/timestamp';
import {Uuid} from '../models/utils/uuid';

@Injectable({providedIn: 'root'})
export class GeneratorService {

  public uuid(): Uuid {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  public nowMilliseconds(): Milliseconds {
    return (new Date()).getTime() as Milliseconds;
  }

  public nowIsoString(): Timestamp {
    return (new Date().toISOString()) as Timestamp;
  }

  public randomPositiveInteger(range: number): number {
    return Math.ceil(Math.random() * range);
  }

}
