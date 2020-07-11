import * as PIXI from 'pixi.js';
import { PixiEngine } from './PixiEngine';
import { InteractionEventsMonitor } from './Monitoring';
import { ClickEventData, Viewport } from 'pixi-viewport';

type StageEvent = PIXI.interaction.InteractionEvent;

export default class InteractionEvents {
  PixiEngine: PixiEngine;
  uiMonitor: InteractionEventsMonitor;

  constructor(PixiEngine: PixiEngine) {
    this.PixiEngine = PixiEngine;
    this.uiMonitor = new InteractionEventsMonitor();
    // this.uiMonitor.deactivated = true;

    this.initStageEvents();
  }

  initStageEvents() {
    const stage = this.PixiEngine.pixiApp.stage;
    const viewport = this.PixiEngine.pixiViewport;

    // Viewport
    viewport.on('clicked', (e) => this.viewportClicked(e));
    viewport.on('drag-start', (e) => this.viewportDragStart(e));
    viewport.on('drag-end', (e) => this.viewportDragEnd(e));
    // viewport.on('frame-end', (e) => this.viewportFrameEnd(e));

    // viewport.on('moved', (e) => this.viewportMoved(e));
    // viewport.on('moved-end', (e) => this.viewportMovedEnd(e));
    // viewport.on('zoomed-end', (e) => this.viewportZoomedEnd(e));
    // viewport.on('mouse-edge-start', (e) => this.viewportMouseEdgeStart(e));
    // viewport.on('mouse-edge-end', (e) => this.viewportMouseEdgeEnd(e));

    // Viewport plugins
    // viewport.on('wheel-scroll', (e) => this.viewportWheelScroll(e));
    // viewport.on('pinch-start', (e) => this.viewportPinchStart(e));
    // viewport.on('pinch-end', (e) => this.viewportPinchEnd(e));
    // viewport.on('bounce-x-start', (e) => this.viewportBounceXStart(e));
    // viewport.on('bounce-x-end', (e) => this.viewportBounceXEnd(e));
    // viewport.on('bounce-y-start', (e) => this.viewportBounceYStart(e));
    // viewport.on('bounce-y-end', (e) => this.viewportBounceYEnd(e));
    // viewport.on('snap-start', (e) => this.viewportSnapStart(e));
    // viewport.on('snap-end', (e) => this.viewportSnapEnd(e));
    // viewport.on('snap-zoom-start', (e) => this.viewportSnapZoomStart(e));
    // viewport.on('snap-zoom-end', (e) => this.viewportSnapZoomEnd(e));

    // Stage
    // stage.on('added', (e: StageEvent) => this.stageAdded(e));
    stage.on('click', (e: StageEvent) => this.stageClick(e));
    // stage.on('mousedown', (e: StageEvent) => this.stageMouseDown(e));
    // stage.on('mousemove', (e: StageEvent) => this.stageMouseMove(e));
    // stage.on('mouseout', (e: StageEvent) => this.stageMouseOut(e));
    // stage.on('mouseover', (e: StageEvent) => this.stageMouseOver(e));
    // stage.on('mouseup', (e: StageEvent) => this.stageMouseUp(e));
    // stage.on('mouseupoutside', (e: StageEvent) => this.stageMouseUpOutside(e));
    // stage.on('pointercancel', (e: StageEvent) => this.stagePointerCancel(e));
    // stage.on('pointerdown', (e: StageEvent) => this.stagePointerDown(e));
    // stage.on('pointermove', (e: StageEvent) => this.stagePointerMove(e));
    // stage.on('pointerout', (e: StageEvent) => this.stagePointerOut(e));
    // stage.on('pointerover', (e: StageEvent) => this.stagePointerOver(e));
    // stage.on('pointertap', (e: StageEvent) => this.stagePointerTap(e));
    // stage.on('pointerup', (e: StageEvent) => this.stagePointerUp(e));
    // stage.on('pointerupoutside', (e: StageEvent) => this.stagePointerUpOutside(e));
    // stage.on('removed', (e: StageEvent) => this.stageRemoved(e));
    // stage.on('rightclick', (e: StageEvent) => this.stageRightClick(e));
    // stage.on('rightdown', (e: StageEvent) => this.stageRightDown(e));
    // stage.on('rightup', (e: StageEvent) => this.stageRightUp(e));
    // stage.on('rightupoutside', (e: StageEvent) => this.stageRightUpOutside(e));
    // stage.on('tap', (e: StageEvent) => this.stageTap(e));
    // stage.on('touchcancel', (e: StageEvent) => this.stageTouchCancel(e));
    // stage.on('touchend', (e: StageEvent) => this.stageTouchend(e));
    // stage.on('touchendoutside', (e: StageEvent) => this.stageTouchEndOutside(e));
    // stage.on('touchmove', (e: StageEvent) => this.stageTouchMove(e));
    // stage.on('touchstart', (e: StageEvent) => this.stageTouchStart(e));
  }

  viewportClicked(e: ClickEventData) {
    const eventName = 'Clicked';
    console.log(`[viewport] ${eventName}`, e);
    this.uiMonitor.dispatchEvent('viewport', eventName);
  }

  viewportDragStart(e: ClickEventData) {
    const eventName = 'DragStart';
    console.log(`[viewport] ${eventName}`, e);
    this.uiMonitor.dispatchEvent('viewport', eventName);
  }

  viewportDragEnd(e: ClickEventData) {
    const eventName = 'DragEnd';
    console.log(`[viewport] ${eventName}`, e);
    this.uiMonitor.dispatchEvent('viewport', eventName);
  }

  viewportFrameEnd(e: Viewport) {
    console.log('[viewport] FrameEnd', e);
  }

  viewportMoved(e: Viewport) {
    console.log('[viewport] Moved', e);
  }

  viewportMovedEnd(e: Viewport) {
    console.log('[viewport] MovedEnd', e);
  }

  viewportZoomedEnd(e: Viewport) {
    console.log('[viewport] ZoomedEnd', e);
  }

  viewportMouseEdgeStart(e: Viewport) {
    console.log('[viewport] MouseEdgeStart', e);
  }

  viewportMouseEdgeEnd(e: Viewport) {
    console.log('[viewport] MouseEdgeEnd', e);
  }

  // Viewport plugins
  viewportWheelScroll(e: Viewport) {
    console.log('[viewport] WheelScroll', e);
  }

  viewportPinchStart(e: Viewport) {
    console.log('[viewport] PinchStart', e);
  }

  viewportPinchEnd(e: Viewport) {
    console.log('[viewport] PinchEnd', e);
  }

  viewportBounceXStart(e: Viewport) {
    console.log('[viewport] BounceXStart', e);
  }

  viewportBounceXEnd(e: Viewport) {
    console.log('[viewport] BounceXEnd', e);
  }

  viewportBounceYStart(e: Viewport) {
    console.log('[viewport] BounceYStart', e);
  }

  viewportBounceYEnd(e: Viewport) {
    console.log('[viewport] BounceYEnd', e);
  }

  viewportSnapStart(e: Viewport) {
    console.log('[viewport] SnapStart', e);
  }

  viewportSnapEnd(e: Viewport) {
    console.log('[viewport] SnapEnd', e);
  }

  viewportSnapZoomStart(e: Viewport) {
    console.log('[viewport] SnapZoomStart', e);
  }

  viewportSnapZoomEnd(e: Viewport) {
    console.log('[viewport] SnapZoomEnd', e);
  }

  // Stage
  stageAdded(e: StageEvent) {
    console.log('[stage] Added', e);
  }

  stageClick(e: StageEvent) {
    const eventName = 'Click';
    console.log(`[stage] ${eventName}`, e);
    this.uiMonitor.dispatchEvent(
      'stage',
      `${eventName} ${Math.round(e.data.global.x)} : ${Math.round(e.data.global.y)}`,
    );
  }

  stageMouseDown(e: StageEvent) {
    console.log('[stage] MouseDown', e);
  }

  stageMouseMove(e: StageEvent) {
    console.log('[stage] MouseMove', e);
  }

  stageMouseOut(e: StageEvent) {
    console.log('[stage] MouseOut', e);
  }

  stageMouseOver(e: StageEvent) {
    console.log('[stage] MouseOver', e);
  }

  stageMouseUp(e: StageEvent) {
    console.log('[stage] MouseUp', e);
  }

  stageMouseUpOutside(e: StageEvent) {
    console.log('[stage] MouseUpOutside', e);
  }

  stagePointerCancel(e: StageEvent) {
    console.log('[stage] PointerCancel', e);
  }

  stagePointerDown(e: StageEvent) {
    console.log('[stage] PointerDown', e);
  }

  stagePointerMove(e: StageEvent) {
    console.log('[stage] PointerMove', e);
  }

  stagePointerOut(e: StageEvent) {
    console.log('[stage] PointerOut', e);
  }

  stagePointerOver(e: StageEvent) {
    console.log('[stage] PointerOver', e);
  }

  stagePointerTap(e: StageEvent) {
    console.log('[stage] PointerTap', e);
  }

  stagePointerUp(e: StageEvent) {
    console.log('[stage] PointerUp', e);
  }

  stagePointerUpOutside(e: StageEvent) {
    console.log('[stage] PointerUpOutside', e);
  }

  stageRemoved(e: StageEvent) {
    console.log('[stage] Removed', e);
  }

  stageRightClick(e: StageEvent) {
    console.log('[stage] RightClick', e);
  }

  stageRightDown(e: StageEvent) {
    console.log('[stage] RightDown', e);
  }

  stageRightUp(e: StageEvent) {
    console.log('[stage] RightUp', e);
  }

  stageRightUpOutside(e: StageEvent) {
    console.log('[stage] RightUpOutside', e);
  }

  stageTap(e: StageEvent) {
    console.log('[stage] Tap', e);
  }

  stageTouchCancel(e: StageEvent) {
    console.log('[stage] TouchCancel', e);
  }

  stageTouchend(e: StageEvent) {
    console.log('[stage] Touchend', e);
  }

  stageTouchEndOutside(e: StageEvent) {
    console.log('[stage] TouchEndOutside', e);
  }

  stageTouchMove(e: StageEvent) {
    console.log('[stage] TouchMove', e);
  }

  stageTouchStart(e: StageEvent) {
    console.log('[stage] TouchStart', e);
  }
}
