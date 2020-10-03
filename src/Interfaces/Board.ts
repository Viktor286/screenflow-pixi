import FlowApp from './FlowApp';
import BoardElement, { IBoardElementState } from './BoardElement';

export interface IPublicBoardState {
  [key: string]: IBoardElementState;
}

export default class Board {
  public readonly state: IPublicBoardState = {};
  public selected: Map<string, BoardElement> = new Map();
  private isMultiSelect: boolean = false;

  constructor(public app: FlowApp) {
    if (this.app.devMonitor) {
      this.app.devMonitor.addDevMonitor('boardEvents');
    }
  }

  public addBoardElement<T extends BoardElement>(boardElement: T): T {
    this.state[boardElement.id] = boardElement.state;
    this.app.viewport.addToViewport(boardElement.container);
    this.app.viewport.instance.setChildIndex(boardElement.container, 0);
    return boardElement;
  }

  public addElementToSelected(boardElement: BoardElement) {
    if (!this.selected.has(boardElement.id)) {
      if (!this.isMultiSelect) this.clearSelectedElements();
      this.selected.set(boardElement.id, boardElement);
      this.app.webUi.updateSelectedMode();
    }
  }

  public removeElementFromSelected(boardElement: BoardElement) {
    this.selected.delete(boardElement.id);
    this.app.webUi.updateSelectedMode();
  }

  public sendEventToMonitor(boardElement: BoardElement, eventName: string, msg: string = '') {
    if (this.app.devMonitor) {
      this.app.devMonitor.dispatchMonitor('boardEvents', `[${boardElement.id}] ${eventName}`, msg);
    }
  }

  public clearSelectedElements() {
    this.selected.forEach((boardElement: BoardElement) => boardElement.deselect());
  }

  public updateSelectionGraphics() {
    if (this.selected.size > 0) {
      this.selected.forEach((boardElement) => boardElement.drawSelection());
    }
  }

  // TODO remove this method
  public tempGetFirstSelectedId() {
    if (this.app.board.selected.size > 0) {
      return this.app.board.selected.keys().next().value;
    }
  }
}
