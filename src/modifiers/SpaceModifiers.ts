import { Memo } from '../Interfaces/Memo';

/** TODO: change modifier interface to matrix output (prev, next states for animation) **/
export class SpaceModifiers {
  static setPositionGrid(
    elements: Map<string, Memo>,
    colLimit: number = 10,
    cellWidth: number = 300,
    cellHeight: number = 100,
    scale: number = 1,
  ) {
    let col = 0;
    let row = 0;
    let idx = 0;
    elements.forEach((el) => {
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

      el.x = x;
      el.y = y;
      el.scale = scale;

      idx++;
    });
  }
}
