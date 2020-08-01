import { gsap } from 'gsap';
import PIXI from 'pixi.js';

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
