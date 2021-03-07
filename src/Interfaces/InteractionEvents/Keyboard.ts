import FlowApp from '../FlowApp';
import Mousetrap from 'mousetrap';

export default class Keyboard {
  public holdTimer: ReturnType<typeof setTimeout> | null = null;
  private firstTimeHold = false;

  constructor(public app: FlowApp) {
    this.initShiftTrigger();
  }

  initShiftTrigger() {
    Mousetrap.bind('shift', this.shiftDown, 'keydown');
    Mousetrap.bind('shift', this.shiftUp, 'keyup');
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
        this.app.webUi.setShiftModeState('hold');
        this.firstTimeHold = true;
      }, 100);
    }
  };

  shiftUp = () => {
    if (this.app.webUi.shiftModeState === 'lock') {
      this.app.webUi.setShiftModeState('off');
      if (this.holdTimer) this.resetHoldTimer();
      return;
    }

    if (this.app.webUi.shiftModeState === 'off') {
      this.app.webUi.setShiftModeState('lock');
    }

    if (this.app.webUi.shiftModeState === 'hold') {
      this.app.webUi.setShiftModeState('off');
    }

    if (this.holdTimer) this.resetHoldTimer();
  };
}
