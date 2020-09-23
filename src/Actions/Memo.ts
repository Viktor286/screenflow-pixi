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

  scaleTo(id: string, targetScale?: number) {
    this.app.stateManager.setState(`/memos/${id}`, {
      scale: targetScale,
    });
  }

  moveTo(id: string, target: IWorldScreenCoords) {
    const { wX: x, wY: y } = target;
    this.app.stateManager.setState(`/memos/${id}`, {
      x,
      y,
    });
  }
}
