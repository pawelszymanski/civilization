import {Component, Input, ViewEncapsulation} from '@angular/core';

import {Yield, YieldId, YieldOfType} from '../../../../../models/game-map/yield';

import {YIELD_ICONS} from '../../../../../consts/game-map/yield-icons.const';
import {YIELD_IDS_IN_ORDER} from '../../../../../consts/game-map/yields-in-order.const';

@Component({
  selector: '.tile-yield-component',
  templateUrl: './tile-yield.component.html',
  styleUrls: ['./tile-yield.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TileYieldComponent {

  @Input() yield: Yield;

  iconCssClasses: string[][];

  private extractYieldOfType(yieldId: YieldId): YieldOfType {
    return {type: yieldId, count: this.yield[yieldId]};
  }

  private static filterOutZeroYields(yieldOfType: YieldOfType): boolean {
    return yieldOfType.count > 0;
  }

  // List of classes for icons, one big or multiple small ones:
  // - big: ['fa fa-2x fa-leaf m-count-5']
  // - small: ['fa fa-leaf', 'fa fa-leaf', 'fa fa-leaf']
  private static yieldToIconCssClasses(yieldOfType: YieldOfType): string[] {
    if (yieldOfType.count > 4) {
      return ['fa fa-2x ' + YIELD_ICONS[yieldOfType.type] + ` m-count-${yieldOfType.count}`];
    } else {
      return new Array(yieldOfType.count).fill('fa ' + YIELD_ICONS[yieldOfType.type]);
    }
  }

  ngOnChanges() {
    this.iconCssClasses = YIELD_IDS_IN_ORDER
      .map( yieldId => this.extractYieldOfType(yieldId) )
      .filter( yieldOfType => TileYieldComponent.filterOutZeroYields(yieldOfType) )
      .map( yieldOfType => TileYieldComponent.yieldToIconCssClasses(yieldOfType) )
  }

}
