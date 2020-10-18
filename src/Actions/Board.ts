import FlowApp from '../Interfaces/FlowApp';
import { IWorldCoords } from '../Interfaces/Viewport';
import BoardElement from '../Interfaces/BoardElement';

export default class BoardActions {
  constructor(public app: FlowApp) {}

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

  public selectElement(boardElement: BoardElement, withMultiSelect = false) {
    const originMultiSelectState = this.app.board.isMultiSelect;
    if (!originMultiSelectState && withMultiSelect) this.app.board.activateMultiselect();
    this.app.board.selectElement(boardElement);
    if (!originMultiSelectState) this.app.board.deactivateMultiselect();

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
