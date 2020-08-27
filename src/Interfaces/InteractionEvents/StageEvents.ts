import * as PIXI from 'pixi.js';
import FlowApp from '../FlowApp';
import DevMonitor from '../DevMonitor';

type StageEvent = PIXI.InteractionEvent;
type pressEvent = {
  worldClick: {
    x: number;
    y: number;
  };
};

export default class StageEvents {
  eventMonitor: DevMonitor | null;
  stage: PIXI.Container;
  awaiting: boolean | string;
  timer: ReturnType<typeof setTimeout> | null;
  clickCnt: number;

  constructor(public app: FlowApp) {
    this.stage = this.app.stage;

    this.stage.interactive = true;

    this.eventMonitor = this.app.devMonitor;

    // Timed-gestures event manager
    this.clickCnt = 0;
    this.awaiting = false;
    this.timer = null;

    // Monitoring
    if (this.eventMonitor instanceof DevMonitor) {
      this.eventMonitor.addDevMonitor('stageEvents');
    }

    this.initStageEvents();
  }

  sendToMonitor(eventName: string, msg: string = '') {
    if (this.eventMonitor instanceof DevMonitor) {
      this.eventMonitor.dispatchMonitor('stageEvents', eventName, msg);
      console.log(`[stage] ${eventName} ${msg}`);
    }
  }

  initStageEvents() {
    // Normalized "Pointer" events
    this.stage.on('pointerdown', (e: StageEvent) => this.stagePointerDown(e));
    this.stage.on('pointerup', (e: StageEvent) => this.stagePointerUp(e));
  }

  // Timed-gestures special events
  // Press Down events
  stageImmediatePressDown({ worldClick }: pressEvent) {
    // ImmediatePressDown event could be too frequent,
    // its probably best choice to use ImmediatePressUp
    this.app.putFocusPoint(worldClick.x, worldClick.y);
    this.sendToMonitor('Immediate Press Down', `${Math.round(worldClick.x)} : ${Math.round(worldClick.y)}`);
  }

  stageQuickPressDown({ worldClick }: pressEvent) {
    this.app.putFocusPoint(worldClick.x, worldClick.y);
    this.sendToMonitor('Quick Press Down', `${Math.round(worldClick.x)} : ${Math.round(worldClick.y)}`);
  }

  stageMediumPressDown({ worldClick }: pressEvent) {
    this.app.putFocusPoint(worldClick.x, worldClick.y);
    this.sendToMonitor('Medium Press Down', `${Math.round(worldClick.x)} : ${Math.round(worldClick.y)}`);
  }

  stageLongPressDown({ worldClick }: pressEvent) {
    this.app.putFocusPoint(worldClick.x, worldClick.y);
    this.sendToMonitor('Long Press Down', `${Math.round(worldClick.x)} : ${Math.round(worldClick.y)}`);
  }

  // Press Up events
  stageImmediatePressUp({ worldClick }: pressEvent) {
    // Workaround for the case when ImmediatePressUp will be triggered as part of double click event
    // (approach when stageImmediatePressUp set with timeout 200
    if (this.clickCnt < 2) {
      this.sendToMonitor('Immediate Press Up', `${Math.round(worldClick.x)} : ${Math.round(worldClick.y)}`);
    }
  }

  stageQuickPressUp({ worldClick }: pressEvent) {
    this.app.actions.viewportMoveTo({ wX: worldClick.x, wY: worldClick.y });
    this.sendToMonitor('Quick Press Up', `${Math.round(worldClick.x)} : ${Math.round(worldClick.y)}`);
  }

  stageMediumPressUp({ worldClick }: pressEvent) {
    this.sendToMonitor('Medium Press Up', `${Math.round(worldClick.x)} : ${Math.round(worldClick.y)}`);
  }

  stageLongPressUp({ worldClick }: pressEvent) {
    this.sendToMonitor('Long Press Up', `${Math.round(worldClick.x)} : ${Math.round(worldClick.y)}`);
  }

  // Additional events
  stageDoubleClick({ worldClick }: pressEvent) {
    this.sendToMonitor('DoubleClick', `${Math.round(worldClick.x)} : ${Math.round(worldClick.y)}`);
    this.app.actions.viewportZoomIn({ wX: worldClick.x, wY: worldClick.y });
  }

  // Original events
  stagePointerDown(e: StageEvent) {
    // Timed-gestures manager
    this.awaiting = true;
    this.clickCnt += 1;
    setTimeout(() => (this.clickCnt = 0), 300); // double click threshold

    // Prepare pressEvent data
    const screenClick = { x: e.data.global.x, y: e.data.global.y };
    const { x: wX, y: wY } = this.app.viewport.screenToWorld(screenClick.x, screenClick.y);
    const pressEvent = { worldClick: { x: wX, y: wY } };

    // Tier 0: Immediate "select" press
    // Block second immediate click for double-click case
    if (this.clickCnt < 2) {
      this.stageImmediatePressDown(pressEvent);
      this.timer = setTimeout(() => {
        if (this.awaiting) {
          // Tier 1: quick-press
          this.awaiting = 'quick';
          this.stageQuickPressDown(pressEvent);
          this.timer = setTimeout(() => {
            if (this.awaiting) {
              // Tier 2: medium-press
              this.awaiting = 'medium';
              this.stageMediumPressDown(pressEvent);
              this.timer = setTimeout(() => {
                if (this.awaiting) {
                  // Tier 3: long-press
                  this.awaiting = 'long';
                  this.stageLongPressDown(pressEvent);
                }
              }, 1000);
            }
          }, 800);
        }
      }, 250);
    }
  }

  stagePointerUp(e: StageEvent) {
    // Timed-gestures handlers
    //
    // Prepare pressEvent data
    const screenClick = { x: e.data.global.x, y: e.data.global.y };
    const { x: wX, y: wY } = this.app.viewport.screenToWorld(screenClick.x, screenClick.y);
    const pressEvent = { worldClick: { x: wX, y: wY } };

    // Distinguish single click and double click handlers
    // filter out timed gestures while double-click
    if (this.clickCnt < 2) {
      // Tier 0: Immediate "select" press
      // No ImmediatePressUp while timed gestures are active
      if (this.awaiting !== 'quick' && this.awaiting !== 'medium' && this.awaiting !== 'long') {
        // this is experimental hack to workaround stageImmediatePressUp intersection with double click
        setTimeout(() => this.stageImmediatePressUp(pressEvent), 200);
      }

      // Tier 1: quick-press
      if (this.awaiting === 'quick') this.stageQuickPressUp(pressEvent);

      // Tier 2: medium-press
      if (this.awaiting === 'medium') this.stageMediumPressUp(pressEvent);

      // Tier 3: long-press
      if (this.awaiting === 'long') this.stageLongPressUp(pressEvent);
    } else {
      // Double click handlers
      this.stageDoubleClick(pressEvent);
    }

    this.awaiting = false;
    if (this.timer) clearTimeout(this.timer);
  }

  // Assignable stage events (note)
  // assignableStageEvents() {
  // Activate only required events for optimization purposes

  // this.stage.on('added', (e: StageEvent) => this.stageAdded(e));
  // this.stage.on('removed', (e: StageEvent) => this.stageRemoved(e));

  // this.stage.on('click', (e: StageEvent) => this.stageClick(e));
  // this.stage.on('tap', (e: StageEvent) => this.stageTap(e));

  // Normalized "Pointer" events
  // this.stage.on('pointerdown', (e: StageEvent) => this.stagePointerDown(e));
  // this.stage.on('pointerup', (e: StageEvent) => this.stagePointerUp(e));
  // this.stage.on('pointermove', (e: StageEvent) => this.stagePointerMove(e));
  // this.stage.on('pointercancel', (e: StageEvent) => this.stagePointerCancel(e));
  // this.stage.on('pointerout', (e: StageEvent) => this.stagePointerOut(e));
  // this.stage.on('pointerover', (e: StageEvent) => this.stagePointerOver(e));
  // this.stage.on('pointertap', (e: StageEvent) => this.stagePointerTap(e));
  // this.stage.on('pointerupoutside', (e: StageEvent) => this.stagePointerUpOutside(e));

  // Mouse-only events
  // this.stage.on('mousedown', (e: StageEvent) => this.stageMouseDown(e));
  // this.stage.on('mousemove', (e: StageEvent) => this.stageMouseMove(e));
  // this.stage.on('mouseout', (e: StageEvent) => this.stageMouseOut(e));
  // this.stage.on('mouseover', (e: StageEvent) => this.stageMouseOver(e));
  // this.stage.on('mouseup', (e: StageEvent) => this.stageMouseUp(e));
  // this.stage.on('mouseupoutside', (e: StageEvent) => this.stageMouseUpOutside(e));

  // this.stage.on('rightclick', (e: StageEvent) => this.stageRightClick(e));
  // this.stage.on('rightdown', (e: StageEvent) => this.stageRightDown(e));
  // this.stage.on('rightup', (e: StageEvent) => this.stageRightUp(e));
  // this.stage.on('rightupoutside', (e: StageEvent) => this.stageRightUpOutside(e));

  // Touch-only events
  // this.stage.on('touchcancel', (e: StageEvent) => this.stageTouchCancel(e));
  // this.stage.on('touchend', (e: StageEvent) => this.stageTouchend(e));
  // this.stage.on('touchendoutside', (e: StageEvent) => this.stageTouchEndOutside(e));
  // this.stage.on('touchmove', (e: StageEvent) => this.stageTouchMove(e));
  // this.stage.on('touchstart', (e: StageEvent) => this.stageTouchStart(e));
  // }

  // stageAdded(e: StageEvent) {
  //   console.log('[stage] Added', e);
  // }

  // stageClick(e: StageEvent) {
  //   const eventName = 'Click';
  //   const msg = `${Math.round(e.data.global.x)} : ${Math.round(e.data.global.y)}`;
  //   this.sendToMonitor(eventName, msg);
  // }

  // stageMouseDown(e: StageEvent) {
  //   console.log('[stage] MouseDown', e);
  // }
  //
  // stageMouseMove(e: StageEvent) {
  //   console.log('[stage] MouseMove', e);
  // }
  //
  // stageMouseOut(e: StageEvent) {
  //   console.log('[stage] MouseOut', e);
  // }
  //
  // stageMouseOver(e: StageEvent) {
  //   console.log('[stage] MouseOver', e);
  // }
  //
  // stageMouseUp(e: StageEvent) {
  //   console.log('[stage] MouseUp', e);
  // }
  //
  // stageMouseUpOutside(e: StageEvent) {
  //   console.log('[stage] MouseUpOutside', e);
  // }

  // stagePointerCancel(e: StageEvent) {
  //   const eventName = 'Pointer Cancel';
  //   const msg = `${Math.round(e.data.global.x)} : ${Math.round(e.data.global.y)}`;
  //   this.sendToMonitor(eventName, msg);
  // }

  // stagePointerMove(e: StageEvent) {
  //   const eventName = 'Pointer Move';
  //   const msg = `${Math.round(e.data.global.x)} : ${Math.round(e.data.global.y)}`;
  //   this.sendToMonitor(eventName, msg);
  // }
  //
  // stagePointerOut(e: StageEvent) {
  //   const eventName = 'Pointer Out';
  //   const msg = `${Math.round(e.data.global.x)} : ${Math.round(e.data.global.y)}`;
  //   this.sendToMonitor(eventName, msg);
  // }
  //
  // stagePointerOver(e: StageEvent) {
  //   const eventName = 'Pointer Over';
  //   const msg = `${Math.round(e.data.global.x)} : ${Math.round(e.data.global.y)}`;
  //   this.sendToMonitor(eventName, msg);
  // }
  //
  // stagePointerTap(e: StageEvent) {
  //   const eventName = 'Pointer Tap';
  //   const msg = `${Math.round(e.data.global.x)} : ${Math.round(e.data.global.y)}`;
  //   this.sendToMonitor(eventName, msg);
  // }
  //
  // stagePointerUpOutside(e: StageEvent) {
  //   const eventName = 'Pointer UpOutside';
  //   const msg = `${Math.round(e.data.global.x)} : ${Math.round(e.data.global.y)}`;
  //   this.sendToMonitor(eventName, msg);
  // }

  // stageRemoved(e: StageEvent) {
  //   console.log('[stage] Removed', e);
  // }
  //
  // stageRightClick(e: StageEvent) {
  //   console.log('[stage] RightClick', e);
  // }
  //
  // stageRightDown(e: StageEvent) {
  //   console.log('[stage] RightDown', e);
  // }
  //
  // stageRightUp(e: StageEvent) {
  //   console.log('[stage] RightUp', e);
  // }
  //
  // stageRightUpOutside(e: StageEvent) {
  //   console.log('[stage] RightUpOutside', e);
  // }
  //
  // stageTap(e: StageEvent) {
  //   const eventName = 'Tap';
  //   const msg = ``;
  //   console.log(`[stage] ${eventName} ${msg}`, e);
  //   this.sendToMonitor(eventName, msg);
  // }
  //
  // stageTouchCancel(e: StageEvent) {
  //   console.log('[stage] TouchCancel', e);
  // }
  //
  // stageTouchend(e: StageEvent) {
  //   console.log('[stage] Touchend', e);
  // }
  //
  // stageTouchEndOutside(e: StageEvent) {
  //   console.log('[stage] TouchEndOutside', e);
  // }
  //
  // stageTouchMove(e: StageEvent) {
  //   console.log('[stage] TouchMove', e);
  // }
  //
  // stageTouchStart(e: StageEvent) {
  //   console.log('[stage] TouchStart', e);
  // }
}
