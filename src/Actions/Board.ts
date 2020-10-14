import FlowApp from '../Interfaces/FlowApp';
import { IWorldCoords } from '../Interfaces/Viewport';
import BoardElement from '../Interfaces/BoardElement';

export default class BoardActions {
  constructor(public app: FlowApp) {}

  public selectElementById(id: string) {
    const el = this.app.board.getElementById(id);
    if (el instanceof BoardElement) {
      el.select();
    }
    // TODO: implement state management for element and group selection
    // this.app.stateManager.setState(`/board/${id}`, {
    //   isSelected: true,
    // });
  }

  public selectElement(boardElement: BoardElement) {
    boardElement.select();
    // TODO: implement state management for element and group selection
    // this.app.stateManager.setState(`/board/${id}`, {
    //   isSelected: true,
    // });
  }

  public deselectElements() {
    this.app.board.clearSelectedElements();
    // TODO: implement state management for element and group selection
    // this.app.stateManager.setState(`/board/${id}`, {
    //   isSelected: true,
    // });
  }

  public startDragElement(boardElement: BoardElement, startPoint: IWorldCoords) {
    boardElement.startDrag(startPoint);
    // TODO: implement state management for element and group dragging
    // this.app.stateManager.setState(`/board/${id}`, {
    //   ???: true,
    // });
  }

  public stopDragElement(boardElement: BoardElement) {
    boardElement.stopDrag();
    // TODO: implement state management for element and group dragging
    // this.app.stateManager.setState(`/board/${id}`, {
    //   ???: true,
    // });
  }

  public scaleElementById(id: string, targetScale?: number) {
    this.app.stateManager.setState(`/board/${id}`, {
      animation: { scale: targetScale },
    });
  }

  public moveElementById(id: string, target: IWorldCoords) {
    const { wX: x, wY: y } = target;
    this.app.stateManager.setState(`/board/${id}`, {
      animation: { x, y },
    });
  }

  public decreaseSelectedElementScale() {
    const boardElement = this.app.board.getSelectedBoardElement();
    if (boardElement) {
      this.app.actions.board.scaleElementById(boardElement.id, boardElement.scale / 1.3);
    }
  }

  public increaseSelectedElementScale() {
    const boardElement = this.app.board.getSelectedBoardElement();
    if (boardElement) {
      this.app.actions.board.scaleElementById(boardElement.id, boardElement.scale * 1.3);
    }
  }
}
