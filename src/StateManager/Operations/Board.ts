import FlowApp from '../../Interfaces/FlowApp';
import { StateUpdateRequest } from '../StateUpdateRequest';
import { PublicBoardState } from '../Representations/Board';
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

  update(property: string, value: PublicBoardState[keyof PublicBoardState], stateUpdate: StateUpdateRequest) {
    const boardElement = this.app.board.getElementById(stateUpdate.location.target);
    if (boardElement) boardElement[property] = value;
    return value;
  }
}
