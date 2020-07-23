// import * as PIXI from 'pixi.js';
import { Memo } from '../Memos';
import PIXI from 'pixi.js';

/** MemoEvent mimics PIXI.interaction.InteractionEvent with targets overwritten **/
interface MemoEvent {
  stopped: boolean;
  target: Memo;
  currentTarget: Memo;
  type: string;
  data: PIXI.InteractionData;
  stopPropagation(): void;
  reset(): void;
}

export class MemoEvents {
  constructor(public memo: Memo) {
    this.initStageEvents();
  }

  initStageEvents() {
    // Activate only required events for optimization purposes

    // Events for PIXI.Container: https://pixijs.download/dev/docs/PIXI.Container.html
    // Button example: https://pixijs.io/examples/#/interaction/interactivity.js
    // Mouse & touch events are normalized into
    // the pointer* events for handling different button events.
    this.memo.interactive = true;

    // Button events
    // this.memo.on('pointermove', (e: MemoEvent) => this.memoPointerMove(e));
    this.memo.on('pointercancel', (e: MemoEvent) => this.memoPointerCancel(e));
    this.memo.on('pointerdown', (e: MemoEvent) => this.memoPointerDown(e));
    this.memo.on('pointerout', (e: MemoEvent) => this.memoPointerOut(e));
    this.memo.on('pointerover', (e: MemoEvent) => this.memoPointerOver(e));
    this.memo.on('pointertap', (e: MemoEvent) => this.memoPointerTap(e));
    this.memo.on('pointerup', (e: MemoEvent) => this.memoPointerUp(e));
    this.memo.on('pointerupoutside', (e: MemoEvent) => this.memoPointerUpOutside(e));
  }

  sendToMonitor(eventName: string, msg: string = '') {
    this.memo.memos.sendEventToMonitor(this.memo, eventName, msg);
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
    this.sendToMonitor('PointerOver');
  }

  memoPointerTap(e: MemoEvent) {
    console.log('[memo] PointerTap', e);
    this.sendToMonitor('PointerTap');
  }

  memoPointerUp(e: MemoEvent) {
    console.log('[memo] PointerUp', e);
  }

  memoPointerUpOutside(e: MemoEvent) {
    console.log('[memo] PointerUpOutside', e);
  }
}
