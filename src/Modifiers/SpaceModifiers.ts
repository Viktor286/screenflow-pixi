// import {IPublicMemosState} from '../Interfaces/Memos'

import FlowApp from '../Interfaces/FlowApp';

// This is a temp way how Modifiers work. Might be better to be encapsulated from app
/** TODO: change modifier interface to matrix output (prev, next states for animation) **/
export class SpaceModifiers {
  static setPositionGrid(
    app: FlowApp,
    colLimit: number = 10,
    cellWidth: number = 300,
    cellHeight: number = 100,
    scale: number = 1,
  ) {
    // let col = 0;
    // let row = 0;
    // let idx = 0;
    //
    // const elements = app.board.getAllMemos();
    //
    // elements.forEach((memo) => {
    //   const x = (idx % colLimit) * cellWidth + cellWidth / 2;
    //   if (col >= colLimit) {
    //     col = 0;
    //     row++;
    //   }
    //   col++;
    //   const y = row * cellHeight + cellHeight / 2;
    //   // Apply transforms
    //   app.stateManager.setState(`board/${memo.id}`, { x, y, scale });
    //
    //   idx++;
    // });
  }
}
