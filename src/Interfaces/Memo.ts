import * as PIXI from 'pixi.js';
import { Snapshot } from './Snapshot';
import FlowApp from './FlowApp';
import Memos from './Memos';
import { gsap } from 'gsap';

export interface IPublicMemo {
  x?: number;
  y?: number;
  scale?: number;
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

    this.container.addChild(this.snapshot.sprite);
    this.container.addChild(this.selectionDrawing);

    this.width = this.snapshot.width;
    this.height = this.snapshot.height;

    // new MemoEvents(this);
    this.container.interactive = true;
  }

  get width() {
    return this.container.width;
  }

  set width(val: number) {
    this.container.width = val;
    this.updateCenterPivot();
  }

  get height() {
    return this.container.height;
  }

  set height(val: number) {
    this.container.height = val;
    this.updateCenterPivot();
  }

  get pivotX() {
    return this.container.pivot.x;
  }

  set pivotX(val: number) {
    this.container.pivot.x = val;
  }

  get pivotY() {
    return this.container.pivot.y;
  }

  set pivotY(val: number) {
    this.container.pivot.y = val;
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

  public animateMemo(memoProps: IPublicMemo): Promise<IPublicMemo> {
    return new Promise((resolve) => {
      gsap.to(this, {
        ...memoProps,
        duration: 0.7,
        ease: 'power3.out',
        onStart: () => {
          this.container.interactive = false;
          this.container.zIndex = 1;
        },
        onUpdate: () => {
          // this.app.gui.stageBackTile.updateGraphics();
        },
        onComplete: () => {
          this.container.interactive = true;
          this.container.zIndex = 0; // bring back zIndex after sorting operation
          resolve({ ...memoProps });
        },
      });
    });
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

  private updateCenterPivot() {
    this.pivotX = this.width / 2;
    this.pivotY = this.height / 2;
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
