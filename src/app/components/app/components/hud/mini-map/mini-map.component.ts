import {Component, ElementRef, ViewChild, ViewEncapsulation} from '@angular/core';

import {GameMap} from '../../../../../models/game-map/game-map';

import {GameMapStore} from '../../../../../stores/game-map.store';

@Component({
  selector: '.mini-map-component',
  templateUrl: './mini-map.component.html',
  styleUrls: ['./mini-map.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MiniMapComponent {

  readonly CANVAS = {
    width: 240,
    height: 160
  }

  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;

  ctx: CanvasRenderingContext2D;

  constructor(
    private gameMapStore: GameMapStore
  ) {}

  ngOnInit() {
    this.initContext();
    this.subscribeToData();
  }

  initContext() {
    this.ctx = this.canvas.nativeElement.getContext('2d')
  }

  subscribeToData() {
    this.gameMapStore.gameMap.subscribe(gameMap =>
      this.drawMinimap(gameMap)
    );
  }

  drawMinimap(gameMap: GameMap) {
    this.ctx.clearRect(0, 0, this.CANVAS.width, this.CANVAS.height);

    this.ctx.fillStyle = 'gray';
    this.ctx.fillRect(0, 0, this.CANVAS.width, this.CANVAS.height);
    // this.drawTiles();
    // this.drawViewport();
  }

}

// this.ctx.beginPath();
// this.ctx.moveTo(0, CANVAS.HEIGHT * 0.25 + .5);
// this.ctx.lineTo(CANVAS.WIDTH, CANVAS.HEIGHT * 0.25 + .5);
// this.ctx.moveTo(0, CANVAS.HEIGHT * 0.50 + .5);
// this.ctx.lineTo(CANVAS.WIDTH, CANVAS.HEIGHT * 0.50 + .5);
// this.ctx.moveTo(0, CANVAS.HEIGHT * 0.75 + .5);
// this.ctx.lineTo(CANVAS.WIDTH, CANVAS.HEIGHT * 0.75 + .5);
// this.ctx.stroke();
//
// this.ctx.font = CANVAS.LEGEND_FONT;
// this.ctx.fillStyle = CANVAS.LEGEND_FILL_STYLE;
