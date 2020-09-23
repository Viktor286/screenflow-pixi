import * as PIXI from 'pixi.js';
import { Snapshot } from './Snapshot';
import FlowApp from './FlowApp';
import Memos from './Memos';

export interface IPublicMemo {
  x: number;
  y: number;
  scale: number;
}

export class Memo {
  public selected = false;
  public container = new MemoContainer(this);
  private selectionDrawing = new PIXI.Graphics();

  private snapshot: Snapshot;
  public readonly memos: Memos = this.app.memos;
  public readonly id: string;
  public readonly publicState: IPublicMemo = {
    x: 0,
    y: 0,
    scale: 1,
  };

  [key: string]: any;

  constructor(texture: PIXI.Texture, public app: FlowApp) {
    this.id = Math.random().toString(32).slice(2);
    this.snapshot = new Snapshot(texture, this);

    this.width = this.snapshot.width;
    this.height = this.snapshot.height;

    this.container.addChild(this.snapshot.sprite);
    this.container.addChild(this.selectionDrawing);

    // new MemoEvents(this);
    this.container.interactive = true;
  }

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

  public select() {
    this.memos.addMemoToSelected(this);
    this.selected = true;
    this.drawSelection();
  }

  public deselect() {
    this.memos.removeMemoFromSelected(this);
    this.selected = false;
    this.eraseSelection();
  }

  private drawSelection(): void {
    this.selectionDrawing
      .clear()
      .lineStyle(5 / this.app.viewport.scale, 0x73b2ff)
      .drawRect(0, 0, this.snapshot.width, this.snapshot.height);
  }

  private eraseSelection() {
    this.selectionDrawing.clear();
  }
}

interface IMemoContainer extends PIXI.Container {
  memo: Memo;
}

export class MemoContainer extends PIXI.Container implements IMemoContainer {
  constructor(public memo: Memo) {
    super();
  }
}
