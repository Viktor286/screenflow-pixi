import FlowApp from '../../Interfaces/FlowApp';
import { AsyncId } from './Async';
import { StateUpdateRequest } from '../StateUpdateRequest';
import { PublicBoardState } from '../Representations/Board';

export default class BoardOperations {
  constructor(public app: FlowApp) {}

  animate(stateUpdate: StateUpdateRequest, asyncId: AsyncId) {
    // const id = stateUpdate.targeting[1];
    // const boardElement = this.app.board.state[id].element;
    //
    // if (boardElement) {
    //   boardElement.animateBoardElement(stateUpdate.slice).then((boardElementProps) =>
    //     this.app.stateManager.setState(`/board/${boardElement.id}`, boardElementProps, {
    //       async: 'animated',
    //       asyncId,
    //     }),
    //   );
    // }
  }

  update(property: string, value: PublicBoardState[keyof PublicBoardState], stateUpdate: StateUpdateRequest) {
    // const id = stateUpdate.targeting[1];
    // const boardElement = this.app.board.state[id].element;
    // if (boardElement) boardElement[property] = value;
    return value;
  }
}
