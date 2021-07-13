import * as PIXI from 'pixi.js';
import FlowApp from '../FlowApp';

export interface IWorldCoords {
  wX: number;
  wY: number;
}
export interface IScreenCoords {
  sX: number;
  sY: number;
}

export type CgEngineEvents = 'resizeRenderScreen';

interface IEventList {
  resizeRenderScreen: Function[];
}

export interface IResizeRenderScreenEvent {
  renderScreenWidth: number;
  renderScreenHeight: number;
}

export class CgEngine {
  public readonly instance: PIXI.Application;
  public readonly stage: PIXI.Container;
  public readonly renderer: PIXI.Renderer;
  public readonly ticker: PIXI.Ticker;
  public readonly view: HTMLCanvasElement;
  private eventList: IEventList = { resizeRenderScreen: [] };

  constructor(public app: FlowApp) {
    this.instance = new PIXI.Application({
      width: 100,
      height: 100,
      antialias: true,
      // TODO: res 1 for slow devices or native pixel only for new devices?
      resolution: window.automationScreenshot ? 1 : window.devicePixelRatio || 1,
      autoDensity: !window.automationScreenshot,
      transparent: true,
    });

    // TODO: Some older mobile devices run things a little slower.
    //  passing in the option 'legacy:true' to the renderer can help with performance.
    //  https://github.com/pixijs/pixi.js/wiki/v4-Performance-Tips
    //  Is this correct application?
    //  this.renderer.options.legacy = true;
    //  this.renderer.reset();

    // option to try for headless tests (didn't work yet)
    // https://github.com/pixijs/pixi.js/issues/5778
    // PIXI.settings.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT = false;

    this.stage = this.instance.stage;
    this.renderer = this.instance.renderer;
    this.ticker = this.instance.ticker;
    this.view = this.instance.view;

    // Handler for "pixi engine and Viewport" dimensions dependency on window size
    window.addEventListener('resize', this.resizePageHandler);
    setTimeout(() => this.resizePageHandler());
    // window.addEventListener('orientationchange', this.orientationchangeViewportHandler, false);

    // // We stop Pixi ticker using stop() function because autoStart = false does NOT stop the shared ticker:
    // // doc: http://pixijs.download/release/docs/PIXI.Application.html
    // this.pixiApp.ticker.stop();
    // // Now, we use 'tick' from gsap
    // gsap.ticker.add(() => {
    //   this.pixiApp.ticker.update();
    // });
    // gsap.registerPlugin(PixiPlugin);
    // PixiPlugin.registerPIXI(PIXI);
  }

  get renderScreenWidth() {
    return this.instance.screen.width;
  }

  get renderScreenHeight() {
    return this.instance.screen.height;
  }

  public addToStage() {}

  public pauseEngine(): void {
    this.instance.stage.interactive = false;
    this.instance.ticker.stop();
  }

  public unpauseEngine(): void {
    this.instance.stage.interactive = true;
    this.instance.ticker.start();
  }

  public resizePageHandler(): void {
    // solution ref: https://github.com/davidfig/pixi-viewport/issues/212#issuecomment-608231281
    if (
      this.app.engine.renderScreenWidth !== this.app.hostHTMLWidth ||
      this.app.engine.renderScreenHeight !== this.app.hostHTMLHeight
    ) {
      this.app.engine.resizeRenderScreen(this.app.hostHTMLWidth, this.app.hostHTMLHeight);
    }
  }

  public resizeRenderScreen(width: number, height: number): void {
    this.instance.renderer.resize(width, height);
    this.triggerEvent('resizeRenderScreen');
  }

  public getScreenCoordsFromMouse(): IScreenCoords {
    const { x: sX, y: sY } = this.renderer.plugins.interaction.eventData.data.global;
    return { sX, sY };
  }

  public addEventListener(eventType: CgEngineEvents, cb: Function) {
    if (eventType === 'resizeRenderScreen') {
      this.eventList.resizeRenderScreen.push(cb);
    }
  }

  // todo: implement
  // public removeEventListener(eventType: CgEngineEvents, cb: Function) {
  //   //
  // }

  private triggerEvent(eventType: CgEngineEvents) {
    if (this.eventList.hasOwnProperty(eventType)) {
      if (eventType === 'resizeRenderScreen') {
        this.eventList[eventType].forEach((cb) => {
          const e: IResizeRenderScreenEvent = {
            renderScreenWidth: this.app.engine.renderScreenWidth,
            renderScreenHeight: this.app.engine.renderScreenHeight,
          };
          cb(e);
        });
      }
    }
  }
}
