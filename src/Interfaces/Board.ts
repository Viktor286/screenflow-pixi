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
  public selection: BoardElement | undefined = undefined;

  constructor(public app: FlowApp) {
    if (this.app.devMonitor) {
      this.app.devMonitor.addDevMonitor('boardEvents');
    }
  }

  public addElementToBoard<T extends BoardElement>(boardElement: T): T {
    this.state[boardElement.id] = boardElement.state;
    this.app.viewport.addToViewport(boardElement.container);
    this.app.viewport.instance.setChildIndex(boardElement.container, 0);
    return boardElement;
  }

  public selectElement(boardElement: BoardElement) {
    if (this.selection && this.selection.id !== boardElement.id) {
      this.deselectElement();
    }

    if (!this.selection) {
      this.selection = boardElement;
      this.selection.onSelect();
      this.app.webUi.updateSelectedMode();
    }
  }

  public deselectElement() {
    if (this.selection) {
      this.selection.onDeselect();
      this.selection = undefined;
      this.app.webUi.updateSelectedMode();
    }
  }

  public updateSelectionGraphics() {
    if (this.selection) {
      this.selection.drawSelection();
    }
  }

  public getSelectedElement(): BoardElement | undefined {
    return this.app.board.selection;
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

  public sendEventToMonitor(boardElement: BoardElement, eventName: string, msg: string = '') {
    if (this.app.devMonitor) {
      this.app.devMonitor.dispatchMonitor('boardEvents', `[${boardElement.id}] ${eventName}`, msg);
    }
  }
}
