import * as PIXI from 'pixi.js';
import { IPoint } from '../../../types/global';

export class CgBaseObject {
  isScaleFromCenter = false;
  dummy = new PIXI.Graphics();

  constructor(public cgObj: PIXI.Container = new PIXI.Container()) {
    // this.initDummyGraphics();
  }

  destroy() {
    this.cgObj.destroy();
  }

  get x() {
    return this.cgObj.x;
  }

  set x(val: number) {
    this.cgObj.x = val;
  }

  get y() {
    return this.cgObj.y;
  }

  set y(val: number) {
    this.cgObj.y = val;
  }

  get scaleX() {
    return this.cgObj.scale.x;
  }

  set scaleX(val: number) {
    this.cgObj.scale.x = val;
  }

  get scaleY() {
    return this.cgObj.scale.y;
  }

  set scaleY(val: number) {
    this.cgObj.scale.y = val;
  }

  getScale(): IPoint {
    return { x: this.scaleX, y: this.scaleY };
  }

  get alpha() {
    return this.cgObj.alpha;
  }

  set alpha(val: number) {
    this.cgObj.alpha = val;
  }

  get zIndex() {
    return this.cgObj.zIndex;
  }

  set zIndex(val: number) {
    this.cgObj.zIndex = val;
  }

  get pivotX() {
    return this.cgObj.pivot.x;
  }

  set pivotX(val: number) {
    this.cgObj.pivot.x = val;
  }

  get pivotY() {
    return this.cgObj.pivot.y;
  }

  set pivotY(val: number) {
    this.cgObj.pivot.y = val;
  }

  /** width/height  Implemented in Container. Scaling. The width property calculates scale.x/scale.y by dividing
   * the "requested" width/height by the local bounding box width/height. It is indirectly an abstraction over scale.x/scale.y,
   * and there is no concept of user-defined width. https://pixijs.download/dev/docs/PIXI.DisplayObject.html */

  /** First, remember that in pixi, width and height are just another way of expressing scale.
   // Second, a containers width and height are expressed by the bounds of its children, but express no dimensions themselves.
   // https://github.com/pixijs/pixi.js/issues/4990#issuecomment-401556950 */

  // set width(value: number) {
  //   const width = this.cgObj.getLocalBounds().width;
  //   if (width !== 0) {
  //     this.cgObj.scale.x = value / width;
  //   }
  //   else {
  //     this.cgObj.scale.x = 1;
  //   }
  // }
  //
  // set height(value: number) {
  //   const height = this.cgObj.getLocalBounds().height;
  //   if (height !== 0) {
  //     this.cgObj.scale.y = value / height;
  //   } else {
  //     this.cgObj.scale.y = 1;
  //   }
  // }

  get width() {
    // this is the copy of the approach used in PIXI.Container width implementation
    return this.cgObj.scale.x * this.cgObj.getLocalBounds().width;
  }

  get height() {
    return this.cgObj.scale.y * this.cgObj.getLocalBounds().height;
  }

  public getCenter(): IPoint {
    return {
      x: this.cgObj.x + this.width / 2,
      y: this.cgObj.y + this.height / 2,
    };
  }

  public setUniformScaleBase(type: 'topLeft' | 'center' = 'topLeft') {
    this.isScaleFromCenter = type === 'center';
  }

  public setUniformScale(val: number) {
    if (this.isScaleFromCenter) {
      // offset approach
      const oWidth = this.width;
      const oHeight = this.height;

      this.cgObj.scale.x = val;
      this.cgObj.scale.y = val;

      const width = this.width;
      const height = this.height;

      this.cgObj.position.x -= (width - oWidth) / 2;
      this.cgObj.position.y -= (height - oHeight) / 2;
    } else {
      this.scaleX = val;
      this.scaleY = val;
    }
  }

  private initDummyGraphics() {
    this.drawDummyGraphics({ opacity: 0.5 });
    this.cgObj.addChild(this.dummy);
  }

  public drawDummyGraphics({ color = 0x00ff00, width = 100, height = 100, opacity = 1 }) {
    this.dummy.beginFill(color, 0.1);
    this.dummy.lineStyle(1, color).drawRect(0, 0, width, height);
    this.dummy.endFill();
    this.dummy.alpha = opacity;
  }

  // public addChild<TChildren extends PIXI.DisplayObject[]>(...children: TChildren): TChildren[0] {
  //   const originReturn = super.addChild.call(this, ...arguments);
  //   // if (this instanceof Memo) {
  //   //   this.updateCenterPivot();
  //   // }
  //   return originReturn;
  // }
  //
  // public updateCenterPivot() {
  //   this.pivot.x = this.width / 2;
  //   this.pivot.y = this.height / 2;
  // }
}
