import FlowApp from '../Interfaces/FlowApp';
// import { Memo } from '../Interfaces/Memos';
import { IWorldCoords } from '../Interfaces/Viewport';

export default class BoardActions {
  constructor(public app: FlowApp) {}

  public scaleTo(id: string, targetScale?: number) {
    this.app.stateManager.setState(`/board/${id}`, {
      animation: { scale: targetScale },
    });
  }

  public moveTo(id: string, target: IWorldCoords) {
    const { wX: x, wY: y } = target;
    this.app.stateManager.setState(`/board/${id}`, {
      animation: { x, y },
    });
  }
}
