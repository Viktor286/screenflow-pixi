import StageEvents, { StageEvent } from './StageEvents';
import { Memo } from '../Memos';
import PIXI from 'pixi.js';
import FlowApp from '../FlowApp';

export default class TimedGesture {
  app: FlowApp;
  sendToMonitor: Function;

  awaiting: boolean | string;
  timer: ReturnType<typeof setTimeout> | null;
  clickCnt: number;

  constructor(public stageEvents: StageEvents) {
    this.app = stageEvents.app;
    this.sendToMonitor = this.stageEvents.sendToMonitor;

    // Timed-gestures event manager
    this.clickCnt = 0;
    this.awaiting = false;
    this.timer = null;
  }

  // TODO: this helper belongs to eventMonitor class?
  //  we need figure out what scope can use this TimedGesture controller
  getClickInfoStr(e: StageEvent) {
    if (this.app.stageEvents.eventMonitor) {
      return this.app.stageEvents.eventMonitor.pointToStr(this.app.viewport.getWorldScreenCoordsFromEvent(e));
    }
  }

  pointerDownGate(e: PIXI.InteractionEvent) {
    // Timed-gestures manager
    this.awaiting = true;
    this.clickCnt += 1;
    setTimeout(() => (this.clickCnt = 0), 400); // double click threshold (touchpad handle < 400 badly)

    // Tier 0: Immediate "select" press
    // Block second immediate click for double-click case
    if (this.clickCnt < 2) {
      this.pressDownImmediate(e);
      this.timer = setTimeout(() => {
        if (this.awaiting) {
          // Tier 1: quick-press
          this.awaiting = 'quick';
          this.pressDownQuick(e);
          this.timer = setTimeout(() => {
            if (this.awaiting) {
              // Tier 2: medium-press
              this.awaiting = 'medium';
              this.pressDownMedium(e);
              this.timer = setTimeout(() => {
                if (this.awaiting) {
                  // Tier 3: long-press
                  this.awaiting = 'long';
                  this.pressDownLong(e);
                }
              }, 1000);
            }
          }, 800);
        }
      }, 250);
    }
  }

  pointerUpGate(e: StageEvent) {
    // Timed-gestures handlers

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
            this.pressUpImmediate(e);
          }
        }, 200);
      }

      // Tier 1: quick-press
      if (this.awaiting === 'quick') this.pressUpQuick(e);

      // Tier 2: medium-press
      if (this.awaiting === 'medium') this.pressUpMedium(e);

      // Tier 3: long-press
      if (this.awaiting === 'long') this.pressUpLong(e);
    } else {
      // Double click handlers
      this.doubleClick(e);
    }

    this.awaiting = false;
    if (this.timer) clearTimeout(this.timer);
  }

  // Timed-gestures special events
  // Press Up events
  pressUpImmediate(e: StageEvent) {
    const screenClick = this.app.viewport.getScreenCoordsFromEvent(e);

    const hit = this.app.pixiApp.renderer.plugins.interaction.hitTest({
      x: screenClick.sX,
      y: screenClick.sY,
    });
    console.log('hit', hit);
    if (hit instanceof Memo) {
      const memo = hit;
      memo.select();
      console.log(`Memo clicked "${memo.id}" `, memo);
    }

    this.sendToMonitor('Immediate Press Up', this.getClickInfoStr(e));
  }

  pressUpQuick(e: StageEvent) {
    const worldClick = this.app.viewport.getWorldScreenCoordsFromEvent(e);
    this.app.actions.viewportMoveTo(worldClick);
    this.sendToMonitor('Quick Press Up', this.getClickInfoStr(e));
  }

  pressUpMedium(e: StageEvent) {
    this.sendToMonitor('Medium Press Up', this.getClickInfoStr(e));
  }

  pressUpLong(e: StageEvent) {
    this.sendToMonitor('Long Press Up', this.getClickInfoStr(e));
  }

  // Additional events
  doubleClick(e: StageEvent) {
    const worldClick = this.app.viewport.getWorldScreenCoordsFromEvent(e);
    this.sendToMonitor('DoubleClick', this.getClickInfoStr(e));
    this.app.actions.viewportZoomIn(worldClick);
  }

  // Press Down events
  pressDownImmediate(e: StageEvent) {
    // ImmediatePressDown event could be too frequent,
    // its probably best choice to use ImmediatePressUp
    const worldClick = this.app.viewport.getWorldScreenCoordsFromEvent(e);
    this.app.putFocusPoint(worldClick);
    this.sendToMonitor('Immediate Press Down', this.getClickInfoStr(e));
  }

  pressDownQuick(e: StageEvent) {
    const worldClick = this.app.viewport.getWorldScreenCoordsFromEvent(e);
    this.app.putFocusPoint(worldClick);
    this.sendToMonitor('Quick Press Down', this.getClickInfoStr(e));
  }

  pressDownMedium(e: StageEvent) {
    const worldClick = this.app.viewport.getWorldScreenCoordsFromEvent(e);
    this.app.putFocusPoint(worldClick);
    this.sendToMonitor('Medium Press Down', this.getClickInfoStr(e));
  }

  pressDownLong(e: StageEvent) {
    const worldClick = this.app.viewport.getWorldScreenCoordsFromEvent(e);
    this.app.putFocusPoint(worldClick);
    this.sendToMonitor('Long Press Down', this.getClickInfoStr(e));
  }
}
