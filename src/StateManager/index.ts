import FlowApp from '../Interfaces/FlowApp';
import { IPublicCameraState } from '../Interfaces/Viewport';
import { IPublicBoardState, IPublicBoardDepositState } from '../Interfaces/Board';
import clonedeep from 'lodash.clonedeep';
import Operations from './Operations';
import Actions from './Actions';
import Helpers from './Helpers';

export interface IAppState {
  camera: IPublicCameraState;
  board: IPublicBoardState;
  asyncQueue: object | null;
  [key: string]: any;
}

export interface IAppDepositState {
  camera: IPublicCameraState;
  board: IPublicBoardDepositState;
  [key: string]: any;
}

export type IStateScope = string;
export type IStateSlice = Partial<IAppState>;

export default class StateManager {
  public readonly actions = new Actions(this.app);
  public readonly operations = new Operations(this.app);

  public publicState: IAppState = {
    camera: this.app.viewport.publicCameraState, // reference to origin class
    board: this.app.board.state, // reference to origin class
    asyncQueue: null,
  };

  public history: IStateSlice[] = [];
  public historyLevel = 50;

  constructor(public app: FlowApp) {}

  // TODO: THE BIG QUESTION HERE -- HOW FREQUENT DO WE WANT TO UPDATE COMMON ANIMATION STATE, GAME-LIKE OR DOCUMENT-LIKE
  public setState = (scope: IStateScope, stateSlice: IStateSlice, isNoOp: boolean = false) => {
    if (!Helpers.isValidStateSlice(stateSlice)) return false;

    let isStateChanged = false;

    // TODO: looks like we may replace 'animation' prop "flag" with asyncQueue "task"
    // For Animation apply GROUPED operation right away (props handled simultaneously by GSAP)
    // without any state data update and stop processing any other fields to avoid other changes
    if (stateSlice.hasOwnProperty('animation')) {
      this.operations.exec(scope, 'animation', stateSlice.animation);
      return true;
    }

    // Main handler loop
    for (const property in stateSlice) {
      if (!stateSlice.hasOwnProperty(property) || !stateSlice[property]) continue;

      const updateValue = stateSlice[property];

      // Apply singe property update
      let prevScopedState = this.getState(scope);
      const prevValue = prevScopedState[property];

      // We need to remove this if we created it via applyOperation
      // if (prevScopedState.animationInProgress) {
      //   delete prevScopedState.animationInProgress;
      // }

      if (prevValue !== updateValue) {
        // const operationResult =

        let newScopeState = {
          ...prevScopedState,
          [property]: isNoOp ? updateValue : this.operations.exec(scope, property, updateValue),
        };

        // Mutate state as scope's branch
        Object.assign(this.getState(scope), newScopeState);
        isStateChanged = true;
      }
    }

    if (isStateChanged) this.saveToHistory(scope, this.getState(scope));
    return true;
  };

  public getState(stateScope?: IStateScope): IAppState | IPublicCameraState {
    if (stateScope) {
      if (Helpers.isScopeWithSubDomain(stateScope)) {
        const { domain, target } = Helpers.parseSubdomainScope(stateScope);
        return Object.assign({}, this.publicState[domain][target]);
      }
      return Object.assign({}, this.publicState[stateScope]);
    }
    return Object.assign({}, this.publicState);
  }

  public exportState(stateScope?: IStateScope): string {
    const storageState = clonedeep(this.getState(stateScope));

    // rm real element references
    for (const boardElement in storageState.boardOperations) {
      if (Object.prototype.hasOwnProperty.call(storageState.boardOperations, boardElement)) {
        // At the moment we support only "memo" type here
        const memo = storageState.boardOperations[boardElement];

        // rename "scale" to "s" to condense text data
        memo.s = memo.scale;
        delete memo.scale;

        // remove element objects
        delete memo.element;
      }
    }

    return JSON.stringify(storageState);
  }

  public importState(appDepositState: IAppDepositState) {
    // Reset board

    // Start with default clean state
    // todo: do we want a generator function for this?
    const appState: IAppState = {
      board: {},
      camera: {
        x: 0,
        y: 0,
        cwX: 0,
        cwY: 0,
        scale: 1,
      },
      asyncQueue: null,
    };

    // copy camera primitives
    for (const key in appDepositState.camera) {
      if (Object.prototype.hasOwnProperty.call(appDepositState.camera, key)) {
        appState.camera[key] = appDepositState.camera[key];
      }
    }

    // apply viewport operation (transforms)
    this.app.viewport.x = appDepositState.camera.x;
    this.app.viewport.y = appDepositState.camera.y;
    this.app.viewport.scale = appDepositState.camera.scale;

    // copy specific fields of board element
    for (const key in appDepositState.board) {
      if (Object.prototype.hasOwnProperty.call(appDepositState.board, key)) {
        const el = appDepositState.board[key];

        if (el.element) {
          appState.board[key] = {
            x: el.x,
            y: el.y,
            scale: el.s,
            element: el.element,
          };

          // apply operation (transforms)
          el.element.x = el.x;
          el.element.y = el.y;
          el.element.scale = el.s;
        }
      }
    }

    // Validate and assign new state
    if (!Helpers.isGlobalStateValid(appState, this.publicState)) {
      this.publicState = appState;
      // Update history
      this.saveToHistory('global', appState);
    }
  }

  private saveToHistory(stateScope: IStateScope, stateSlice: IStateSlice) {
    console.log(`history: ${stateScope}`, stateSlice);
    this.enqueueHistory({ type: stateScope, ...stateSlice });
  }

  private enqueueHistory(action: IStateSlice) {
    this.history = [action, ...this.history.slice(0, this.historyLevel - 1)];
  }
}
