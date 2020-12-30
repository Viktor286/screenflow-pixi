import FlowApp from '../../Interfaces/FlowApp';
import { IPublicCameraState } from '../../Interfaces/Viewport';
import BoardOperations from './Board';
import ViewportOperations from './Viewport';

export default class Operations {
  boardOperations: BoardOperations;
  viewportOperations: ViewportOperations;

  constructor(public app: FlowApp) {
    this.boardOperations = new BoardOperations(this.app);
    this.viewportOperations = new ViewportOperations(this.app);
  }

  public exec(
    address: string,
    property: string,
    value: number | IPublicCameraState,
  ): number | IPublicCameraState | Promise<IPublicCameraState> | boolean {
    //
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
