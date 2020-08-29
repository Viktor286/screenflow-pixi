import { Memo } from '../Interfaces/Memos';

/** TODO: change modifier interface to matrix output (prev, next states for animation) **/
export class SpaceModifiers {
  static setPositionGrid(
    elements: Memo[],
    colLimit: number = 10,
    cellWidth: number = 300,
    cellHeight: number = 100,
    scale: number = 1,
  ) {
    let col = 0;
    let row = 0;
    elements.forEach((el, idx) => {
      const x = (idx % colLimit) * cellWidth;
      if (col >= colLimit) {
        col = 0;
        row++;
      }
      col++;
      const y = row * cellHeight;

      el.x = x;
      el.y = y;
      el.scale.x = scale;
      el.scale.y = scale;

      idx++;
    });
  }
}
