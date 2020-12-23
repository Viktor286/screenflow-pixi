import FlowApp from './FlowApp';
import { IPublicCameraState } from './Viewport';
import { IPublicBoardState, IPublicBoardDepositState } from './Board';
import BoardElement, { IBoardElementPublicState } from './BoardElement';
import clonedeep from 'lodash.clonedeep';

export interface IAppState {
  camera: IPublicCameraState;
  board: IPublicBoardState;
  [key: string]: any;
}

export interface IAppDepositState {
  camera: IPublicCameraState;
  board: IPublicBoardDepositState;
  [key: string]: any;
}

type IStateScope = string;

interface IStateSlice {
  [key: string]: any;
}

export default class StateManager {
  public publicState: IAppState = {
    camera: this.app.viewport.publicCameraState,
    board: this.app.board.state,
  };
  public history: IStateSlice[] = [];
  public historyLevel = 50;

  constructor(public app: FlowApp) {
    for (const scope in this.publicState) {
      if (Object.prototype.hasOwnProperty.call(this.publicState, scope)) {
        this.saveToHistory(scope, this.getState(scope));
      }
    }
  }

  public saveToHistory(stateScope: IStateScope, stateSlice: IStateSlice) {
    console.log(`history: ${stateScope}`, stateSlice);
    this.enqueueHistory({ type: stateScope, ...stateSlice });
  }

  public getState(stateScope?: IStateScope): IAppState | IPublicCameraState {
    if (stateScope) {
      return Object.assign({}, this.getStateElement(stateScope));
    }
    return {
      ...this.publicState,
    };
  }

  // TODO: THE BIG QUESTION HERE -- HOW FREQUENT DO WE WANT TO UPDATE COMMON ANIMATION STATE, GAME-LIKE OR DOCUMENT-LIKE
  public setState = (scope: IStateScope, stateSlice: IStateSlice, isNoOp: boolean = false) => {
    if (!this.isValidStateSlice(stateSlice)) return false;

    let isStateChanged = false;

    // For Animation apply GROUPED operation right away (props handled simultaneously by GSAP)
    // without any state data update and stop processing any other fields to avoid other changes
    if (stateSlice.hasOwnProperty('animation')) {
      this.applyOperation('animation', stateSlice.animation, scope);
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
        let newScopeState = {
          ...prevScopedState,
          [property]: isNoOp ? updateValue : this.applyOperation(property, updateValue, scope),
        };

        // Mutate state as scope's branch
        Object.assign(this.getStateElement(scope), newScopeState);
        isStateChanged = true;
      }
    }

    if (isStateChanged) this.saveToHistory(scope, this.getState(scope));
    return true;
  };

  private applyOperation(
    property: string,
    updateValue: number | IPublicCameraState,
    stateAddress: IStateScope,
  ): number | IPublicCameraState | Promise<IPublicCameraState> | boolean {
    // Board (board) operations
    if (stateAddress.startsWith('/board')) {
      if (this.isScopeWithSubDomain(stateAddress)) {
        const { target: id } = this.parseSubdomainScope(stateAddress);
        const boardElement = this.app.board.state[id].element;

        if (boardElement) {
          // const stateElement = this.getStateElement(stateAddress);

          if (property === 'animation' && typeof updateValue === 'object') {
            this.asyncBoardElementAnimationOperation(boardElement, updateValue);
            // stateElement.animationInProgress = updateValue;
            return true;
          }

          // if (stateElement.animationInProgress) {
          //   delete stateElement.animationInProgress;
          // }

          boardElement[property] = updateValue;
          return updateValue;
        }
      }
    }

    // Viewport (camera) -- only animation handled at the moment
    if (stateAddress === 'camera') {
      // // Run animation with another postponed state update at animation end
      if (property === 'animation' && typeof updateValue === 'object') {
        this.asyncCameraAnimationOperation(updateValue);
        // we can set "animation in progress" here
        return true;
      }

      // TODO: solve problem with animation in-progress sequence overlaps with state update request
      // Apply external operation
      // this.app.viewport[property] = updateValue;

      // Always return original updateValue
      return updateValue;
    }

    // Default return origin value
    return updateValue;
  }

  private asyncCameraAnimationOperation(value: IPublicCameraState) {
    this.app.viewport.animateCamera(value).then((cameraProps) => this.setState('camera', cameraProps));
  }

  private asyncBoardElementAnimationOperation(
    targetBoardElement: BoardElement,
    value: IBoardElementPublicState,
  ) {
    targetBoardElement
      .animateBoardElement(value)
      .then((boardElementProps) =>
        this.setState(`/board/${targetBoardElement.id}`, { ...boardElementProps }),
      );
  }

  public exportState(stateScope?: IStateScope): string {
    const storageState = clonedeep(this.getState(stateScope));

    // rm real element references
    for (const boardElement in storageState.board) {
      if (Object.prototype.hasOwnProperty.call(storageState.board, boardElement)) {
        // At the moment we support only "memo" type here
        const memo = storageState.board[boardElement];

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
    if (!this.isGlobalStateValid(appState)) {
      this.publicState = appState;
      // Update history
      this.saveToHistory('global', appState);
    }
  }

  private isValidStateSlice(stateItem: IStateSlice) {
    return typeof stateItem === 'object' || Array.isArray(stateItem);
  }

  private isGlobalStateValid(state: object) {
    if (typeof state === 'object' && !Array.isArray(state)) {
      for (const scope in this.publicState) {
        if (Object.hasOwnProperty.call(this.publicState, scope)) {
          return !state.hasOwnProperty(scope);
        }
      }
      return true;
    }
    return false;
  }

  private enqueueHistory(action: IStateSlice) {
    this.history = [action, ...this.history.slice(0, this.historyLevel - 1)];
  }

  private getStateElement(stateScope: IStateScope) {
    if (this.isScopeWithSubDomain(stateScope)) {
      const { domain, target } = this.parseSubdomainScope(stateScope);
      return this.publicState[domain][target];
    }
    return this.publicState[stateScope];
  }

  private isScopeWithSubDomain(inputStr: string): boolean {
    return inputStr[0] === '/';
  }

  private parseSubdomainScope(inputStr: string) {
    const result = {
      domain: '',
      target: '',
    };

    const parsedStr = inputStr.slice(1).split('/');

    if (parsedStr.length === 2) {
      result.domain = parsedStr[0];
      result.target = parsedStr[1];
      return result;
    }

    return result;
  }
}
