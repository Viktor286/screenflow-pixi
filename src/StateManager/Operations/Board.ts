import FlowApp from '../../Interfaces/FlowApp';
import Helpers from '../Helpers';
import { IPublicCameraState } from '../../Interfaces/Viewport';

export default class BoardOperations {
  constructor(public app: FlowApp) {}

  updateBoardElement(address: string, property: string, value: number | IPublicCameraState) {
    if (Helpers.isScopeWithSubDomain(address)) {
      const { target: id } = Helpers.parseSubdomainScope(address);
      const boardElement = this.app.board.state[id].element;

      if (boardElement) {
        // const stateElement = this.getStateElement(stateAddress);

        if (property === 'animation' && typeof value === 'object') {
          boardElement
            .animateBoardElement(value)
            .then((boardElementProps) =>
              this.app.stateManager.setState(`/board/${boardElement.id}`, { ...boardElementProps }),
            );
          // stateElement.animationInProgress = updateValue;
          return true;
        }

        // if (stateElement.animationInProgress) {
        //   delete stateElement.animationInProgress;
        // }

        boardElement[property] = value;
        return value;
      }
    }
  }
}
