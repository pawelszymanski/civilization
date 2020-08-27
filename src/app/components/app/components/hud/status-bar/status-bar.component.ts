import {Component, ViewEncapsulation} from '@angular/core';

import {YIELD_ICONS} from '../../../../../consts/game-map/yield-icons.const';
import {YIELD_IDS_IN_ORDER} from '../../../../../consts/game-map/yields-in-order.const'

@Component({
  selector: '.status-bar-component',
  templateUrl: './status-bar.component.html',
  styleUrls: ['./status-bar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StatusBarComponent {

  YIELD_IDS_IN_ORDER = YIELD_IDS_IN_ORDER;
  YIELD_ICONS = YIELD_ICONS;

}
