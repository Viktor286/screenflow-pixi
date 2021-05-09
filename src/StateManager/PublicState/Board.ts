import { IBoardElementPublicState } from '../../Interfaces/BoardElement';
import { StateUpdateRequest } from '../StateUpdateRequest';

export interface IBoardElementPublicDepositState {
  x: number;
  y: number;
  s: number;
  w: number;
  h: number;
}

export interface IPublicBoardDepositState {
  [index: string]: IBoardElementPublicDepositState;
}

export class PublicBoardState {
  [key: string]: IBoardElementPublicState | Function;

  constructor() {
    (() => {})();
  }

  // TODO: figure out group updates. (More info needed)

  update(stateUpdate: StateUpdateRequest) {
    // if (!this[stateUpdate.location.target]) {
    //   this[stateUpdate.location.target] = new IBoardElementPublicState({ x: 0, y: 0, scale: 1 });
    // }
    //
    // const boardElementTarget = this[stateUpdate.location.target] as IBoardElementPublicState;
    //
    // for (const prop in stateUpdate.slice) {
    //   if (Object.prototype.hasOwnProperty.call(stateUpdate.slice, prop)) {
    //     boardElementTarget[prop as Extract<keyof IBoardElementPublicState, string>] = stateUpdate.slice[prop];
    //   }
    // }
  }

  // add(boardElement: BoardElement) {
  //   this[boardElement.id] = new IBoardElementPublicState(boardElement);
  // }

  // remove
}
