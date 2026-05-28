import { Injectable } from '@angular/core';

import { Millisecond, Timestamp, Uuid } from '../models/utils';

@Injectable({ providedIn: 'root' })
export class GeneratorService {
  public uuid(): Uuid {
    return crypto.randomUUID();
  }

  public nowMilliseconds(): Millisecond {
    return new Date().getTime() as Millisecond;
  }

  public nowIsoString(): Timestamp {
    return new Date().toISOString() as Timestamp;
  }

  public randomInteger(range: number): number {
    return Math.floor(Math.random() * range);
  }

  public randomPositiveInteger(range: number): number {
    return Math.ceil(Math.random() * range);
  }
}
