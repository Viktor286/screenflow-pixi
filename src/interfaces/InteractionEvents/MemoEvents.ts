// import * as PIXI from 'pixi.js';
import Memos, { Memo } from '../Memos';
import DevMonitor from '../DevMonitor';
import PIXI from 'pixi.js';

/** MemoEvent mimics PIXI.interaction.InteractionEvent with targets overwritten **/
interface MemoEvent {
  stopped: boolean;
  target: Memos;
  currentTarget: Memos;
  type: string;
  data: PIXI.interaction.InteractionData;
  stopPropagation(): void;
  reset(): void;
}

export default class MemoEvents {
  constructor(public memo: Memo, public eventMonitor: DevMonitor | null) {
    if (this.eventMonitor instanceof DevMonitor) {
      this.eventMonitor.addDevMonitor('memoEvents');
    }

    this.initStageEvents();
  }

  sendToMonitor(eventName: string, msg: string = '') {
    if (this.eventMonitor instanceof DevMonitor) {
      this.eventMonitor.dispatchMonitor('stageEvents', eventName, msg);
    }
  }

  initStageEvents() {
    // Activate only required events for optimization purposes

    // Events for PIXI.Container: https://pixijs.download/dev/docs/PIXI.Container.html
    // Button example: https://pixijs.io/examples/#/interaction/interactivity.js
    // Mouse & touch events are normalized into
    // the pointer* events for handling different button events.

    // Button events
    // this.on('pointermove', (e: MemoEvent) => this.memoPointerMove(e));
    this.memo.on('pointercancel', (e: MemoEvent) => this.memoPointerCancel(e));
    this.memo.on('pointerdown', (e: MemoEvent) => this.memoPointerDown(e));
    this.memo.on('pointerout', (e: MemoEvent) => this.memoPointerOut(e));
    this.memo.on('pointerover', (e: MemoEvent) => this.memoPointerOver(e));
    this.memo.on('pointertap', (e: MemoEvent) => this.memoPointerTap(e));
    this.memo.on('pointerup', (e: MemoEvent) => this.memoPointerUp(e));
    this.memo.on('pointerupoutside', (e: MemoEvent) => this.memoPointerUpOutside(e));
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
}
