import FlowApp from '../../Interfaces/FlowApp';
import Viewport, { IPublicViewportState } from '../../Interfaces/Viewport';
import { AsyncId } from './Async';
import { StateUpdateRequest } from '../StateUpdateRequest';

export default class BoardOperations {
  constructor(public app: FlowApp) {}

  get originState() {
    return this.app.board.state;
  }

  animate(stateUpdate: StateUpdateRequest, asyncId: AsyncId) {
    const id = stateUpdate.targeting[1];
    const boardElement = this.app.board.state[id].element;

    if (boardElement) {
      boardElement.animateBoardElement(stateUpdate.slice).then((boardElementProps) =>
        this.app.stateManager.setState(`/board/${boardElement.id}`, boardElementProps, {
          async: 'animated',
          asyncId,
        }),
      );
    }
  }

  update(
    property: Extract<keyof Viewport, string>,
    value: IPublicViewportState[keyof IPublicViewportState],
    stateUpdate: StateUpdateRequest,
  ) {
    const id = stateUpdate.targeting[1];
    const boardElement = this.app.board.state[id].element;
    if (boardElement) boardElement[property] = value;
    return value;
  }
}
