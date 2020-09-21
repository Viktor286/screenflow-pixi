import FlowApp from './FlowApp';
import { IPublicCameraState } from './Viewport';

interface IAppState {
  camera: IPublicCameraState;
  [key: string]: any;
}

type IStateScope = string;

interface IStateSlice {
  [key: string]: any;
}

export default class StateManager {
  publicState: IAppState;
  history: IStateSlice[];
  historyLevel: number;

  constructor(public app: FlowApp) {
    this.publicState = {
      camera: this.app.viewport.publicCameraState,
      memos: this.app.memos.publicMemosState,
    };

    this.history = [];
    this.historyLevel = 50;
    for (const scope in this.publicState) {
      if (Object.prototype.hasOwnProperty.call(this.publicState, scope)) {
        this.saveToHistory(scope, this.getState(scope));
      }
    }
  }

  enqueueHistory(action: IStateSlice) {
    this.history = [action, ...this.history.slice(0, this.historyLevel - 1)];
  }

  saveToHistory(stateScope: IStateScope, stateSlice: IStateSlice) {
    switch (stateScope) {
      case 'camera':
        this.enqueueHistory({ type: stateScope, ...stateSlice });
    }
  }

  getState(stateScope?: IStateScope): IAppState | IPublicCameraState {
    if (stateScope) {
      return Object.assign({}, this.publicState[stateScope]);
    }
    return {
      ...this.publicState,
    };
  }

  setState = (stateScope: IStateScope, stateSlice: IStateSlice) => {
    if (typeof stateSlice !== 'object') {
      return false;
    }

    // For animations -- apply operation immediately without setting the state at initial frame
    if (stateSlice.hasOwnProperty('animation')) {
      this.applyOperation('animation', stateSlice.animation, stateScope);
      return false;
    }

    for (const property in stateSlice) {
      let prevScopeState = this.getState(stateScope);

      if (!Object.prototype.hasOwnProperty.call(stateSlice, property)) {
        continue;
      }

      const updateValue = stateSlice[property];

      if (Array.isArray(updateValue)) {
        // array of values, mostly array of objects
        continue;
      }

      if (typeof updateValue === 'object') {
        this.prepareObjectPropUpdate(stateScope, property, updateValue, prevScopeState);
        continue;
      }

      // Apply singe property update
      this.setPrimitiveStateProp(stateScope, property, updateValue, prevScopeState);
    }

    this.saveToHistory(stateScope, this.getState(stateScope));
    return true;
  };

  setPrimitiveStateProp(
    stateScope: string,
    property: string,
    updateValue: number,
    prevScopeState: IStateSlice,
  ) {
    const outdatedValue = prevScopeState[property];

    if (outdatedValue !== updateValue) {
      let newScopeState = {
        ...prevScopeState,
        [property]: this.applyOperation(property, updateValue, stateScope),
      };

      // Assign fields of referenced origin
      Object.assign(this.publicState[stateScope], newScopeState);
    }
  }

  prepareObjectPropUpdate(
    stateScope: string,
    property: string,
    updateValue: number,
    prevScopeState: IStateSlice,
  ): void {
    // So far we don't have non-primitive handlers.
    // but this place suppose to handle it
    this.setPrimitiveStateProp(stateScope, property, updateValue, prevScopeState);
  }

  applyOperation(
    property: string,
    updateValue: number | IPublicCameraState,
    stateScope: IStateScope,
  ): number | IPublicCameraState | Promise<IPublicCameraState> | boolean {
    switch (stateScope) {
      case 'camera':
        // // Run animation with another postponed state update at animation end
        if (property === 'animation' && typeof updateValue === 'object') {
          this.asyncCameraAnimationOperation(updateValue);
          return true;
        }

        // TODO: solve problem with animation in-progress sequence overlaps with state update request
        // Apply external operation
        // this.app.viewport[property] = updateValue;

        // Always return original updateValue
        return updateValue;
      default:
        return updateValue;
    }
  }

  asyncCameraAnimationOperation(value: IPublicCameraState) {
    this.app.viewport.moveCameraTo(value).then((cameraProps) => this.setState('camera', { ...cameraProps }));
  }
}
