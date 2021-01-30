import BoardElement from '../../Interfaces/BoardElement';
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

class PublicBoardElement {
  x?: number;
  y?: number;
  scale?: number;

  constructor({ x, y, scale }: Partial<PublicBoardElement>) {
    this.x = x;
    this.y = y;
    this.scale = scale;
  }
}

export class PublicBoardState {
  [key: string]: PublicBoardElement | Function;

  constructor() {
    (() => {})();
  }

  // TODO: figure out group updates

  update(stateUpdate: StateUpdateRequest) {
    if (!this[stateUpdate.location.target]) {
      this[stateUpdate.location.target] = new PublicBoardElement({ x: 0, y: 0, scale: 1 });
    }

    const boardElementTarget = this[stateUpdate.location.target] as PublicBoardElement;

    for (const prop in stateUpdate.slice) {
      if (Object.prototype.hasOwnProperty.call(stateUpdate.slice, prop)) {
        boardElementTarget[prop as Extract<keyof PublicBoardElement, string>] = stateUpdate.slice[prop];
      }
    }
  }

  add(boardElement: BoardElement) {
    this[boardElement.id] = new PublicBoardElement(boardElement);
  }

  // remove
}
