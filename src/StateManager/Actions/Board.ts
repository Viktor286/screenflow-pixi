import FlowApp from '../../Interfaces/FlowApp';
import { IWorldCoords } from '../../Interfaces/Viewport';
import BoardElement from '../../Interfaces/BoardElement';
import { ShiftModeState } from '../../Interfaces/Board';

export default class BoardActions {
  constructor(public app: FlowApp) {}

  public createNewMemoOnBoard() {
    // todo: UP NEXT: pipe board actions through stateManager^
  }

  public selectElementById(id: string) {
    const el = this.app.board.getElementById(id);
    if (el instanceof BoardElement) {
      const selected = this.app.board.selectElement(el);
      console.log('selected', selected, selected.tempGroupCreated);
      // TODO: Update state based on selected: SelectionChangeLog
    }
  }

  public selectElement(boardElement: BoardElement) {
    const selected = this.app.board.selectElement(boardElement);
    console.log('selected', selected);
    // TODO: Update state based on selected: SelectionChangeLog
  }

  public deselectElements() {
    const deselected = this.app.board.deselectElement();
    console.log('deselected', deselected);
    // TODO: Update state based on selected: SelectionChangeLog
  }

  public setShiftModeState(state: ShiftModeState = 'off') {
    this.app.board.setShiftModeState(state);
  }

  public deleteSelectedElement() {
    const boardElement = this.app.board.getSelectedElement();
    if (boardElement) {
      this.app.board.deleteBoardElement(boardElement);
    }
  }

  public startDragElement(boardElement: BoardElement, startPoint: IWorldCoords) {
    this.app.board.startDragElement(boardElement, startPoint);
    // no need to update state on startDrag yet
  }

  public stopDragElement(boardElement: BoardElement) {
    this.app.board.stopDragElement(boardElement);
    const { id, x, y } = boardElement;
    this.app.stateManager.setState(
      `/board/${id}`,
      { x, y },
      {
        noOp: true,
      },
    );
  }

  public scaleElementById(id: string, targetScale?: number) {
    this.app.stateManager.setState(`/board/${id}`, { scale: targetScale }, { async: 'animation' });
  }

  public moveElementById(id: string, target: IWorldCoords) {
    const { wX: x, wY: y } = target;
    this.app.stateManager.setState(`/board/${id}`, { x, y }, { async: 'animation' });
  }

  public decreaseSelectedElementScale() {
    const boardElement = this.app.board.getSelectedElement();
    if (boardElement) {
      this.scaleElementById(boardElement.id, boardElement.scale / 1.3);
    }
  }

  public increaseSelectedElementScale() {
    const boardElement = this.app.board.getSelectedElement();
    if (boardElement) {
      this.scaleElementById(boardElement.id, boardElement.scale * 1.3);
    }
  }
}
