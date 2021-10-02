import * as PIXI from 'pixi.js';
import FlowApp from '../FlowApp';
import { gsap } from 'gsap';

export default class FocusPoint {
  private readonly touchGraphics: PIXI.Graphics = this.createTouchGraphics(0xfff796);
  private readonly animationDuration = 0.7;

  constructor(public app: FlowApp) {
    // this.app.engine.stage.addChild(this.touchGraphics);
    this.touchGraphics.zIndex = 9999;
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

  private createTouchGraphics(color: number): PIXI.Graphics {
    const circle = new PIXI.Graphics();
    circle.lineStyle(0); // lineStyle to zero
    circle.beginFill(color, 0.4);
    circle.drawCircle(0, 0, 10);
    circle.endFill();
    circle.alpha = 0;
    return circle;
  }

  public putFocusPoint() {
    // const { x, y } = this.app.viewport.instance.toGlobal({ x: wX, y: wY });
    this.app.viewport.addToViewport(this.touchGraphics);
    const { wX, wY } = this.app.viewport.getWorldCoordsFromMouse();
    this.touchGraphics.position.set(wX, wY);
    this.animateFocusPoint();
    setTimeout(() => {
      this.app.viewport.removeFromViewport(this.touchGraphics);
    }, this.animationDuration * 1000);
  }

  private animateFocusPoint() {
    gsap.fromTo(
      this,
      {
        scale: 1 / this.app.viewport.scale,
        alpha: 1,
      },
      {
        scale: 3.5 / this.app.viewport.scale,
        alpha: 0,
        duration: this.animationDuration,
        ease: 'expo.out',
      },
    );
  }
}
