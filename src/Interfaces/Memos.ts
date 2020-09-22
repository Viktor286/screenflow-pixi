import * as PIXI from 'pixi.js';
import { Snapshot } from './Snapshot';
import FlowApp from './FlowApp';

interface IPublicMemosState {
  [key: string]: IPublicMemo;
}

export default class Memos {
  publicMemosState: IPublicMemosState;
  innerMemoMap: Map<string, Memo>;
  selected: Map<string, Memo>;
  isMultiSelect: boolean;

  constructor(public app: FlowApp) {
    this.selected = new Map();
    this.isMultiSelect = false;

    this.innerMemoMap = new Map();
    this.publicMemosState = {};

    if (this.app.devMonitor) {
      this.app.devMonitor.addDevMonitor('memoEvents');
    }
  }

  addMemo(resource: PIXI.Texture) {
    const memo = new Memo(resource, this.app);
    this.innerMemoMap.set(memo.id, memo);
    this.publicMemosState[memo.id] = memo.publicState;
    this.app.viewport.addToViewport(memo.container);
    this.app.viewport.instance.setChildIndex(memo.container, 0);
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

export interface IPublicMemo {
  x: number;
  y: number;
  scale: number;
}

export class Memo {
  snapshot: Snapshot;
  selected: boolean;
  selectionDrawing: PIXI.Graphics;
  id: string;
  publicState: IPublicMemo;
  memos: Memos;
  container: IMemoContainer;
  [key: string]: any;

  constructor(texture: PIXI.Texture, public app: FlowApp) {
    this.memos = this.app.memos;

    this.id = Math.random().toString(32).slice(2);
    this.container = new MemoContainer(this);

    this.snapshot = new Snapshot(texture, this);

    this.width = this.snapshot.width;
    this.height = this.snapshot.height;

    this.selected = false;
    this.selectionDrawing = new PIXI.Graphics();

    this.publicState = {
      x: 0,
      y: 0,
      scale: 1,
    };

    this.container.addChild(this.snapshot.sprite);
    this.container.addChild(this.selectionDrawing);

    // new MemoEvents(this);
    this.container.interactive = true;
  }

  // set wX(wX: number) {
  //   // void
  // }
  //
  // get wX() {
  //   return this.publicCameraState.wX;
  // }
  //
  // set wY(wY: number) {
  //   // void
  // }
  //
  // get wY() {
  //   return this.publicCameraState.wY;
  // }

  get width() {
    return this.container.width;
  }

  set width(val: number) {
    this.container.width = val;
  }

  get height() {
    return this.container.height;
  }

  set height(val: number) {
    this.container.height = val;
  }

  get x() {
    return this.container.x;
  }

  set x(val: number) {
    this.container.x = val;
  }

  get y() {
    return this.container.y;
  }

  set y(val: number) {
    this.container.y = val;
  }

  get scale() {
    return this.container.scale.x;
  }

  set scale(val: number) {
    this.container.scale.x = val;
    this.container.scale.y = val;
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

export interface IMemoContainer extends PIXI.Container {
  memo: Memo;
}

export class MemoContainer extends PIXI.Container implements IMemoContainer {
  constructor(public memo: Memo) {
    super();
  }
}
