import * as PIXI from 'pixi.js';
import FlowApp from '../FlowApp';
import DevMonitor from '../DevMonitor';
import TimedGesture from './TimedGesture';

// TODO: Would it be better for performance to make all events under PIXI.InteractionManager?
// const IM = new PIXI.InteractionManager(this.app.pixiApp.renderer);
// IM.on('pointerdown', (e: StageEvent) => console.log('!!! InteractionManager', e));

export type StageEvent = PIXI.InteractionEvent;

export default class StageEvents {
  eventMonitor: DevMonitor | null;
  stage: PIXI.Container;
  timedGesture: TimedGesture;

  constructor(public app: FlowApp) {
    this.stage = this.app.stage;

    this.stage.interactive = true;
    this.eventMonitor = this.app.devMonitor;
    this.timedGesture = new TimedGesture(this);

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

  // Original events
  stagePointerDown(e: StageEvent) {
    this.timedGesture.pointerDownGate(e);
  }

  stagePointerUp(e: StageEvent) {
    this.timedGesture.pointerUpGate(e);
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
