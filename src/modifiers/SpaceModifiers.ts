import { SnapShotContainer } from '../interfaces/SnapShot';

interface IPoint {
  x: number;
  y: number;
}

export class SpaceModifiers {
  static positionGrid(
    elements: Array<IPoint | PIXI.Point | SnapShotContainer>,
    colAmount: number = 10,
    gridWidth: number = 300,
    rowHeight: number = 100,
  ) {
    let c = 0;
    let r = 0;
    elements.forEach((el, idx) => {
      el.x = (idx % colAmount) * gridWidth;
      if (c >= colAmount) {
        c = 0;
        r++;
      }
      c++;
      el.y = r * rowHeight;
      idx++;
    });
  }

  static transformPositionGrid(
    elements: SnapShotContainer[],
    colLimit: number = 10,
    cellWidth: number = 300,
    cellHeight: number = 100,
    scale: number,
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
      el.setTransform(x, y, scale || el.scale.x, scale || el.scale.y);
      idx++;
    });
  }
}
