import * as PIXI from 'pixi.js';
import FlowApp from './FlowApp';
import { IPublicMemo, Memo } from './Memo';

export interface IPublicBoardState {
  [key: string]: IPublicMemo;
}

export default class Board {
  public readonly state: IPublicBoardState = {};
  public readonly innerMemoMap: Map<string, Memo> = new Map();
  public selected: Map<string, Memo> = new Map();
  private isMultiSelect: boolean = false;

  constructor(public app: FlowApp) {
    if (this.app.devMonitor) {
      this.app.devMonitor.addDevMonitor('memoEvents');
    }
  }

  public addMemo(resource: PIXI.Texture) {
    const memo = new Memo(resource, this.app);
    this.innerMemoMap.set(memo.id, memo);
    this.state[memo.id] = memo.publicState;
    this.app.viewport.addToViewport(memo.container);
    this.app.viewport.instance.setChildIndex(memo.container, 0);
  }

  public addMemoToSelected(memo: Memo) {
    if (this.isMultiSelect) {
      this.selected.set(memo.id, memo);
    } else {
      this.clearSelectedMemos();
      this.selected.set(memo.id, memo);
    }

    this.app.webUi.updateSelectedMode();
  }

  public removeMemoFromSelected(memo: Memo) {
    this.selected.delete(memo.id);
    this.app.webUi.updateSelectedMode();
  }

  public sendEventToMonitor(memo: Memo, eventName: string, msg: string = '') {
    if (this.app.devMonitor) {
      this.app.devMonitor.dispatchMonitor('memoEvents', `[${memo.id}] ${eventName}`, msg);
    }
  }

  public clearSelectedMemos() {
    this.selected.forEach((memo) => memo.deselect());
  }

  public tempGetFirstSelectedId() {
    if (this.app.board.selected.size > 0) {
      return this.app.board.selected.keys().next().value;
    }
  }
}
