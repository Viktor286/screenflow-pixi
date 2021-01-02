import FlowApp from '../Interfaces/FlowApp';
import { IPublicCameraState } from '../Interfaces/Viewport';
import { IPublicBoardState, IPublicBoardDepositState } from '../Interfaces/Board';
import IO from './IO';
import Operations from './Operations';
import Actions from './Actions';
import Helpers from './Helpers';

export interface IAppState {
  [index: string]: IPublicCameraState | IPublicBoardState | object | null;
  camera: IPublicCameraState;
  board: IPublicBoardState;
  asyncQueue: object | null;
}

export type IStateSlice = Partial<IAppState>;
export type IStateScope = Extract<keyof IAppState, string>;

export interface IHistoryObject {
  content: IStateSlice;
  scope: IStateScope;
}

export interface IAppDepositState {
  camera: IPublicCameraState;
  board: IPublicBoardDepositState;
}

export default class StateManager {
  public readonly actions = new Actions(this.app);
  public readonly operations = new Operations(this.app);
  public readonly io = new IO(this.app);

  public publicState: IAppState = {
    camera: this.app.viewport.publicCameraState, // reference to origin class
    board: this.app.board.state, // reference to origin class
    asyncQueue: null,
  };

  public history: IHistoryObject[] = [];
  public historyLevel = 50;

  constructor(public app: FlowApp) {}

  // TODO: THE BIG QUESTION HERE -- HOW FREQUENT DO WE WANT TO UPDATE COMMON ANIMATION STATE, GAME-LIKE OR DOCUMENT-LIKE
  public setState = (scope: IStateScope, stateSlice: IStateSlice, isNoOp: boolean = false) => {
    if (!Helpers.isValidStateSlice(stateSlice)) return false;

    let isStateChanged = false;

    // For Animation apply GROUPED operation right away (props handled simultaneously by GSAP)
    // without any state data update and stop processing any other fields to avoid other changes

    // Main handler loop
    for (const property in stateSlice) {
      if (Object.prototype.hasOwnProperty.call(stateSlice, property)) {
        const updateValue = stateSlice[property];

        // Apply singe property update
        let prevScopedState = this.getState(scope);
        const prevValue = prevScopedState[property];

        // We need to remove this if we created it via applyOperation
        // if (prevScopedState.animationInProgress) {
        //   delete prevScopedState.animationInProgress;
        // }

        if (prevValue !== updateValue && updateValue !== undefined) {
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
    }

    if (isStateChanged) this.saveToHistory(scope, this.getState(scope));
    return true;
  };

  public getState(stateScope?: IStateScope): IStateSlice {
    if (stateScope) {
      if (Helpers.isScopeWithSubDomain(stateScope)) {
        const { domain, target } = Helpers.parseSubdomainScope(stateScope);
        return Object.assign({}, this.publicState[domain][target]); // todo: address system
      }
      return Object.assign({}, this.publicState[stateScope]);
    }
    return Object.assign({}, this.publicState);
  }

  public saveToHistory(stateScope: IStateScope, stateSlice: IStateSlice) {
    console.log(`history: ${stateScope}`, stateSlice);
    this.enqueueHistory({ scope: stateScope, content: stateSlice });
  }

  private enqueueHistory(historyObject: IHistoryObject) {
    this.history = [historyObject, ...this.history.slice(0, this.historyLevel - 1)];
  }
}
