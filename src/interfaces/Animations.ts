import { gsap } from 'gsap';
import PIXI from 'pixi.js';
import Viewport from './Viewport';

type cameraControls = {
  x: number;
  y: number;
  scale: number;
};

export class ViewportAnimations {
  cameraControls: cameraControls;
  viewport: Viewport;

  constructor(viewport: Viewport) {
    this.viewport = viewport;
    const vp = viewport.instance;

    this.cameraControls = {
      get x() {
        return vp.x;
      },
      set x(x) {
        vp.x = x;
      },
      get y() {
        return vp.y;
      },
      set y(y) {
        vp.y = y;
      },
      get scale() {
        return vp.scale.x;
      },
      set scale(scale) {
        vp.scale.x = scale;
        vp.scale.y = scale;
      },
    };
  }

  moveCameraTo(targetPoint = { wX: 0, wY: 0 }, targetScale?: number) {
    if (!targetScale) {
      targetScale = this.cameraControls.scale;
    }

    // get center()
    // center of screen in world coordinates = worldScreenWidth / 2 - x / scale

    // get worldScreenWidth()
    // worldScreenWidth = screenWidth / scale

    gsap.to(this.cameraControls, {
      x: (this.viewport.instance.screenWidth / targetScale / 2 - targetPoint.wX) * targetScale,
      y: (this.viewport.instance.screenHeight / targetScale / 2.5 - targetPoint.wY) * targetScale,
      scale: targetScale,
      duration: 0.7,
      ease: 'power3.out',
      onUpdate: () => {
        if (this.viewport.instance.interactive) this.viewport.instance.interactive = false;
      },
      onComplete: () => {
        this.viewport.instance.interactive = true;
      },
    });
  }
}

export class AnimateUiControls {
  static pressFocusPoint(focusPoint: PIXI.Graphics) {
    // gsap.fromTo(this.focusPoint, {opacity: 0}, {opacity: 0.5, duration: 1});

    // https://greensock.com/docs/v2/Plugins/PixiPlugin
    gsap.fromTo(
      focusPoint,
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
