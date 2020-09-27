import StageEvents, { StageEvent } from './StageEvents';
import FlowApp from '../FlowApp';
import { IScreenCoords, IWorldCoords } from '../Viewport';
import { MemoContainer } from '../Memo';

type IGestureEvent = {
  screenClick: IScreenCoords;
  worldClick: IWorldCoords;
};

export default class TimedGesture {
  private app: FlowApp;
  private readonly sendToMonitor = this.stageEvents.sendToMonitor;

  // Timed-gestures event manager
  private awaiting: boolean | string = false;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private clickCnt = 0;

  // touchpad handle < 400 badly, but with that amount desktop mouse shows dbclick too soon
  //  desktop mouse show fine result < 300
  private readonly doubleClickThreshold = 320;

  constructor(public stageEvents: StageEvents) {
    this.app = stageEvents.app;
  }

  // TODO: this helper belongs to eventMonitor class?
  //  we need figure out what scope can use this TimedGesture controller
  private getClickInfoStr(e: IGestureEvent) {
    if (this.app.stageEvents.eventMonitor) {
      return `${Math.round(e.screenClick.sX)} : ${Math.round(e.screenClick.sY)}`;
    }
  }

  private getGestureEvent(e: StageEvent): IGestureEvent {
    return {
      screenClick: this.app.viewport.getScreenCoordsFromEvent(e),
      worldClick: this.app.viewport.getWorldScreenCoordsFromEvent(e),
    };
  }

  public pointerDownGate(e: StageEvent) {
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
        if (this.app.viewport.slideControls.isSliding) {
          return;
        }

        if (this.awaiting) {
          // Tier 1: quick-press
          this.awaiting = 'quick';
          this.pressDownQuick(gestureEvent);
          this.timer = setTimeout(() => {
            if (this.app.viewport.slideControls.isSliding) {
              return;
            }

            if (this.awaiting) {
              // Tier 2: medium-press
              this.awaiting = 'medium';
              this.pressDownMedium(gestureEvent);
              this.timer = setTimeout(() => {
                if (this.app.viewport.slideControls.isSliding) {
                  return;
                }

                if (this.awaiting) {
                  // Tier 3: long-press
                  this.awaiting = 'long';
                  this.pressDownLong(gestureEvent);
                }
              }, 1000);
            }
          }, 800);
        }
      }, 250);
    }
  }

  public pointerUpGate(e: StageEvent) {
    // Timed-gestures handlers
    if (this.app.viewport.slideControls.isSliding) {
      this.awaiting = false;
      return;
    }

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
  private pressUpImmediate(e: IGestureEvent) {
    const hit = this.app.engine.renderer.plugins.interaction.hitTest({
      x: e.screenClick.sX,
      y: e.screenClick.sY,
    });

    if (hit instanceof MemoContainer) {
      const memo = hit.memo;
      if (memo.selected) {
        // fitToArea action adds more confusion than benefit when user clicked on selected memo
        // this.app.actions.viewport.fitToArea({ wX: x, wY: y }, width, height);
      } else {
        memo.select();
      }

      console.log(`pressUpImmediate Memo clicked "${memo.id}" `, memo);
    } else {
      this.app.board.clearSelectedElements();
    }

    this.sendToMonitor('Immediate Press Up', this.getClickInfoStr(e));
  }

  private pressUpQuick(e: IGestureEvent) {
    this.app.actions.viewport.moveTo(e.worldClick);
    this.sendToMonitor('Quick Press Up', this.getClickInfoStr(e));
  }

  private pressUpMedium(e: IGestureEvent) {
    this.sendToMonitor('Medium Press Up', this.getClickInfoStr(e));
  }

  private pressUpLong(e: IGestureEvent) {
    this.sendToMonitor('Long Press Up', this.getClickInfoStr(e));
  }

  // Additional events
  private doubleClick(e: IGestureEvent) {
    this.sendToMonitor('DoubleClick', this.getClickInfoStr(e));

    const hit = this.app.engine.renderer.plugins.interaction.hitTest({
      x: e.screenClick.sX,
      y: e.screenClick.sY,
    });

    // fitToArea Or ZoomIn
    if (hit instanceof MemoContainer) {
      const { x, y, width, height } = hit.memo;
      const targetScale = this.app.viewport.findScaleFit(width, height);
      if (
        this.app.viewport.scale >=
          targetScale + (targetScale / 100) * this.app.viewport.fitAreaMarginPercent ||
        (Math.round(this.app.viewport.getScreenCenterInWord().wX) === x &&
          Math.round(this.app.viewport.getScreenCenterInWord().wY) === y)
      ) {
        this.app.actions.viewport.zoomIn(e.worldClick);
      } else {
        this.app.actions.viewport.fitToArea({ wX: x, wY: y }, width, height);
        hit.memo.select();
      }
    } else {
      this.app.actions.viewport.zoomIn(e.worldClick);
    }
  }

  // Press Down events
  private pressDownImmediate(e: IGestureEvent) {
    // ImmediatePressDown event could be too frequent,
    // its probably best choice to use ImmediatePressUp
    this.app.gui.focusPoint.putFocusPoint(e.worldClick);
    // console.log('worldClick', e.worldClick.wX, e.worldClick.wY);
    // console.log('screenClick', e.screenClick.sX, e.screenClick.sY);
    this.sendToMonitor('Immediate Press Down', this.getClickInfoStr(e));
  }

  private pressDownQuick(e: IGestureEvent) {
    this.app.gui.focusPoint.putFocusPoint(e.worldClick);
    this.sendToMonitor('Quick Press Down', this.getClickInfoStr(e));
  }

  private pressDownMedium(e: IGestureEvent) {
    this.app.gui.focusPoint.putFocusPoint(e.worldClick);
    this.sendToMonitor('Medium Press Down', this.getClickInfoStr(e));
  }

  private pressDownLong(e: IGestureEvent) {
    this.app.gui.focusPoint.putFocusPoint(e.worldClick);
    this.sendToMonitor('Long Press Down', this.getClickInfoStr(e));
  }
}
