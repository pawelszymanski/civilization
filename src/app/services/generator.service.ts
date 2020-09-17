import {Injectable} from '@angular/core';

import {Millisecond, Timestamp, Uuid} from '../models/utils';

@Injectable({providedIn: 'root'})
export class GeneratorService {

  public uuid(): Uuid {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  public nowMilliseconds(): Millisecond {
    return (new Date()).getTime() as Millisecond;
  }

  public nowIsoString(): Timestamp {
    return (new Date().toISOString()) as Timestamp;
  }

  public randomPositiveInteger(range: number): number {
    return Math.ceil(Math.random() * range);
  }

}
