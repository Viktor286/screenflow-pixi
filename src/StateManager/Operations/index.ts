import FlowApp from '../../Interfaces/FlowApp';
import { IPublicCameraState } from '../../Interfaces/Viewport';
import BoardOperations from './Board';
import ViewportOperations from './Viewport';
import { IAppState, IStateScope } from '../index';

export default class Operations {
  boardOperations: BoardOperations;
  viewportOperations: ViewportOperations;

  constructor(public app: FlowApp) {
    this.boardOperations = new BoardOperations(this.app);
    this.viewportOperations = new ViewportOperations(this.app);
  }

  public exec(
    address: IStateScope,
    property: string,
    value: IAppState[keyof IAppState],
  ): number | IPublicCameraState | Promise<IPublicCameraState> | boolean {
    // todo: address system
    // Board (board) operations
    if (address.startsWith('/board')) {
      this.boardOperations.updateBoardElement(address, property, value);
    }

    // Viewport (camera) -- only animation handled at the moment
    if (address === 'camera') {
      this.viewportOperations.updateCamera(property, value);
    }

    // Default return origin value
    return value;
  }
}
