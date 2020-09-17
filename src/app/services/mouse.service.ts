import {Injectable} from '@angular/core';

import {Step} from '../models/utils';

@Injectable({providedIn: 'root'})
export class MouseService {

  // +1 for zooming in (roll forward), -1 for zooming out (roll backward)
  public wheelEventToStep(wheelEvent: WheelEvent): Step {
    return -(Math.abs(wheelEvent.deltaY) / wheelEvent.deltaY) as Step;
  }

}
