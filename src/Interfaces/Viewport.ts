import * as PIXI from 'pixi.js';
import GraphicsEngine from './GraphicsEngine';
import { Viewport as PixiViewport } from 'pixi-viewport';
import FlowApp from './FlowApp';
import { StageEvent } from './InteractionEvents/StageEvents';
import { gsap } from 'gsap';

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

export interface IPublicCameraState {
  x: number;
  y: number;
  wX: number;
  wY: number;
  scale: number;
  [key: string]: any;
}

// Viewport documentation: https://davidfig.github.io/pixi-viewport/jsdoc/Viewport.html
// Module: node_modules/pixi-viewport/dist/viewport.es.js

// For specific viewport events use
// import ViewportEvents from './InteractionEvents/ViewportEvents';
// new ViewportEvents(this);

export default class Viewport {
  public readonly instance: IViewportInstance;
  public readonly engine: GraphicsEngine;
  private readonly zoomScales: number[] = [0.03125, 0.0625, 0.125, 0.25, 0.5, 1, 2, 4, 8, 16, 32];
  public readonly publicCameraState: IPublicCameraState = {
    x: 0,
    y: 0,
    wX: 0,
    wY: 0,
    scale: 1,
  };
  [key: string]: any;

  constructor(public app: FlowApp) {
    this.engine = app.engine;
    this.instance = new PixiViewport({
      screenWidth: this.app.hostHTMLWidth,
      screenHeight: this.app.hostHTMLHeight,
      worldWidth: this.app.hostHTMLWidth,
      worldHeight: this.app.hostHTMLHeight,
      // interaction: this.engine.instance.renderer.plugins.interaction, // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
    });

    // viewport.drag().pinch().wheel().decelerate();
    app.engine.addDisplayObject(this.instance);
    this.instance.sortableChildren = true;

    // Handler for "pixi engine and Viewport" dimensions dependency on window size
    window.addEventListener('resize', this.resizeViewportHandler);
    // window.addEventListener('orientationchange', this.orientationchangeViewportHandler, false);

    // For preventing page zoom you should prevent wheel event:
    window.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
      },
      { passive: false },
    );
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

  set wX(wX: number) {
    // void
  }

  get wX() {
    return this.publicCameraState.wX;
  }

  set wY(wY: number) {
    // void
  }

  get wY() {
    return this.publicCameraState.wY;
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

  public resizeViewportHandler = (): void => {
    // solution ref: https://github.com/davidfig/pixi-viewport/issues/212#issuecomment-608231281
    if (
      this.app.engine.screenWidth !== this.app.hostHTMLWidth ||
      this.app.engine.screenHeight !== this.app.hostHTMLHeight
    ) {
      this.app.engine.renderer.resize(this.app.hostHTMLWidth, this.app.hostHTMLHeight);
      this.instance.resize(this.app.hostHTMLWidth, this.app.hostHTMLHeight);
      this.app.gui.stageBackTile.updateDimensions(this.app.hostHTMLWidth, this.app.hostHTMLHeight);
    }
  };

  public getScreenCoordsFromEvent(e: StageEvent): IScreenCoords {
    return { sX: e.data.global.x, sY: e.data.global.y };
  }

  public getWorldScreenCoordsFromEvent(e: StageEvent): IWorldScreenCoords {
    const screenClick: IScreenCoords = this.getScreenCoordsFromEvent(e);
    return this.app.viewport.screenToWorld(screenClick);
  }

  public getNextScaleStepDown(runAhead: number): number {
    const currentScale = this.instance.scale.x;

    for (let i = 0; i < this.zoomScales.length; i++) {
      if (currentScale <= this.zoomScales[0]) {
        return this.zoomScales[0];
      }

      if (currentScale > this.zoomScales[this.zoomScales.length - 1]) {
        return this.zoomScales[this.zoomScales.length - (1 - runAhead)];
      }

      if (currentScale === this.zoomScales[i]) {
        return this.zoomScales[i - (1 - runAhead)] || this.zoomScales[0];
      }

      if (currentScale > this.zoomScales[i] && currentScale < this.zoomScales[i + 1]) {
        return this.zoomScales[i - runAhead] || this.zoomScales[0];
      }
    }

    return 0;
  }

  public getNextScaleStepUp(runAhead: number): number {
    const currentScale = this.instance.scale.x;

    for (let i = 0; i < this.zoomScales.length; i++) {
      if (currentScale < this.zoomScales[0]) {
        return this.zoomScales[runAhead];
      }

      if (currentScale >= this.zoomScales[this.zoomScales.length - 1]) {
        return this.zoomScales[this.zoomScales.length - 1];
      }

      if (currentScale === this.zoomScales[i]) {
        return this.zoomScales[i + (1 + runAhead)] || this.zoomScales[this.zoomScales.length - 1];
      }

      if (currentScale > this.zoomScales[i] && currentScale < this.zoomScales[i + 1]) {
        return this.zoomScales[i + (1 + runAhead)] || this.zoomScales[this.zoomScales.length - 1];
      }
    }

    return 0;
  }

  public addToViewport(displayObject: PIXI.DisplayObject): PIXI.DisplayObject {
    return this.instance.addChild(displayObject);
  }

  public getZoomString(): string {
    return Math.round(this.instance.scale.x * 100).toString();
  }

  public screenToWorld({ sX, sY }: IScreenCoords): IWorldScreenCoords {
    const { x: wX, y: wY } = this.instance.toWorld(sX, sY);
    return { wX, wY };
  }

  public screenCenter(): IScreenCoords {
    return { sX: this.screenWidth / 2, sY: this.screenHeight / 2 };
  }

  public worldScreenCenter(): IWorldScreenCoords {
    return { wX: this.instance.worldScreenWidth / 2, wY: this.instance.worldScreenHeight / 2 };
  }

  // get center()
  // center of screen in world coordinates = worldScreenWidth / 2 - x / scale

  // get worldScreenWidth()
  // worldScreenWidth = screenWidth / scale

  public getScreeCenterInWord(): IWorldScreenCoords {
    return {
      wX: this.instance.worldScreenWidth / 2 - this.instance.x / this.instance.scale.x,
      wY: this.instance.worldScreenHeight / 2 - this.instance.y / this.instance.scale.y,
    };
  }

  public cameraPropsConversion(targetPoint?: IWorldScreenCoords, targetScale?: number): IPublicCameraState {
    if (!targetPoint) {
      targetPoint = this.app.viewport.getScreeCenterInWord();
    }

    if (targetScale === undefined) {
      targetScale = this.app.stateManager.publicState.camera.scale;
    }

    if (targetScale >= 32) targetScale = 32;
    if (targetScale <= 0.01) targetScale = 0.01;

    return {
      x: Number(
        ((this.app.viewport.screenWidth / targetScale / 2 - targetPoint.wX) * targetScale).toFixed(4),
      ),
      y: Number(
        ((this.app.viewport.screenHeight / targetScale / 2 - targetPoint.wY) * targetScale).toFixed(4),
      ),
      scale: targetScale,
      wX: Number(targetPoint.wX.toFixed(4)),
      wY: Number(targetPoint.wY.toFixed(4)),
    };
  }

  public animateCamera(cameraProps: IPublicCameraState): Promise<IPublicCameraState> {
    const { x, y, scale, wX, wY } = cameraProps;

    const animateProps = {
      x,
      y,
      scale,
    };
    return new Promise((resolve) => {
      gsap.to(this.app.viewport, {
        ...animateProps,
        duration: 0.7,
        ease: 'power3.out',
        onStart: () => {
          this.app.viewport.interactive = false;
        },
        onUpdate: () => {
          this.app.gui.stageBackTile.updateGraphics();
        },
        onComplete: () => {
          this.app.viewport.interactive = true;
          this.app.viewport.onCameraAnimationEnds();
          resolve({ ...animateProps, wX, wY });
        },
      });
    });
  }

  private onCameraAnimationEnds = (): void => {
    this.app.webUi.updateZoomBtn();
  };
}
