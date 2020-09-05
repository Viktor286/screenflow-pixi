import FlowApp from './FlowApp';
import { ICamera, ICameraProps } from './Viewport';

interface IAppState {
  camera: ICamera;
  [key: string]: any;
}

type IStateScope = string;

interface IStateSlice {
  [key: string]: any;
}

// TODO: temp state management
//  - this is version of state with permanent branches(top level keys) to simplify algorithm
//  - use immutable js collections?
//  - attach state to redux? (how react "connect" works, via store.subscribe?)
//  - should camera high-freq animations be in its own store?

export default class StateManager {
  state: IAppState;
  history: IStateSlice[];

  constructor(public app: FlowApp) {
    this.state = {
      camera: {
        x: 0,
        y: 0,
        scale: 1,
        animation: false,
      },
    };
    this.history = []; // TODO: make a queue
  }

  saveToHistory(stateScope: IStateScope, stateSlice: IStateSlice) {
    switch (stateScope) {
      case 'camera':
        if (stateSlice.animation !== false) {
          return;
        }
        this.history.push(stateSlice);
    }
  }

  getState(stateScope?: IStateScope): IAppState | ICamera {
    if (stateScope) {
      return Object.assign({}, this.state[stateScope]);
    }
    return {
      ...this.state,
    };
  }

  // TODO: this setState version supports only stateScoped requests
  setState = (stateScope: IStateScope, stateSlice: IStateSlice) => {
    let prevScopeState = this.getState(stateScope);
    let newScopeState;

    for (const property in stateSlice) {
      if (stateSlice.hasOwnProperty(property) && prevScopeState.hasOwnProperty(property)) {
        if (prevScopeState[property] !== stateSlice[property]) {
          newScopeState = {
            ...prevScopeState,
            ...{ [property]: this.applyOperation(property, stateSlice[property], stateScope) },
          };

          this.state[stateScope] = newScopeState;
          prevScopeState = newScopeState;
          this.saveToHistory(stateScope, newScopeState);

          // call subscribers?
        } else {
          // TODO: handle case with object|array sub levels
        }
      }
    }

    return true;
  };

  applyOperation(
    property: string,
    value: number | ICameraProps,
    stateScope: IStateScope,
  ): number | ICameraProps | Promise<ICameraProps> | boolean {
    switch (stateScope) {
      case 'camera':
        // Async animation operation
        if (typeof value === 'object' && property === 'animation') {
          const currentState = this.getState('camera');
          delete currentState.animation;
          if (JSON.stringify(currentState) !== JSON.stringify(value)) {
            this.app.viewport
              .moveCameraTo(value)
              .then((cameraProps) => this.setState('camera', { ...cameraProps, animation: false }));
          } else {
            return false;
          }
        }
        return value;
      default:
        return value;
    }
  }
}
