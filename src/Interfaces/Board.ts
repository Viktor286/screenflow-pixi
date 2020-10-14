import FlowApp from './FlowApp';
import BoardElement, { BoardElementContainer, IBoardElementPublicState } from './BoardElement';
import Memo from './Memo';
import Group from './Group';

export interface IPublicBoardState {
  [key: string]: IBoardElementPublicState;
}

export default class Board {
  public readonly state: IPublicBoardState = {};
  public isMemberDragging: boolean | string = false;
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

  public getElementById(elementId: string): BoardElement | undefined {
    const boardStateElement = this.state[elementId];
    if (
      Object.prototype.hasOwnProperty.call(boardStateElement, 'element') &&
      boardStateElement.element instanceof BoardElement
    ) {
      return boardStateElement.element;
    }
    return undefined;
  }

  public getSelectedBoardElement(): BoardElement | undefined {
    if (this.app.board.selected.size > 0) {
      return (this.app.board.selected.values().next().value as unknown) as BoardElement;
    }
    return undefined;
  }

  public getMemos() {
    const displayObject = this.app.viewport.instance.children.filter(
      (el) => el instanceof BoardElementContainer && el.boardElement instanceof Memo,
    ) as BoardElementContainer[];

    return displayObject.map((container) => container.boardElement);
  }

  public getGroups() {
    const displayObject = this.app.viewport.instance.children.filter(
      (el) => el instanceof BoardElementContainer && el.boardElement instanceof Group,
    ) as BoardElementContainer[];

    return displayObject.map((container) => container.boardElement);
  }
}
