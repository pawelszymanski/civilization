import {Component, ChangeDetectionStrategy, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Subscription} from 'rxjs';

@Component({
  selector: '.widget-component',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  constructor() {}

  // INIT

  ngOnInit(): void {
    this.subscribeToData();
  }

  ngOnDestroy(): void {
    this.unsubscribeFromData();
  }

  subscribeToData(): void {
    this.subscriptions.push(
      // TODO
    );
  }

  unsubscribeFromData(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}