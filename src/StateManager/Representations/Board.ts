// TODO: IMPORTANT -- can we remove PublicState approach with PublicProps for setters
//  and return state like results of .toString() for getState consumers?

import BoardElement from '../../Interfaces/BoardElement';

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

  constructor(boardElement: BoardElement) {
    const { x, y, scale } = boardElement;

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

  merge(stateSlice: Partial<PublicBoardState>) {}

  add(boardElement: BoardElement) {
    this[boardElement.id] = new PublicBoardElement(boardElement);
  }
}
