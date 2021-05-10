import * as PIXI from 'pixi.js';
import { IPoint } from '../../types/global';

export class CgContainer {
  c = new PIXI.Container();
  isScaleFromCenter = false;

  constructor() {
    this.c = new PIXI.Container();
    this.c.sortableChildren = true;
  }

  destroy() {
    this.c.destroy({
      children: true,
      texture: true,
      baseTexture: true,
    });
  }

  get x() {
    return this.c.x;
  }

  set x(val: number) {
    this.c.x = val;
  }

  get y() {
    return this.c.y;
  }

  set y(val: number) {
    this.c.y = val;
  }

  get scaleX() {
    return this.c.scale.x;
  }

  set scaleX(val: number) {
    this.c.scale.x = val;
  }

  get scaleY() {
    return this.c.scale.y;
  }

  set scaleY(val: number) {
    this.c.scale.y = val;
  }

  get alpha() {
    return this.c.alpha;
  }

  set alpha(val: number) {
    this.c.alpha = val;
  }

  get zIndex() {
    return this.c.zIndex;
  }

  set zIndex(val: number) {
    this.c.zIndex = val;
  }

  get pivotX() {
    return this.c.pivot.x;
  }

  set pivotX(val: number) {
    this.c.pivot.x = val;
  }

  get pivotY() {
    return this.c.pivot.y;
  }

  set pivotY(val: number) {
    this.c.pivot.y = val;
  }

  /** width/height  Implemented in Container. Scaling. The width property calculates scale.x/scale.y by dividing
   * the "requested" width/height by the local bounding box width/height. It is indirectly an abstraction over scale.x/scale.y,
   * and there is no concept of user-defined width. https://pixijs.download/dev/docs/PIXI.DisplayObject.html */

  /** First, remember that in pixi, width and height are just another way of expressing scale.
   // Second, a containers width and height are expressed by the bounds of its children, but express no dimensions themselves.
   // https://github.com/pixijs/pixi.js/issues/4990#issuecomment-401556950 */

  // set width(val: number) {
  //   this.container.width = val;
  // }

  // set height(val: number) {
  //   this.container.height = val;
  // }

  get width() {
    return this.c.width;
  }

  get height() {
    return this.c.height;
  }

  getCenterX(): number {
    return this.c.x + this.c.width / 2;
  }

  getCenterY(): number {
    return this.c.y + this.c.height / 2;
  }

  setUniformScaleBase(type: 'topLeft' | 'center' = 'topLeft') {
    this.isScaleFromCenter = type === 'center';
  }

  setUniformScale(val: number) {
    if (this.isScaleFromCenter) {
      // offset approach
      const oWidth = this.c.width;
      const oHeight = this.c.height;

      this.c.scale.x = val;
      this.c.scale.y = val;

      const width = this.c.width;
      const height = this.c.height;

      this.c.position.x -= (width - oWidth) / 2;
      this.c.position.y -= (height - oHeight) / 2;
    } else {
      this.scaleX = val;
      this.scaleY = val;
    }
  }

  getScale(): IPoint {
    return { x: this.scaleX, y: this.scaleY };
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
