import { gsap } from 'gsap';
import PIXI from 'pixi.js';
import Viewport from './Viewport';
import { WordScreenCoords } from './Viewport';

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

  moveCameraTo(targetPoint: WordScreenCoords, targetScale?: number) {
    if (targetScale === undefined) {
      targetScale = this.cameraControls.scale;
    }

    // get center()
    // center of screen in world coordinates = worldScreenWidth / 2 - x / scale

    // get worldScreenWidth()
    // worldScreenWidth = screenWidth / scale

    if (targetScale >= 16) targetScale = 16;
    if (targetScale <= 0.01) targetScale = 0.01;

    gsap.to(this.cameraControls, {
      x: (this.viewport.instance.screenWidth / targetScale / 2 - targetPoint.wX) * targetScale,
      y: (this.viewport.instance.screenHeight / targetScale / 2 - targetPoint.wY) * targetScale,
      scale: targetScale,
      duration: 0.7,
      ease: 'power3.out',
      onStart: () => {
        this.viewport.instance.interactive = false;
      },
      onComplete: () => {
        this.viewport.instance.interactive = true;
        this.viewport.onCameraAnimationEnds();
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
