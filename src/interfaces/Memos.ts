import * as PIXI from 'pixi.js';
import { Snapshot } from './Snapshot';
import { MemoEvents } from './InteractionEvents/MemoEvents';
import FlowApp from './FlowApp';

export default class Memos {
  list: Memo[];
  selected: Memo[];

  constructor(public app: FlowApp) {
    this.list = [];
    this.selected = [];

    if (this.app.devMonitor) {
      this.app.devMonitor.addDevMonitor('memoEvents');
    }
  }

  addMemo(resource: PIXI.Texture) {
    const memo = new Memo(resource, this.app);
    this.list.push(memo);
    this.app.viewport.addToViewport(memo);
    this.app.viewport.instance.setChildIndex(memo, 0);
  }

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

    new MemoEvents(this);
  }

  select() {
    this.selected = true;
    // clear list, add current
    this.drawSelection();
  }

  deselect() {
    this.selected = false;
    // clear list, rm current
    this.eraseSelection();
  }

  drawSelection(zoomLevel: number = 1): void {
    this.selectionDrawing
      .clear()
      .lineStyle(1.1 / zoomLevel / this.parent.transform.scale.x, 0x73b2ff)
      .drawRect(0, 0, this.width, this.height);
  }

  eraseSelection() {
    this.selectionDrawing.clear();
  }
}
