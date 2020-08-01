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
    // TODO: we need to define list of universal events

    // Singe Press
    // Double Press
    // Triple Press

    // Singe Press + hold timer
    // Double Press + hold timer

    // Slide -- very unnatural for focus
    // maybe could be removed to slide-jump or edge-slide

    // Activate only required events for optimization purposes

    // Events for PIXI.Container: https://pixijs.download/dev/docs/PIXI.Container.html
    // Button example: https://pixijs.io/examples/#/interaction/interactivity.js
    // Mouse & touch events are normalized into
    // the pointer* events for handling different button events.
    this.memo.interactive = true;

    // Normalized "pointer" events
    // this.memo.on('pointermove', (e: MemoEvent) => this.memoPointerMove(e));
    this.memo.on('pointercancel', (e: MemoEvent) => this.memoPointerCancel(e));
    this.memo.on('pointerdown', (e: MemoEvent) => this.memoPointerDown(e));
    this.memo.on('pointerout', (e: MemoEvent) => this.memoPointerOut(e));
    this.memo.on('pointerover', (e: MemoEvent) => this.memoPointerOver(e));
    this.memo.on('pointertap', (e: MemoEvent) => this.memoPointerTap(e));
    this.memo.on('pointerup', (e: MemoEvent) => this.memoPointerUp(e));
    this.memo.on('pointerupoutside', (e: MemoEvent) => this.memoPointerUpOutside(e));

    // Touch-device specific events
    // this.memo.on('tap', (e: MemoEvent) => this.memoTap(e));
    // this.memo.on('touchstart', (e: MemoEvent) => this.memoTouchStart(e));
    // this.memo.on('touchend', (e: MemoEvent) => this.memoTouchEnd(e));
    // touchcancel
    // touchend
    // touchendoutside
    // touchmove
    // touchstart
  }

  sendToMonitor(eventName: string, msg: string = '') {
    this.memo.memos.sendEventToMonitor(this.memo, eventName, msg);
  }

  // Event assignments

  memoPointerCancel(e: MemoEvent) {
    console.log('[memo] PointerCancel', e);
    this.sendToMonitor('Pointer Cancel');
  }

  memoPointerDown(e: MemoEvent) {
    console.log('[memo] PointerDown', e);
    this.sendToMonitor('Pointer Down');
  }

  memoPointerMove(e: MemoEvent) {
    console.log('[memo] PointerMove', e);
    this.sendToMonitor('Pointer Move');
  }

  memoPointerOut(e: MemoEvent) {
    console.log('[memo] PointerOut', e);
    this.sendToMonitor('Pointer Out');
  }

  memoPointerOver(e: MemoEvent) {
    console.log('[memo] PointerOver', e);
    this.sendToMonitor('Pointer Over');
  }

  memoPointerTap(e: MemoEvent) {
    console.log('[memo] PointerTap', e);
    this.sendToMonitor('Pointer Tap');
  }

  memoPointerUp(e: MemoEvent) {
    console.log('[memo] PointerUp', e);
    this.sendToMonitor('Pointer Up');
  }

  memoPointerUpOutside(e: MemoEvent) {
    console.log('[memo] PointerUpOutside', e);
    this.sendToMonitor('Pointer UpOutside');
  }

  // memoTap(e: MemoEvent) {
  //   console.log('[memo] Tap', e);
  //   this.sendToMonitor('Tap');
  // }
  //
  // memoTouchStart(e: MemoEvent) {
  //   console.log('[memo] PointerTap', e);
  //   this.sendToMonitor('PointerTap');
  // }
  //
  // memoTouchEnd(e: MemoEvent) {
  //   this.sendToMonitor('TouchEnd');
  //   console.log('[memo] TouchEnd', e);
  // }
}
