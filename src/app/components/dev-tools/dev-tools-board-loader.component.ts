import {Component} from '@angular/core';

import {PREDEFINED_BOARDS} from '../../consts/predefined-boards.const';

import {BoardStore} from '../../stores/board.store';

@Component({
  selector: 'dev-tools-board-loader',
  templateUrl: './dev-tools-board-loader.component.html'
})
export class DevToolsBoardLoaderComponent {

  readonly PREDEFINED_BOARDS = PREDEFINED_BOARDS;

  predefinedBoardName: string;

  constructor(
    private boardStore: BoardStore
  ) {}

  onLoadBoardClick() {
    const predefinedBoard = PREDEFINED_BOARDS.find(board => board.name === this.predefinedBoardName);
    this.boardStore.setBoard(predefinedBoard.board);
  }

}
