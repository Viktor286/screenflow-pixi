import StageEvents, { StageEvent } from './StageEvents';
import { Memo } from '../Memos';
import FlowApp from '../FlowApp';
import { IScreenCoords, IWorldScreenCoords } from '../Viewport';

type IGestureEvent = {
  screenClick: IScreenCoords;
  wordScreenClick: IWorldScreenCoords;
};

export default class TimedGesture {
  app: FlowApp;
  sendToMonitor: Function;

  awaiting: boolean | string;
  timer: ReturnType<typeof setTimeout> | null;
  clickCnt: number;
  doubleClickThreshold: number;

  constructor(public stageEvents: StageEvents) {
    this.app = stageEvents.app;
    this.sendToMonitor = this.stageEvents.sendToMonitor;

    // Timed-gestures event manager
    this.clickCnt = 0;
    this.awaiting = false;
    this.timer = null;

    // touchpad handle < 400 badly, but with that amount desktop mouse shows dbclick too soon
    //  desktop mouse show fine result < 300
    this.doubleClickThreshold = 320;
  }

  // TODO: this helper belongs to eventMonitor class?
  //  we need figure out what scope can use this TimedGesture controller
  getClickInfoStr(e: IGestureEvent) {
    if (this.app.stageEvents.eventMonitor) {
      return `${Math.round(e.screenClick.sX)} : ${Math.round(e.screenClick.sY)}`;
    }
  }

  getGestureEvent(e: StageEvent): IGestureEvent {
    return {
      screenClick: this.app.viewport.getScreenCoordsFromEvent(e),
      wordScreenClick: this.app.viewport.getWorldScreenCoordsFromEvent(e),
    };
  }

  pointerDownGate(e: StageEvent) {
    // Timed-gestures manager
    this.awaiting = true;
    this.clickCnt += 1;

    // reset for doubleClick
    setTimeout(() => (this.clickCnt = 0), this.doubleClickThreshold);

    // Tier 0: Immediate "select" press
    // Block second immediate click for double-click case
    if (this.clickCnt < 2) {
      // Required data from the input event should be preserved here
      // otherwise event data will be obtained respecting the Gestures delay state (not state from a click)
      const gestureEvent = this.getGestureEvent(e);

      this.pressDownImmediate(gestureEvent);
      this.timer = setTimeout(() => {
        if (this.awaiting) {
          // Tier 1: quick-press
          this.awaiting = 'quick';
          this.pressDownQuick(gestureEvent);
          this.timer = setTimeout(() => {
            if (this.awaiting) {
              // Tier 2: medium-press
              this.awaiting = 'medium';
              this.pressDownMedium(gestureEvent);
              this.timer = setTimeout(() => {
                if (this.awaiting) {
                  // Tier 3: long-press
                  this.awaiting = 'long';
                  this.pressDownLong(gestureEvent);
                }
              }, 1000);
            }
          }, 800);
        }
      }, 200);
    }
  }

  pointerUpGate(e: StageEvent) {
    // Timed-gestures handlers

    // Required data from the input event should be preserved here
    // otherwise event data will be obtained respecting the Gestures delay state (not state from a click)
    const gestureEvent = this.getGestureEvent(e);

    // Distinguish single click and double click handlers
    // filter out timed gestures while double-click
    if (this.clickCnt < 2) {
      // Tier 0: Immediate "select" press
      // No ImmediatePressUp while timed gestures are active
      if (this.awaiting !== 'quick' && this.awaiting !== 'medium' && this.awaiting !== 'long') {
        // this is experimental hack to workaround stageImmediatePressUp intersection with double click
        setTimeout(() => {
          // Workaround for the case when ImmediatePressUp will be triggered as part of double click event
          // (approach when stageImmediatePressUp set with timeout 200
          if (this.clickCnt < 2) {
            this.pressUpImmediate(gestureEvent);
          }
        }, 200);
      }

      // Tier 1: quick-press
      if (this.awaiting === 'quick') this.pressUpQuick(gestureEvent);

      // Tier 2: medium-press
      if (this.awaiting === 'medium') this.pressUpMedium(gestureEvent);

      // Tier 3: long-press
      if (this.awaiting === 'long') this.pressUpLong(gestureEvent);
    } else {
      // Double click handlers
      this.doubleClick(gestureEvent);
    }

    this.awaiting = false;
    if (this.timer) clearTimeout(this.timer);
  }

  // Timed-gestures special events
  // Press Up events
  pressUpImmediate(e: IGestureEvent) {
    const hit = this.app.engine.renderer.plugins.interaction.hitTest({
      x: e.screenClick.sX,
      y: e.screenClick.sY,
    });

    if (hit instanceof Memo) {
      const memo = hit;
      memo.select();
      console.log(`Memo clicked "${memo.id}" `, memo);
    }

    this.sendToMonitor('Immediate Press Up', this.getClickInfoStr(e));
  }

  pressUpQuick(e: IGestureEvent) {
    this.app.actions.viewportMoveTo(e.wordScreenClick);
    this.sendToMonitor('Quick Press Up', this.getClickInfoStr(e));
  }

  pressUpMedium(e: IGestureEvent) {
    this.sendToMonitor('Medium Press Up', this.getClickInfoStr(e));
  }

  pressUpLong(e: IGestureEvent) {
    this.sendToMonitor('Long Press Up', this.getClickInfoStr(e));
  }

  // Additional events
  doubleClick(e: IGestureEvent) {
    this.sendToMonitor('DoubleClick', this.getClickInfoStr(e));
    this.app.actions.viewportZoomIn(e.wordScreenClick);
  }

  // Press Down events
  pressDownImmediate(e: IGestureEvent) {
    // ImmediatePressDown event could be too frequent,
    // its probably best choice to use ImmediatePressUp
    this.app.gui.focusPoint.putFocusPoint(e.wordScreenClick);
    this.sendToMonitor('Immediate Press Down', this.getClickInfoStr(e));
  }

  pressDownQuick(e: IGestureEvent) {
    this.app.gui.focusPoint.putFocusPoint(e.wordScreenClick);
    this.sendToMonitor('Quick Press Down', this.getClickInfoStr(e));
  }

  pressDownMedium(e: IGestureEvent) {
    this.app.gui.focusPoint.putFocusPoint(e.wordScreenClick);
    this.sendToMonitor('Medium Press Down', this.getClickInfoStr(e));
  }

  pressDownLong(e: IGestureEvent) {
    this.app.gui.focusPoint.putFocusPoint(e.wordScreenClick);
    this.sendToMonitor('Long Press Down', this.getClickInfoStr(e));
  }
}
