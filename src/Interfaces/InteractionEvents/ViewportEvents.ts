import FlowApp from '../FlowApp';
import PIXI from 'pixi.js';
import DevMonitor from '../DevMonitor';
import { ClickEventData, MovedEventData, Viewport as PixiViewport } from 'pixi-viewport';

export default class ViewportEvents {
  eventMonitor: DevMonitor | null;
  viewport: PixiViewport;

  constructor(public app: FlowApp) {
    this.viewport = this.app.viewport.instance;
    this.eventMonitor = this.app.devMonitor;

    if (this.eventMonitor instanceof DevMonitor) {
      this.eventMonitor.addDevMonitor('viewportEvents');
    }

    this.initViewportEvents();
  }

  sendToMonitor(eventName: string, msg: string = '') {
    if (this.eventMonitor instanceof DevMonitor) {
      this.eventMonitor.dispatchMonitor('viewportEvents', eventName, msg);
      console.log(`[viewport] ${eventName} ${msg}`);
    }
  }

  // Docs
  // https://davidfig.github.io/pixi-viewport/jsdoc/Viewport.html#event:frame-end
  initViewportEvents() {
    // Activate only required events for optimization purposes

    // Container events
    this.viewport.on('pointertap', (e) => this.viewportPointerTap(e));

    // Viewport
    this.viewport.on('clicked', (e) => this.viewportClicked(e));
    this.viewport.on('drag-start', (e) => this.viewportDragStart(e));
    this.viewport.on('drag-end', (e) => this.viewportDragEnd(e));
    // this.viewport.on('frame-end', (e) => this.viewportFrameEnd(e)); // ???

    // this.viewport.on('moved', (e) => this.viewportMoved(e));
    this.viewport.on('moved-end', (e) => this.viewportMovedEnd(e));
    this.viewport.on('zoomed-end', (e) => this.viewportZoomedEnd(e));
    this.viewport.on('mouse-edge-start', (e) => this.viewportMouseEdgeStart(e));
    this.viewport.on('mouse-edge-end', (e) => this.viewportMouseEdgeEnd(e));

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
  }

  viewportPointerTap(e: PIXI.InteractionEvent) {
    const eventName = 'Pointer Tap';
    const msg = ``;
    this.sendToMonitor(eventName, msg);
  }

  viewportClicked(e: ClickEventData) {
    const eventName = 'Clicked';
    const msg = `${eventName} ${Math.round(e.world.x)} : ${Math.round(e.world.y)} `;
    this.sendToMonitor(eventName, msg);
  }

  viewportDragStart(e: ClickEventData) {
    const eventName = 'DragStart';
    const msg = `${Math.round(e.event.data.global.x)} : ${Math.round(e.event.data.global.y)}`;
    this.sendToMonitor(eventName, msg);
  }

  viewportDragEnd(e: ClickEventData) {
    const eventName = 'DragEnd';
    const msg = `${Math.round(e.event.data.global.x)} : ${Math.round(e.event.data.global.y)}`;
    this.sendToMonitor(eventName, msg);
  }

  // viewportFrameEnd(e: PixiViewport) {
  //   console.log('[viewport] FrameEnd', e);
  // }

  // hitArea.x, .y = lastViewport.x, .y
  // transform.scale._x = lastViewport.scaleX
  viewportMoved(e: MovedEventData) {
    const eventName = 'Moved';
    const msg = this.getViewportLogMsg(e.viewport);
    this.sendToMonitor(eventName, msg);
  }

  viewportMovedEnd(e: PixiViewport) {
    const eventName = 'MovedEnd';
    const msg = this.getViewportLogMsg(e);
    this.sendToMonitor(eventName, msg);
  }

  getViewportLogMsg(v: PixiViewport) {
    const { lastViewport } = v;
    const { scaleX, scaleY, x, y } = lastViewport;
    return `${Math.round(x)}:${Math.round(y)} (${scaleX.toFixed(2)}:${scaleY.toFixed(2)})`;
  }

  viewportZoomedEnd(e: PixiViewport) {
    const eventName = 'ZoomedEnd';
    const msg = this.getViewportLogMsg(e);
    this.sendToMonitor(eventName, msg);
  }

  // What is MouseEdge start/end?
  viewportMouseEdgeStart(e: PixiViewport) {
    const eventName = 'MouseEdgeStart';
    const msg = ``;
    this.sendToMonitor(eventName, msg);
  }

  viewportMouseEdgeEnd(e: PixiViewport) {
    const eventName = 'MouseEdgeEnd';
    const msg = ``;
    this.sendToMonitor(eventName, msg);
  }
  //
  // // Viewport plugins
  // viewportWheelScroll(e: PixiViewport) {
  //   console.log('[viewport] WheelScroll', e);
  // }
  //
  // viewportPinchStart(e: PixiViewport) {
  //   console.log('[viewport] PinchStart', e);
  // }
  //
  // viewportPinchEnd(e: PixiViewport) {
  //   console.log('[viewport] PinchEnd', e);
  // }
  //
  // viewportBounceXStart(e: PixiViewport) {
  //   console.log('[viewport] BounceXStart', e);
  // }
  //
  // viewportBounceXEnd(e: PixiViewport) {
  //   console.log('[viewport] BounceXEnd', e);
  // }
  //
  // viewportBounceYStart(e: PixiViewport) {
  //   console.log('[viewport] BounceYStart', e);
  // }
  //
  // viewportBounceYEnd(e: PixiViewport) {
  //   console.log('[viewport] BounceYEnd', e);
  // }
  //
  // viewportSnapStart(e: PixiViewport) {
  //   console.log('[viewport] SnapStart', e);
  // }
  //
  // viewportSnapEnd(e: PixiViewport) {
  //   console.log('[viewport] SnapEnd', e);
  // }
  //
  // viewportSnapZoomStart(e: PixiViewport) {
  //   console.log('[viewport] SnapZoomStart', e);
  // }
  //
  // viewportSnapZoomEnd(e: PixiViewport) {
  //   console.log('[viewport] SnapZoomEnd', e);
  // }
}
