import { gsap } from 'gsap';
import PIXI from 'pixi.js';
import Viewport from './Viewport';
import { IWorldScreenCoords } from './Viewport';
import FlowApp from './FlowApp';

export class ViewportAnimations {
  viewport: Viewport;

  constructor(public app: FlowApp, viewport: Viewport) {
    this.viewport = viewport;
  }

  moveCameraTo(targetPoint: IWorldScreenCoords, targetScale?: number) {
    if (targetScale === undefined) {
      targetScale = this.app.stateManager.state.camera.scale;
    }

    if (targetScale >= 32) targetScale = 32;
    if (targetScale <= 0.01) targetScale = 0.01;

    const targetProps = {
      x: (this.app.viewport.screenWidth / targetScale / 2 - targetPoint.wX) * targetScale,
      y: (this.app.viewport.screenHeight / targetScale / 2 - targetPoint.wY) * targetScale,
      scale: targetScale,
    };

    const app = this.app;

    gsap.to(this.app.stateManager.getState('camera'), {
      ...targetProps,
      duration: 0.7,
      ease: 'power3.out',
      onUpdate: function () {
        const animatedSet = this.targets()[0]; // current {x, y, scale}
        // TODO: it might be better not to update state with animation
        //  - how it is recommended to deal with animations in react?
        app.stateManager.setState('camera', animatedSet);
      },
      onStart: () => {
        this.app.viewport.interactive = false;
      },
      onComplete: () => {
        this.app.viewport.interactive = true;
        this.app.viewport.onCameraAnimationEnds();
        // console.log('camera.state', this.state);
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
