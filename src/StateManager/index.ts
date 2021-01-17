import FlowApp from '../Interfaces/FlowApp';
import IO from './IO';
import { StateLocation, StateUpdateRequest } from './StateUpdateRequest';
import { IViewportDepositState, PublicViewportState } from './Representations/Viewport';
import { IPublicBoardDepositState, PublicBoardState } from './Representations/Board';
import ViewportOperations from './Operations/Viewport';
import BoardOperations from './Operations/Board';
import ViewportActions from './Actions/Viewport';
import BoardActions from './Actions/Board';

export interface IPublicState {
  [index: string]: PublicViewportState | PublicBoardState;
  viewport: PublicViewportState;
  board: PublicBoardState;
}

export interface IOperations {
  [index: string]: ViewportOperations | BoardOperations;
  viewport: ViewportOperations;
  board: BoardOperations;
}

export interface IActions {
  [index: string]: ViewportActions | BoardActions;
  viewport: ViewportActions;
  board: BoardActions;
}

export type StateScope = Extract<keyof IPublicState, string>;
export type StateSlice = Partial<PublicViewportState> | Partial<PublicBoardState>;
export type StateValue = StateSlice[keyof StateSlice] | undefined;
export type StateProperty = Extract<keyof StateSlice, string>;

export interface IOpSettings {
  noOp?: boolean;
  noHistory?: boolean;
  async?: AsyncOperationType;
  asyncId?: AsyncId;
}

export type AsyncId = string;
type AsyncOperationType = 'animation' | 'animated' | undefined; // ex: | 'network'

interface StateUpdateMsg {
  status: 'updated' | 'pending' | 'idle' | 'error';
  msg?: string;
  updateRequest?: StateUpdateRequest;
}

export interface IAppDepositState {
  viewport: IViewportDepositState;
  board: IPublicBoardDepositState;
}

export default class StateManager {
  /**
   * Public State Representation
   * The "scopes" classes of the states represent their own stores and controllers for store data
   * The Operations will delegate executions to "scopes"
   * */
  public publicState: IPublicState = {
    viewport: new PublicViewportState(),
    board: new PublicBoardState(),
  };

  /**
   * State Update Operations and their Actions
   * The "scopes" of the states represent their own store and controllers
   * */
  public operations: IOperations = {
    viewport: new ViewportOperations(this.app),
    board: new BoardOperations(this.app),
  };

  public actions: IActions = {
    viewport: new ViewportActions(this.app),
    board: new BoardActions(this.app),
  };

  public asyncStore: Map<AsyncId, StateUpdateRequest> = new Map();

  /**
   * Import/Export handlers of state
   * */
  public readonly io = new IO(this.app);

  /**
   * State History
   * */
  public history: StateUpdateRequest[] = [];
  public historyLevel = 50;

  constructor(public app: FlowApp) {}

  public setState = (
    locator: StateScope,
    slice: StateSlice,
    opSettings: IOpSettings = {},
  ): StateUpdateMsg => {
    const stateUpdate = new StateUpdateRequest(locator, slice, opSettings);

    if (!StateManager.isValidStateSlice(stateUpdate.slice))
      return { status: 'error', msg: 'StateSlice is not valid' };

    // Async change
    if (opSettings.async) {
      switch (opSettings.async) {
        case 'animation':
          // For "animation" all props would be GROUPED (handled simultaneously by GSAP)
          // without any state data update and stop processing any other fields to avoid other changes
          const asyncId: AsyncId = Math.random().toString(32).slice(2);
          this.operations[stateUpdate.location.scope].animate(stateUpdate, asyncId);
          this.addAsync(asyncId, stateUpdate);

          if (asyncId) {
            return {
              status: 'pending',
              msg: asyncId,
            };
          }

          return {
            status: 'error',
            msg: 'animation was not executed',
          };

        case 'animated':
          if (stateUpdate.opSettings.asyncId) this.removeAsync(stateUpdate.opSettings.asyncId);
      }
    }

    // Execute operations
    const prevScopedState = this.getState(stateUpdate.locator);

    for (const property in stateUpdate.slice) {
      if (Object.prototype.hasOwnProperty.call(stateUpdate.slice, property)) {
        const updateValue: StateValue = stateUpdate.slice[property];
        if (updateValue !== undefined && updateValue !== prevScopedState[property]) {
          const opResultValue = stateUpdate.opSettings.noOp
            ? updateValue
            : this.operations[stateUpdate.location.scope].update(property, updateValue, stateUpdate);

          stateUpdate.addToUpdated(property, opResultValue);
        }
      }
    }

    // Update State Representation
    if (stateUpdate.updatedCnt > 0) {
      // Delegate update to /Representations/Module e.g. "/Representations/Board"
      this.publicState[stateUpdate.location.scope].update(stateUpdate);

      if (!opSettings.noHistory) {
        this.saveToHistory(stateUpdate);
      }

      return { status: 'updated', updateRequest: stateUpdate };
    }

    return { status: 'idle' };
  };

  public getState(locator?: StateScope): StateSlice {
    if (locator) {
      const stateLocation = new StateLocation(locator);
      if (stateLocation.levels === 2) {
        return Object.assign({}, this.publicState[stateLocation.scope][stateLocation.target]);
      }
      return Object.assign({}, this.publicState[stateLocation.scope]);
    }
    return Object.assign({}, this.publicState);
  }

  public addAsync(asyncId: AsyncId, stateUpdate: StateUpdateRequest) {
    this.asyncStore.set(asyncId, stateUpdate);
  }

  public removeAsync(asyncId: AsyncId) {
    this.asyncStore.delete(asyncId);
  }

  public saveToHistory(stateUpdate: StateUpdateRequest) {
    console.log(`[debug] history: `, stateUpdate);
    this.enqueueHistory(stateUpdate);
    console.log(`[debug] state: `, this.getState());
  }

  private enqueueHistory(stateUpdate: StateUpdateRequest) {
    this.history = [stateUpdate, ...this.history.slice(0, this.historyLevel - 1)];
  }

  static isValidStateSlice(stateItem: StateSlice) {
    return typeof stateItem === 'object' || Array.isArray(stateItem);
  }

  static isGlobalStateValid(state: object, stateOrigin: IPublicState) {
    if (typeof state === 'object' && !Array.isArray(state)) {
      for (const scope in stateOrigin) {
        if (Object.hasOwnProperty.call(stateOrigin, scope)) {
          return !state.hasOwnProperty(scope);
        }
      }
      return true;
    }
    return false;
  }
}
