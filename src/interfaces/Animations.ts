import { gsap } from 'gsap';
import PIXI from 'pixi.js';
import { Viewport as PixiViewport } from 'pixi-viewport';

export class AnimateUiControls {
  static slideViewport(viewport: PixiViewport, x: number, y: number) {
    gsap.to(viewport.position, {
      x: (viewport.worldScreenWidth / 2 - x) * viewport.scale.x,
      y: (viewport.worldScreenHeight / 2.5 - y) * viewport.scale.y,
      duration: 1,
      ease: 'expo.out',
    });
  }

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
