import * as PIXI from 'pixi.js';
import FlowApp from './FlowApp';
import { IBoardElement, Memo } from './Memo';

export interface IPublicBoardState {
  [key: string]: IBoardElement;
}

export default class Board {
  public readonly state: IPublicBoardState = {};
  public readonly innerMap: Map<string, Memo> = new Map();
  public selected: Map<string, Memo> = new Map();
  private isMultiSelect: boolean = false;

  constructor(public app: FlowApp) {
    if (this.app.devMonitor) {
      this.app.devMonitor.addDevMonitor('boardEvents');
    }
  }

  public addElement(resource: PIXI.Texture) {
    const boardElement = new Memo(resource, this.app);
    this.innerMap.set(boardElement.id, boardElement);
    this.state[boardElement.id] = boardElement.publicState;
    this.app.viewport.addToViewport(boardElement.container);
    this.app.viewport.instance.setChildIndex(boardElement.container, 0);
  }

  public addElementToSelected(boardElement: Memo) {
    if (this.isMultiSelect) {
      this.selected.set(boardElement.id, boardElement);
    } else {
      this.clearSelectedElements();
      this.selected.set(boardElement.id, boardElement);
    }

    this.app.webUi.updateSelectedMode();
  }

  public removeElementFromSelected(boardElement: Memo) {
    this.selected.delete(boardElement.id);
    this.app.webUi.updateSelectedMode();
  }

  public sendEventToMonitor(boardElement: Memo, eventName: string, msg: string = '') {
    if (this.app.devMonitor) {
      this.app.devMonitor.dispatchMonitor('boardEvents', `[${boardElement.id}] ${eventName}`, msg);
    }
  }

  public clearSelectedElements() {
    this.selected.forEach((boardElement) => boardElement.deselect());
  }

  public tempGetFirstSelectedId() {
    // TODO remove this method
    if (this.app.board.selected.size > 0) {
      return this.app.board.selected.keys().next().value;
    }
  }
}
