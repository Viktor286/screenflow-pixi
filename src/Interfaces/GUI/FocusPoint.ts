import * as PIXI from 'pixi.js';
import FlowApp from '../FlowApp';
import { IWorldScreenCoords } from '../Viewport';
import { gsap } from 'gsap';

export default class FocusPoint {
  circle: PIXI.Graphics;

  constructor(public app: FlowApp) {
    this.circle = new PIXI.Graphics();
    this.circle.lineStyle(0); // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
    this.circle.beginFill(0xfff796, 0.4);
    this.circle.drawCircle(0, 0, 10);
    this.circle.endFill();
    this.circle.pivot.set(0, 0);
    const { sX, sY } = this.app.viewport.screenCenter();
    this.circle.position.set(sX, sY);
    this.circle.alpha = 0;
    this.app.viewport.addToViewport(this.circle);
  }

  putFocusPoint({ wX, wY }: IWorldScreenCoords) {
    this.circle.alpha = 0;
    this.circle.position.set(wX, wY);
    this.animateFocusPoint(this.circle);
  }

  animateFocusPoint(circle: PIXI.Graphics) {
    // gsap.fromTo(this.focusPoint, {opacity: 0}, {opacity: 0.5, duration: 1});

    // https://greensock.com/docs/v2/Plugins/PixiPlugin
    gsap.fromTo(
      circle,
      {
        pixi: {
          scale: 1,
          alpha: 1,
        },
      },
      {
        pixi: {
          scale: 3.5,
          alpha: 0,
        },
        duration: 0.7,
        ease: 'expo.out',
      },
    );
  }
}
