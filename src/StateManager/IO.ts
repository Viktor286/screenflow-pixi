import clonedeep from 'lodash.clonedeep';
import StateManager, { IAppDepositState, IAppState, StateScope } from './index';
import FlowApp from '../Interfaces/FlowApp';
import { StateUpdateRequest } from './StateUpdateRequest';

export default class IO {
  constructor(public app: FlowApp) {}

  public exportState(stateScope?: StateScope): string {
    const state = clonedeep(this.app.stateManager.getState(stateScope));

    // rm real element references
    for (const boardElement in state.board) {
      if (Object.prototype.hasOwnProperty.call(state.board, boardElement)) {
        // At the moment we support only "memo" type here
        const memo = state.board[boardElement];

        // rename "scale" to "s" to condense text data
        // @ts-ignore todo: resolve this the best way:
        // todo: -- looks like we would need to make whole new "state.board" object
        memo.s = memo.scale;
        delete memo.scale;

        // remove element objects
        delete memo.element;
      }
    }

    return JSON.stringify(state);
  }

  public importState(appDepositState: IAppDepositState) {
    // Reset board

    // Start with default clean state
    // todo: do we want a generator function for this?
    const appState: IAppState = {
      board: {},
      viewport: {
        x: 0,
        y: 0,
        cwX: 0,
        cwY: 0,
        scale: 1,
      },
    };

    // copy viewport primitives
    for (const key in appDepositState.viewport) {
      if (Object.prototype.hasOwnProperty.call(appDepositState.viewport, key)) {
        appState.viewport[key] = appDepositState.viewport[key];
      }
    }

    // apply viewport operation (transforms)
    this.app.viewport.x = appDepositState.viewport.x;
    this.app.viewport.y = appDepositState.viewport.y;
    this.app.viewport.scale = appDepositState.viewport.scale;

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
    if (!StateManager.isGlobalStateValid(appState, this.app.stateManager.publicState)) {
      this.app.stateManager.publicState = appState;
      // Update history
      this.app.stateManager.saveToHistory(new StateUpdateRequest('global state import', appState));
    }
  }
}
