import PIXI from 'pixi.js';
import { GraphicsEngine } from './GraphicsEngine';
import { Viewport as PixiViewport } from 'pixi-viewport';
import FlowApp from './FlowApp';
import { ViewportAnimations } from './Animations';
import { StageEvent } from './InteractionEvents/StageEvents';

export interface IUniScreenCoords {
  wX?: number;
  wY?: number;
  sX?: number;
  sY?: number;
  x?: number;
  y?: number;
}

export interface IWorldScreenCoords {
  wX: number;
  wY: number;
}

export interface IScreenCoords {
  sX: number;
  sY: number;
}

export interface IViewportInstance extends PixiViewport {
  [key: string]: any;
}

// Viewport documentation: https://davidfig.github.io/pixi-viewport/jsdoc/Viewport.html
// Module: node_modules/pixi-viewport/dist/viewport.es.js

// For specific viewport events use
// import ViewportEvents from './InteractionEvents/ViewportEvents';
// new ViewportEvents(this);

export default class Viewport {
  instance: IViewportInstance;
  engine: GraphicsEngine;
  animations: ViewportAnimations;
  zoomScale: number[];
  [key: string]: any;

  constructor(public app: FlowApp) {
    this.engine = app.engine;
    this.instance = this.setupViewport(this.engine.hostHTML.clientWidth, this.engine.hostHTML.clientHeight);
    this.animations = new ViewportAnimations(this.app, this);
    this.zoomScale = [0.03125, 0.0625, 0.125, 0.25, 0.5, 1, 2, 4, 8, 16, 32];
    app.stage.addChild(this.instance);
  }

  set x(x: number) {
    this.instance.x = x;
  }

  get x() {
    return this.instance.x;
  }

  set y(y: number) {
    this.instance.y = y;
  }

  get y() {
    return this.instance.y;
  }

  set scale(val: number) {
    this.instance.scale.x = val;
    this.instance.scale.y = val;
  }

  get scale() {
    return this.instance.scale.x;
  }

  set screenWidth(val: number) {
    this.instance.screenWidth = val;
  }

  get screenWidth() {
    return this.instance.screenWidth;
  }

  set screenHeight(val: number) {
    this.instance.screenHeight = val;
  }

  get screenHeight() {
    return this.instance.screenHeight;
  }

  set interactive(val: boolean) {
    this.instance.interactive = val;
  }

  get interactive() {
    return this.instance.interactive;
  }

  getScreenCoordsFromEvent(e: StageEvent): IScreenCoords {
    return { sX: e.data.global.x, sY: e.data.global.y };
  }

  getWorldScreenCoordsFromEvent(e: StageEvent): IWorldScreenCoords {
    const screenClick: IScreenCoords = this.getScreenCoordsFromEvent(e);
    const { x: wX, y: wY } = this.app.viewport.screenToWorld(screenClick);
    return { wX, wY };
  }

  getNextScaleStepDown(runAhead: number): number {
    const currentScale = this.instance.scale.x;

    for (let i = 0; i < this.zoomScale.length; i++) {
      if (currentScale <= this.zoomScale[0]) {
        return this.zoomScale[0];
      }

      if (currentScale > this.zoomScale[this.zoomScale.length - 1]) {
        return this.zoomScale[this.zoomScale.length - (1 - runAhead)];
      }

      if (currentScale === this.zoomScale[i]) {
        return this.zoomScale[i - (1 - runAhead)] || this.zoomScale[0];
      }

      if (currentScale > this.zoomScale[i] && currentScale < this.zoomScale[i + 1]) {
        return this.zoomScale[i - runAhead] || this.zoomScale[0];
      }
    }

    return 0;
  }

  getNextScaleStepUp(runAhead: number): number {
    const currentScale = this.instance.scale.x;

    for (let i = 0; i < this.zoomScale.length; i++) {
      if (currentScale < this.zoomScale[0]) {
        return this.zoomScale[runAhead];
      }

      if (currentScale >= this.zoomScale[this.zoomScale.length - 1]) {
        return this.zoomScale[this.zoomScale.length - 1];
      }

      if (currentScale === this.zoomScale[i]) {
        return this.zoomScale[i + (1 + runAhead)] || this.zoomScale[this.zoomScale.length - 1];
      }

      if (currentScale > this.zoomScale[i] && currentScale < this.zoomScale[i + 1]) {
        return this.zoomScale[i + (1 + runAhead)] || this.zoomScale[this.zoomScale.length - 1];
      }
    }

    return 0;
  }

  setupViewport(hostHTMLWidth: number, hostHTMLHeight: number) {
    // Code Examples:
    // this.pixiViewport.moveCenter(3, 3);

    // Viewport
    const viewport = new PixiViewport({
      screenWidth: hostHTMLWidth,
      screenHeight: hostHTMLHeight,
      worldWidth: hostHTMLWidth,
      worldHeight: hostHTMLHeight,
      // interaction: this.engine.instance.renderer.plugins.interaction, // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
    });

    // viewport.drag().pinch().wheel().decelerate();

    return viewport;
  }

  addToViewport(displayObject: PIXI.DisplayObject) {
    return this.instance.addChild(displayObject);
  }

  getZoom(): string {
    return Math.round(this.instance.scale.x * 100).toString();
  }
  //
  // setZoom(absPercent: number) {
  //   this.instance.setZoom(absPercent / 100, true);
  // }

  screenToWorld({ sX, sY }: IScreenCoords) {
    return this.instance.toWorld(sX, sY);
  }

  // get center()
  // center of screen in world coordinates = worldScreenWidth / 2 - x / scale

  // get worldScreenWidth()
  // worldScreenWidth = screenWidth / scale

  getScreeCenterInWord(): IWorldScreenCoords {
    return {
      wX: this.instance.worldScreenWidth / 2 - this.instance.x / this.instance.scale.x,
      wY: this.instance.worldScreenHeight / 2 - this.instance.y / this.instance.scale.y,
    };
  }

  onCameraAnimationEnds = () => {
    this.app.actions.updateZoomBtn();
  };
}
