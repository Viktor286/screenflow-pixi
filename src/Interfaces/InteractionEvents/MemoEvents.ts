// import * as PIXI from 'pixi.js';
import PIXI from 'pixi.js';
import Memo from '../Memo';

/** This class might be useful when Memo UI work will begin **/

// MemoEvent mimics PIXI.interaction.InteractionEvent with targets overwritten
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

  private initStageEvents() {
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
    this.memo.container.interactive = true;
    // Normalized "pointer" events
    // this.memo.on('pointermove', (e: MemoEvent) => this.memoPointerMove(e));
    // this.memo.on('pointercancel', (e: MemoEvent) => this.memoPointerCancel(e));
    this.memo.container.on('pointerdown', (e: MemoEvent) => this.memoPointerDown(e));
    // this.memo.on('pointerout', (e: MemoEvent) => this.memoPointerOut(e));
    // this.memo.on('pointerover', (e: MemoEvent) => this.memoPointerOver(e));
    // this.memo.on('pointertap', (e: MemoEvent) => this.memoPointerTap(e));
    this.memo.container.on('pointerup', (e: MemoEvent) => this.memoPointerUp(e));
    // this.memo.on('pointerupoutside', (e: MemoEvent) => this.memoPointerUpOutside(e));

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

  public sendToMonitor(eventName: string, msg: string = '') {
    this.memo.board.sendEventToMonitor(this.memo, eventName, msg);
  }

  // Event assignments

  private memoPointerDown(e: MemoEvent) {
    this.sendToMonitor('Pointer Down');
    // console.log('Pointer Down e.currentTarget', e.currentTarget);
    // console.log('Pointer Down e.target', e.target);
    // This was a try to pass event to stage handlers (no way to avoid double click without turn off stage)
    // this.memo.app.stage.emit('pointerdown', e);
  }

  private memoPointerUp(e: MemoEvent) {
    this.sendToMonitor('Pointer Up');
    // console.log('Pointer Up', e);
  }

  // memoPointerCancel(e: MemoEvent) {
  //   this.sendToMonitor('Pointer Cancel');
  // }
  //
  // memoPointerMove(e: MemoEvent) {
  //   this.sendToMonitor('Pointer Move');
  // }
  //
  // memoPointerOut(e: MemoEvent) {
  //   this.sendToMonitor('Pointer Out');
  // }
  //
  // memoPointerOver(e: MemoEvent) {
  //   this.sendToMonitor('Pointer Over');
  // }
  //
  // memoPointerTap(e: MemoEvent) {
  //   this.sendToMonitor('Pointer Tap');
  // }
  //
  // memoPointerUpOutside(e: MemoEvent) {
  //   this.sendToMonitor('Pointer UpOutside');
  // }
}
