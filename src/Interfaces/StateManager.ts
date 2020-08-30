import FlowApp from './FlowApp';

interface IAppState {
  camera: ICamera;
  [key: string]: any;
}

interface ICamera {
  x: number;
  y: number;
  scale: number;
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

  constructor(public app: FlowApp) {
    this.state = {
      camera: {
        x: 0,
        y: 0,
        scale: 1,
      },
    };
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
    let prevState = this.getState(stateScope);

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

          this.state[stateScope] = newState;
          prevState = newState;
        } else {
          // TODO: handle case with object|array sub levels
        }
      }
    }

    return true;
  };

  applyOperation(property: string, value: number, stateScope: IStateScope): number | undefined {
    switch (stateScope) {
      case 'camera':
        return (this.app.viewport[property] = value);
    }
  }
}
