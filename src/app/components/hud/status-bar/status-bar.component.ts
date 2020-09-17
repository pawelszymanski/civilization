import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Subscription} from 'rxjs';

import {YIELD_IDS_IN_ORDER, YIELD_ID_TO_ICON_CLASS_MAP} from '../../../consts/yield.const';

@Component({
  selector: '.status-bar-component',
  templateUrl: './status-bar.component.html',
  styleUrls: ['./status-bar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StatusBarComponent implements OnInit, OnDestroy {

  YIELD_IDS_IN_ORDER = YIELD_IDS_IN_ORDER;
  YIELD_ICONS = YIELD_ID_TO_ICON_CLASS_MAP;

  subscriptions: Subscription[] = [];

  ngOnInit() {
    this.subscribeToData();
  }

  ngOnDestroy() {
    this.unsubscribeFromData();
  }

  subscribeToData() {
    this.subscriptions.push(
      // ...
    );
  }

  unsubscribeFromData() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
