import clonedeep from 'lodash.clonedeep';
import Helpers from './Helpers';
import { IAppDepositState, IAppState, IStateScope } from './index';
import FlowApp from '../Interfaces/FlowApp';

export default class IO {
  constructor(public app: FlowApp) {}

  public exportState(stateScope?: IStateScope): string {
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
    if (!Helpers.isGlobalStateValid(appState, this.app.stateManager.publicState)) {
      this.app.stateManager.publicState = appState;
      // Update history
      this.app.stateManager.saveToHistory('global', appState);
    }
  }
}
