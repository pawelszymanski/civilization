import {Component, Input, ViewEncapsulation} from '@angular/core';

import {GameMapTile} from '../../../../../models/game-map/game-map';

@Component({
  selector: '.tile-text-component',
  templateUrl: './tile-text.component.html',
  styleUrls: ['./tile-text.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TileTextComponent {

  @Input() tile: GameMapTile;

}
