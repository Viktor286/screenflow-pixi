import FlowApp from '../Interfaces/FlowApp';
// import { Memo } from '../Interfaces/Memos';
import { IWorldScreenCoords } from '../Interfaces/Viewport';

export default class MemoActions {
  constructor(public app: FlowApp) {}

  // addMemoRecord(memo: Memo) {
  //   this.app.stateManager.setState('memos', {
  //     create: memo.publicState,
  //   });
  // }

  public scaleTo(id: string, targetScale?: number) {
    this.app.stateManager.setState(`/memos/${id}`, {
      animation: { scale: targetScale },
    });
  }

  public moveTo(id: string, target: IWorldScreenCoords) {
    const { wX: x, wY: y } = target;
    this.app.stateManager.setState(`/memos/${id}`, {
      animation: { x, y },
    });
  }
}
