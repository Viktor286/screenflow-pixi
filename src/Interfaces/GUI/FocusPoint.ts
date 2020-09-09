import * as PIXI from 'pixi.js';
import FlowApp from '../FlowApp';
import { IWorldScreenCoords } from '../Viewport';
import { gsap } from 'gsap';

export default class FocusPoint {
  touchGraphics: PIXI.Graphics;

  constructor(public app: FlowApp) {
    this.touchGraphics = this.createTouchGraphics(0xfff796);
    // this.app.engine.stage.addChild(this.touchGraphics);
    this.app.viewport.addToViewport(this.touchGraphics);
  }

  set scale(value: number) {
    this.touchGraphics.scale.x = value;
    this.touchGraphics.scale.y = value;
  }

  set alpha(value: number) {
    this.touchGraphics.alpha = value;
  }

  get scale() {
    return this.touchGraphics.scale.x;
  }

  get alpha() {
    return this.touchGraphics.alpha;
  }

  createTouchGraphics(color: number): PIXI.Graphics {
    const circle = new PIXI.Graphics();
    circle.lineStyle(0); // lineStyle to zero
    circle.beginFill(color, 0.4);
    circle.drawCircle(0, 0, 10);
    circle.endFill();
    circle.alpha = 0;
    return circle;
  }

  putFocusPoint({ wX, wY }: IWorldScreenCoords) {
    // const { x, y } = this.app.viewport.instance.toGlobal({ x: wX, y: wY });
    this.touchGraphics.position.set(wX, wY);
    this.animateFocusPoint();
  }

  animateFocusPoint() {
    gsap.fromTo(
      this,
      {
        scale: 1 / this.app.viewport.scale,
        alpha: 1,
      },
      {
        scale: 3.5 / this.app.viewport.scale,
        alpha: 0,
        duration: 0.7,
        ease: 'expo.out',
      },
    );
  }
}
