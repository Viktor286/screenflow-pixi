import FlowApp from './FlowApp';
import { IWorldScreenCoords } from './Viewport';
import { gsap } from 'gsap';

interface ICameraState {
  x: number;
  y: number;
  scale: number;
  [key: string]: any;
}

interface IStateSlice {
  [key: string]: any;
}

type IStateScope = string;

export default class Camera {
  state: ICameraState;

  constructor(public app: FlowApp) {
    this.state = {
      x: this.app.viewport.x,
      y: this.app.viewport.y,
      scale: this.app.viewport.scale,
    };
  }

  moveCameraTo(targetPoint: IWorldScreenCoords, targetScale?: number) {
    if (targetScale === undefined) {
      targetScale = this.state.scale;
    }

    if (targetScale >= 32) targetScale = 32;
    if (targetScale <= 0.01) targetScale = 0.01;

    const setState = this.setState.bind(this);

    gsap.to(this.getState(), {
      x: (this.app.viewport.screenWidth / targetScale / 2 - targetPoint.wX) * targetScale,
      y: (this.app.viewport.screenHeight / targetScale / 2 - targetPoint.wY) * targetScale,
      scale: targetScale,
      duration: 0.7,
      ease: 'power3.out',
      onUpdate: function () {
        const animatedSet = this.targets()[0]; // current {x, y, scale}
        setState('viewport', animatedSet);
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

  applyOperation(property: string, value: number, stateScope: IStateScope): number | undefined {
    switch (stateScope) {
      case 'viewport':
        return (this.app.viewport[property] = value);
    }
  }

  getState(): ICameraState {
    return Object.assign({}, this.state);
  }

  setState(stateScope: IStateScope, stateSlice: IStateSlice) {
    let prevState = this.getState();

    for (const property in stateSlice) {
      if (
        stateSlice.hasOwnProperty(property) &&
        prevState.hasOwnProperty(property) &&
        typeof stateSlice[property] === typeof prevState[property]
      ) {
        if (typeof prevState[property] !== 'object' && prevState[property] !== stateSlice[property]) {
          const newState = {
            ...prevState,
            ...{ [property]: this.applyOperation(property, stateSlice[property], stateScope) },
          };

          this.state = newState;
          prevState = newState;
        } else {
          // TODO: handle case with object|array sub levels
        }
      }
    }

    return true;
  }
}
