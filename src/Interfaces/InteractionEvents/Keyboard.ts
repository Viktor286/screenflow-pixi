import FlowApp from '../FlowApp';
import Mousetrap from 'mousetrap';

export type ShiftModeState = 'off' | 'hold' | 'lock';

export default class Keyboard {
  public shiftModeState: ShiftModeState = 'off';
  public holdTimer: ReturnType<typeof setTimeout> | null = null;
  private firstTimeHold = false;

  constructor(public app: FlowApp) {
    this.initShiftTrigger();
  }

  initShiftTrigger() {
    Mousetrap.bind('shift', this.shiftDown, 'keydown');
    Mousetrap.bind('shift', this.shiftUp, 'keyup');
  }

  setShiftModeState(state: ShiftModeState) {
    this.shiftModeState = state;
    this.app.webUi.updateShiftMode(this.shiftModeState);
  }

  resetHoldTimer() {
    if (this.holdTimer !== null) {
      clearTimeout(this.holdTimer);
      this.holdTimer = null;
    }
  }

  shiftDown = () => {
    if (this.holdTimer === null) {
      this.holdTimer = setTimeout(() => {
        this.setShiftModeState('hold');
        this.firstTimeHold = true;
      }, 200);
    }
  };

  shiftUp = () => {
    if (this.shiftModeState === 'lock') {
      this.setShiftModeState('off');
      if (this.holdTimer) this.resetHoldTimer();
      return;
    }

    if (this.shiftModeState === 'off') {
      this.setShiftModeState('lock');
    }

    if (this.shiftModeState === 'hold') {
      this.setShiftModeState('off');
    }

    if (this.holdTimer) this.resetHoldTimer();
  };
}
