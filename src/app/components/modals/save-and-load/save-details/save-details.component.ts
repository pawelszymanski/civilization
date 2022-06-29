import {Component, ViewEncapsulation, Input} from '@angular/core';

import {Save} from '../../../../models/saves';

@Component({
  selector: '.save-details-component',
  templateUrl: './save-details.component.html',
  styleUrls: ['./save-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SaveDetailsComponent {

  @Input() save: Save;

}
