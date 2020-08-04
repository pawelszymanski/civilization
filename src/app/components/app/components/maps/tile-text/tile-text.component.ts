import {Component, Input} from '@angular/core';

import {GameMapTile} from '../../../../../models/game-map/game-map';

@Component({
  selector: 'tile-text',
  templateUrl: './tile-text.component.html',
  styleUrls: ['./tile-text.component.sass']
})
export class TileTextComponent {

  @Input() tile: GameMapTile;

}
