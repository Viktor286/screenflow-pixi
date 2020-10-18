import StageEvents, { StageEvent } from './StageEvents';
import FlowApp from '../FlowApp';
import BoardElement, { BoardElementContainer } from '../BoardElement';
import { IScreenCoords, IWorldCoords } from '../Viewport';

interface IGestureEvent extends StageEvent {
  screenClick: IScreenCoords;
  worldClick: IWorldCoords;
  isBoardElementHit?: BoardElement | undefined;
}

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
    const gestureEvent: IGestureEvent = {
      ...e,
      stopPropagation: e.stopPropagation,
      reset: e.reset,
      screenClick: this.app.viewport.getScreenCoordsFromEvent(e),
      worldClick: this.app.viewport.getWorldScreenCoordsFromEvent(e),
    };

    // Perform preliminary hit detection
    const hit = this.app.engine.renderer.plugins.interaction.hitTest({
      x: gestureEvent.screenClick.sX,
      y: gestureEvent.screenClick.sY,
    });

    if (hit instanceof BoardElementContainer) {
      gestureEvent.isBoardElementHit = hit.boardElement;
    }

    return gestureEvent;
  }

  public pointerDownGate(e: StageEvent) {
    // Timed-gestures manager
    this.awaiting = true;
    this.clickCnt += 1;

    // reset for doubleClick
    setTimeout(() => (this.clickCnt = 0), this.doubleClickThreshold);

    // Tier 0: Immediate "Select" press
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

                // if (this.awaiting) {
                //   // Tier 3: long-press
                //   this.awaiting = 'long';
                //   this.pressDownLong(gestureEvent);
                // }
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

    if (this.app.board.isMemberDragging) {
      const boardElement = this.app.board.getSelectedElement();
      if (
        boardElement &&
        boardElement.startDragPoint &&
        gestureEvent.worldClick.wX !== boardElement.startDragPoint.wX &&
        gestureEvent.worldClick.wY !== boardElement.startDragPoint.wY
      ) {
        this.app.actions.board.stopDragElement(boardElement);
        this.awaiting = false;
      }
    }

    // Distinguish single click and double click handlers
    // filter out timed gestures while double-click
    if (this.clickCnt < 2) {
      // Tier 0: Immediate "Select" press
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

      // // Tier 3: long-press
      // if (this.awaiting === 'long') this.pressUpLong(gestureEvent);

      this.app.viewport.slideControls.unpauseSlideControls();
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
    if (e.isBoardElementHit instanceof BoardElement) {
      const withMultiSelect = this.app.keyboard.shiftModeState !== 'off';
      this.app.actions.board.selectElement(e.isBoardElementHit, withMultiSelect);
      console.log(`pressUpImmediate Memo clicked "${e.isBoardElementHit.id}" `, e.isBoardElementHit);
    } else {
      this.app.actions.board.deselectElements();
    }

    this.sendToMonitor('Immediate Press Up', this.getClickInfoStr(e));
  }

  private pressUpQuick(e: IGestureEvent) {
    this.app.actions.viewport.moveTo(e.worldClick);
    // here most likely will be rectangular selection start

    this.sendToMonitor('Quick Press Up', this.getClickInfoStr(e));
  }

  private pressUpMedium(e: IGestureEvent) {
    this.sendToMonitor('Medium Press Up', this.getClickInfoStr(e));
  }

  // private pressUpLong(e: IGestureEvent) {
  //   this.sendToMonitor('Long Press Up', this.getClickInfoStr(e));
  // }

  // Additional events
  private doubleClick(e: IGestureEvent) {
    this.sendToMonitor('DoubleClick', this.getClickInfoStr(e));

    const gestureEvent = this.getGestureEvent(e);

    // fitToArea Or ZoomIn
    if (gestureEvent.isBoardElementHit instanceof BoardElement) {
      this.app.actions.viewport.fitToBoardElement(gestureEvent.isBoardElementHit);
      this.app.actions.board.selectElement(gestureEvent.isBoardElementHit);
    } else {
      this.app.actions.viewport.zoomIn(e.worldClick);
    }
  }

  // Press Down events
  private pressDownImmediate(e: IGestureEvent) {
    // ImmediatePressDown event could be too frequent,
    // its probably best choice to use ImmediatePressUp
    if (e.isBoardElementHit instanceof BoardElement) {
      if (e.isBoardElementHit.isDragging) {
        this.app.actions.board.stopDragElement(e.isBoardElementHit);
        this.awaiting = false;
      }
    }

    // this.app.gui.focusPoint.putFocusPoint(e.worldClick);
    console.log('worldClick', e.worldClick.wX, e.worldClick.wY);
    console.log('screenClick', e.screenClick.sX, e.screenClick.sY);
    this.sendToMonitor('Immediate Press Down', this.getClickInfoStr(e));
  }

  private pressDownQuick(e: IGestureEvent) {
    this.app.viewport.slideControls.pauseSlideControls();

    if (e.isBoardElementHit instanceof BoardElement) {
      if (!e.isBoardElementHit.isDragging) {
        this.app.actions.board.startDragElement(e.isBoardElementHit, e.worldClick);
        this.awaiting = false;
      }
    }

    this.app.gui.focusPoint.putFocusPoint(e.worldClick);
    this.sendToMonitor('Quick Press Down', this.getClickInfoStr(e));
  }

  private pressDownMedium(e: IGestureEvent) {
    this.app.gui.focusPoint.putFocusPoint(e.worldClick);
    this.sendToMonitor('Medium Press Down', this.getClickInfoStr(e));
  }

  // private pressDownLong(e: IGestureEvent) {
  //   this.app.gui.focusPoint.putFocusPoint(e.worldClick);
  //   this.sendToMonitor('Long Press Down', this.getClickInfoStr(e));
  // }
}
