import * as PIXI from 'pixi.js';
import { Snapshot } from './Snapshot';
import FlowApp from './FlowApp';

interface IPublicMemosState {
  list: Memo[]; // TODO: create PublicMemo representation
}

export default class Memos {
  publicMemosState: IPublicMemosState;
  selected: Map<string, Memo>;
  isMultiSelect: boolean;

  constructor(public app: FlowApp) {
    this.selected = new Map();
    this.isMultiSelect = false;

    this.publicMemosState = {
      list: [],
    };

    if (this.app.devMonitor) {
      this.app.devMonitor.addDevMonitor('memoEvents');
    }
  }

  addMemo(resource: PIXI.Texture) {
    const memo = new Memo(resource, this.app);
    this.publicMemosState.list.push(memo);
    this.app.viewport.addToViewport(memo);
    this.app.viewport.instance.setChildIndex(memo, 0);
  }

  addMemoToSelected(memo: Memo) {
    if (this.isMultiSelect) {
      this.selectMemo(memo);
    } else {
      this.clearSelectedMemos();
      this.selectMemo(memo);
    }
  }

  selectMemo(memo: Memo) {
    memo.drawSelection();
    this.selected.set(memo.id, memo);
    memo.selected = false;
  }

  deselectMemo(memo: Memo) {
    memo.eraseSelection();
    this.selected.delete(memo.id);
    memo.selected = false;
  }

  clearSelectedMemos() {
    this.selected.forEach((memo) => {
      this.deselectMemo(memo);
    });
  }

  // redrawSelected() {
  //   this.selected.forEach((memo) => {
  //     memo.drawSelection();
  //   });
  // }

  sendEventToMonitor(memo: Memo, eventName: string, msg: string = '') {
    if (this.app.devMonitor) {
      this.app.devMonitor.dispatchMonitor('memoEvents', `[${memo.id}] ${eventName}`, msg);
    }
  }
}

export class Memo extends PIXI.Container {
  snapshot: Snapshot;
  selected: boolean;
  selectionDrawing: PIXI.Graphics;
  id: string;
  width: number;
  height: number;
  memos: Memos;

  constructor(texture: PIXI.Texture, public app: FlowApp) {
    super();
    this.memos = this.app.memos;
    this.id = Math.random().toString(32).slice(2);
    this.snapshot = new Snapshot(texture, this);

    this.width = this.snapshot.width;
    this.height = this.snapshot.height;

    this.selected = false;
    this.selectionDrawing = new PIXI.Graphics();

    this.addChild(this.snapshot.sprite);
    this.addChild(this.selectionDrawing);

    // new MemoEvents(this);
    this.interactive = true;
  }

  select() {
    this.memos.addMemoToSelected(this);
  }

  deselect() {
    // pass
  }

  drawSelection(): void {
    this.selectionDrawing
      .clear()
      .lineStyle(5 / this.app.viewport.scale, 0x73b2ff)
      .drawRect(0, 0, this.snapshot.width, this.snapshot.height);
  }

  eraseSelection() {
    this.selectionDrawing.clear();
  }
}
