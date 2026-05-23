import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  standalone: false,
  selector: '.dev-tools-component',
  templateUrl: './dev-tools.component.html',
  styleUrls: ['./dev-tools.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DevToolsComponent {}
