// @ts-nocheck
import FlowApp from '../../Interfaces/FlowApp';
import { StateUpdateRequest } from '../StateUpdateRequest';
import { PublicBoardState } from '../PublicState/Board';
import { AsyncId } from '../index';

export default class BoardOperations {
  constructor(public app: FlowApp) {}

  animate(stateUpdate: StateUpdateRequest, asyncId: AsyncId) {
    const boardElement = this.app.board.getElementById(stateUpdate.location.target);

    if (boardElement) {
      boardElement.animateBoardElement(stateUpdate.slice).then((boardElementProps) =>
        this.app.stateManager.setState(`/board/${boardElement.id}`, boardElementProps, {
          async: 'animated',
          asyncId,
        }),
      );
    }
  }

  exec(property: string, value: PublicBoardState[keyof PublicBoardState], stateUpdate: StateUpdateRequest) {
    console.log('>> stateUpdate', stateUpdate, property, value);

    const boardElement = this.app.board.getElementById(stateUpdate.location.target);
    if (!boardElement) return undefined;

    // Apply assignment directly
    boardElement[property] = value;
    return value;
  }
}
