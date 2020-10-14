import FlowApp from './FlowApp';
import { IPublicCameraState } from './Viewport';
import { IPublicBoardState } from './Board';
import BoardElement, { IBoardElementPublicState } from './BoardElement';

interface IAppState {
  camera: IPublicCameraState;
  board: IPublicBoardState;
  [key: string]: any;
}

type IStateScope = string;

interface IStateSlice {
  [key: string]: any;
}

export default class StateManager {
  public readonly publicState: IAppState = {
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
    // switch (stateScope) {
    //   case 'camera':
    //     this.enqueueHistory({ type: stateScope, ...stateSlice });
    // }
  }

  public getState(stateScope?: IStateScope): IAppState | IPublicCameraState {
    if (stateScope) {
      return Object.assign({}, this.getOriginState(stateScope));
    }
    return {
      ...this.publicState,
    };
  }

  public setState = (stateScope: IStateScope, stateSlice: IStateSlice) => {
    if (typeof stateSlice !== 'object' && !Array.isArray(stateSlice)) {
      return false;
    }

    // For animations -- apply operation immediately without setting the state at initial frame
    if (stateSlice.hasOwnProperty('animation')) {
      this.applyOperation('animation', stateSlice.animation, stateScope);
      return false;
    }

    // For amendment just apply new state props
    if (stateSlice.hasOwnProperty('amend')) {
      this.applyOperation('amend', stateSlice.amend, stateScope);
    } else {
      for (const property in stateSlice) {
        if (!Object.prototype.hasOwnProperty.call(stateSlice, property)) {
          continue;
        }

        if (stateSlice[property] === undefined) {
          continue;
        }

        const updateValue = stateSlice[property];

        if (typeof updateValue === 'object') {
          // recursive call of setState/processObjectProps?
          continue;
        }

        // Apply singe property update
        this.setPrimitiveStateProp(stateScope, property, updateValue);
      }
    }

    this.saveToHistory(stateScope, this.getState(stateScope));
    return true;
  };

  private enqueueHistory(action: IStateSlice) {
    this.history = [action, ...this.history.slice(0, this.historyLevel - 1)];
  }

  private getOriginState(stateScope: IStateScope) {
    if (this.isScopeWithSubDomain(stateScope)) {
      const { domain, target } = this.parseSubdomainScope(stateScope);
      return this.publicState[domain][target];
    }
    return this.publicState[stateScope];
  }

  private setPrimitiveStateProp(stateScope: string, property: string, updateValue: number) {
    let prevScopeState = this.getState(stateScope);
    const outdatedValue = prevScopeState[property];

    if (outdatedValue !== updateValue) {
      let newScopeState = {
        ...prevScopeState,
        [property]: this.applyOperation(property, updateValue, stateScope),
      };

      // Assign fields of referenced origin
      Object.assign(this.getOriginState(stateScope), newScopeState);
    }
  }

  private applyOperation(
    property: string,
    updateValue: number | IPublicCameraState,
    stateScope: IStateScope,
  ): number | IPublicCameraState | Promise<IPublicCameraState> | boolean {
    if (stateScope.startsWith('/board')) {
      if (this.isScopeWithSubDomain(stateScope)) {
        const { target: id } = this.parseSubdomainScope(stateScope);
        const boardElement = this.app.board.state[id].element;

        if (boardElement) {
          if (property === 'animation' && typeof updateValue === 'object') {
            this.asyncBoardElementAnimationOperation(boardElement, updateValue);
            return true;
          }
          boardElement[property] = updateValue;
          this.getOriginState(stateScope)[property] = updateValue;
        }
      }
    }

    // Viewport (camera) -- only animation handled at the moment
    if (stateScope === 'camera') {
      // // Run animation with another postponed state update at animation end
      if (property === 'animation' && typeof updateValue === 'object') {
        this.asyncCameraAnimationOperation(updateValue);
        return true;
      }

      if (property === 'amend' && typeof updateValue === 'object') {
        for (let prop in updateValue) {
          if (Object.prototype.hasOwnProperty.call(updateValue, prop)) {
            this.setPrimitiveStateProp(stateScope, prop, updateValue[prop]);
            this.getOriginState(stateScope)[prop] = updateValue[prop];
          }
        }
        return updateValue;
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
    this.app.viewport.animateCamera(value).then((cameraProps) => this.setState('camera', { ...cameraProps }));
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
