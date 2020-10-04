// import {IPublicMemosState} from '../Interfaces/Memos'

import FlowApp from '../Interfaces/FlowApp';

// This is a temp way how modifiers work. Might be better to be encapsulated from app
/** TODO: change modifier interface to matrix output (prev, next states for animation) **/
export class SpaceModifiers {
  static setPositionGrid(
    app: FlowApp,
    colLimit: number = 10,
    cellWidth: number = 300,
    cellHeight: number = 100,
    scale: number = 1,
  ) {
    let col = 0;
    let row = 0;
    let idx = 0;

    const elements = app.board.state;

    for (let eId in elements) {
      if (Object.prototype.hasOwnProperty.call(elements, eId)) {
        const x = (idx % colLimit) * cellWidth;
        if (col >= colLimit) {
          col = 0;
          row++;
        }
        col++;
        const y = row * cellHeight;

        // Apply transforms
        // TODO: how would we access state here?
        //  we should return array of mutation orders
        //  instead of modifying origin here here

        app.actions.board.moveTo(eId, { wX: x, wY: y });
        app.actions.board.scaleTo(eId, scale);

        // elements[el].x = x;
        // elements[el].y = y;
        // elements[el].scale = scale;

        idx++;
      }
    }
  }
}
