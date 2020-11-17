import FlowApp from '../Interfaces/FlowApp';
import { IWorldCoords } from '../Interfaces/Viewport';
import BoardElement from '../Interfaces/BoardElement';
import { ShiftModeState } from '../Interfaces/Board';

export default class BoardActions {
  constructor(public app: FlowApp) {}

  public createNewMemoOnBoard() {
    // todo: ^
  }

  public selectElementById(id: string) {
    const el = this.app.board.getElementById(id);
    if (el instanceof BoardElement) {
      this.app.board.selectElement(el);
    }
    // TODO: implement state management for element and group selection
    // this.app.stateManager.setState(`/board/${id}`, {
    //   isSelected: true,
    // });
  }

  public selectElement(boardElement: BoardElement) {
    this.app.board.selectElement(boardElement);

    // TODO: implement state management for element and group selection
    // this.app.stateManager.setState(`/board/${id}`, {
    //   isSelected: true,
    // });
  }

  public deselectElements() {
    this.app.board.deselectElement();
    // TODO: implement state management for element and group selection
    // this.app.stateManager.setState(`/board/${id}`, {
    //   isSelected: true,
    // });
  }

  public setShiftModeState(state: ShiftModeState = 'off') {
    this.app.board.setShiftModeState(state);
  }

  public deleteSelectedElement() {
    // TODO: implement state management for element deletion
    const boardElement = this.app.board.getSelectedElement();
    if (boardElement) {
      this.app.board.deleteBoardElement(boardElement);
    }
  }

  public startDragElement(boardElement: BoardElement, startPoint: IWorldCoords) {
    this.app.board.startDragElement(boardElement, startPoint);
    // TODO: implement state management for element and group dragging
    // this.app.stateManager.setState(`/board/${id}`, {
    //   ???: true,
    // });
  }

  public stopDragElement(boardElement: BoardElement) {
    this.app.board.stopDragElement(boardElement);
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
    const boardElement = this.app.board.getSelectedElement();
    if (boardElement) {
      this.app.actions.board.scaleElementById(boardElement.id, boardElement.scale / 1.3);
    }
  }

  public increaseSelectedElementScale() {
    const boardElement = this.app.board.getSelectedElement();
    if (boardElement) {
      this.app.actions.board.scaleElementById(boardElement.id, boardElement.scale * 1.3);
    }
  }
}
