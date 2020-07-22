import {Component, Input} from '@angular/core';

import {Yield, YieldId, YieldOfType, YIELD_IDS_IN_ORDER} from '../../models/yield';

import {YIELD_ICONS} from '../../consts/yield-icons.const';

@Component({
  selector: 'yield',
  templateUrl: './yield.component.html',
  styleUrls: ['./yield.component.sass']
})
export class YieldComponent {

  @Input() yield: Yield;

  iconCssClasses: YieldId[][];

  private extractYieldOfType(yieldId: YieldId): YieldOfType {
    return {type: yieldId, value: this.yield[yieldId]};
  }

  private filterOutZeroYields(yieldOfType: YieldOfType): boolean {
    return yieldOfType.value > 0;
  }

  private yieldToIconCssClasses(yieldOfType: YieldOfType): YieldId[] {
    return new Array(yieldOfType.value).fill('fa ' + YIELD_ICONS[yieldOfType.type]);
  }

  ngOnChanges() {
    this.iconCssClasses = YIELD_IDS_IN_ORDER
      .map( yieldId => this.extractYieldOfType(yieldId) )
      .filter( yieldOfType => this.filterOutZeroYields(yieldOfType) )
      .map( yieldOfType => this.yieldToIconCssClasses(yieldOfType) )
  }

}
