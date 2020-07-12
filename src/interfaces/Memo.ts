import * as PIXI from 'pixi.js';
import { Snapshot } from './Snapshot';

/** MemoEvent mimics PIXI.interaction.InteractionEvent with targets overwritten **/
interface MemoEvent {
  stopped: boolean;
  target: Memo;
  currentTarget: Memo;
  type: string;
  data: PIXI.interaction.InteractionData;
  stopPropagation(): void;
  reset(): void;
}

export default class Memo extends PIXI.Container {
  snapshot: Snapshot;
  selected: boolean;
  selectionDrawing: PIXI.Graphics;
  width: number;
  height: number;

  constructor(texture: PIXI.Texture) {
    super();
    this.snapshot = new Snapshot(texture, this);

    this.width = this.snapshot.width;
    this.height = this.snapshot.height;

    this.selected = false;
    this.selectionDrawing = new PIXI.Graphics();

    this.initMemoEvents();

    this.addChild(this.snapshot.sprite);
    this.addChild(this.selectionDrawing);
  }

  initMemoEvents() {
    // Events for PIXI.Container: https://pixijs.download/dev/docs/PIXI.Container.html
    // Button example: https://pixijs.io/examples/#/interaction/interactivity.js
    // Mouse & touch events are normalized into
    // the pointer* events for handling different button events.

    // Button events
    // this.on('pointermove', (e: MemoEvent) => this.memoPointerMove(e));
    this.on('pointercancel', (e: MemoEvent) => this.memoPointerCancel(e));
    this.on('pointerdown', (e: MemoEvent) => this.memoPointerDown(e));
    this.on('pointerout', (e: MemoEvent) => this.memoPointerOut(e));
    this.on('pointerover', (e: MemoEvent) => this.memoPointerOver(e));
    this.on('pointertap', (e: MemoEvent) => this.memoPointerTap(e));
    this.on('pointerup', (e: MemoEvent) => this.memoPointerUp(e));
    this.on('pointerupoutside', (e: MemoEvent) => this.memoPointerUpOutside(e));
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

  // Event assignments

  memoPointerCancel(e: MemoEvent) {
    console.log('[memo] PointerCancel', e);
  }

  memoPointerDown(e: MemoEvent) {
    console.log('[memo] PointerDown', e);
  }

  memoPointerMove(e: MemoEvent) {
    console.log('[memo] PointerMove', e);
  }

  memoPointerOut(e: MemoEvent) {
    console.log('[memo] PointerOut', e);
  }

  memoPointerOver(e: MemoEvent) {
    console.log('[memo] PointerOver', e);
  }

  memoPointerTap(e: MemoEvent) {
    console.log('[memo] PointerTap', e);
  }

  memoPointerUp(e: MemoEvent) {
    console.log('[memo] PointerUp', e);
  }

  memoPointerUpOutside(e: MemoEvent) {
    console.log('[memo] PointerUpOutside', e);
  }

  /**
   *
   * This function starts non-redux pattern
   *
   **/
  static createMemosFromPixiResources(resources: PIXI.IResourceDictionary): Memo[] {
    let memos: Memo[] = [];
    for (const resource of Object.values(resources)) {
      const s = new Memo(resource.texture);
      memos.push(s);
    }
    return memos;
  }
}
