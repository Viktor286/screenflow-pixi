import { SnapShot } from './SnapShot';

interface IPoint {
  x: number;
  y: number;
}

export class SpaceModifiers {
  static positionGrid(
    elements: Array<IPoint | PIXI.Point | SnapShot>,
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
}
