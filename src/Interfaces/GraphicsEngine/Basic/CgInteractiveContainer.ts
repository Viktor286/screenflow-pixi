import * as PIXI from 'pixi.js';
import { CgContainer } from './CgContainer';

// TODO: implement events
export class CgInteractiveContainer extends CgContainer {
  // public isSelected = false;
  // public isDragging = false;
  // public startDragPoint: IPoint = { x: 0, y: 0 };
  // public dragPoint: IPoint = { x: 0, y: 0 };

  constructor(public cgObj: PIXI.Container = new PIXI.Container()) {
    super(cgObj);
  }

  public enableInteractive() {
    this.cgObj.interactive = true;
  }

  public disableInteractive() {
    this.cgObj.interactive = false;
  }

  // public onDrag = (delta: any) => {
  //   const mouseCoords = this.viewport.getWorldCoordsFromMouse();
  //   this.x = mouseCoords.wX - this.dragPoint.x;
  //   this.y = mouseCoords.wY - this.dragPoint.y;
  // };
  //
  // public startDrag(startPoint: IWorldCoords) {
  //   const { wX, wY } = startPoint;
  //   const { wX: iMx, wY: iMy } = this.viewport.getWorldCoordsFromMouse();
  //
  //   this.isDragging = true;
  //   this.startDragPoint = { x: wX, y: wY };
  //
  //   // Compensate mouse movement and start point
  //   this.x -= startPoint.wX - iMx;
  //   this.y -= startPoint.wY - iMy;
  //
  //   this.dragPoint = { x: iMx - this.x, y: iMy - this.y };
  //   this.engine.ticker.add(this.onDrag);
  // }
  //
  // public stopDrag() {
  //   this.isDragging = false;
  //   this.startDragPoint = { x: 0, y: 0 };
  //   this.dragPoint = { x: 0, y: 0 };
  //   this.engine.ticker.remove(this.onDrag);
  // }
}
