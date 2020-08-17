import * as PIXI from 'pixi.js';
import { GraphicsEngine } from './GraphicsEngine';
import Viewport from './Viewport';
import StageEvents from './InteractionEvents/StageEvents';
import ViewportEvents from './InteractionEvents/ViewportEvents';
import DevMonitor from './DevMonitor';
import Memos from './Memos';
import { WebUi } from './WebUi';
import { Actions } from './Actions';
import { AnimateUiControls } from './Animations';
import { gsap } from 'gsap';
import { PixiPlugin } from 'gsap/PixiPlugin';

export default class FlowApp {
  engine: GraphicsEngine;
  stage: PIXI.Container;
  viewport: Viewport;
  devMonitor: DevMonitor | null; // TODO: replace for "Debug" with included prod logic
  memos: Memos;
  pixiApp: PIXI.Application;
  screen: PIXI.Rectangle;
  focusPoint: PIXI.Graphics;
  webUi: WebUi;
  actions: Actions;

  constructor(mainEngine: GraphicsEngine) {
    this.engine = mainEngine;
    this.pixiApp = this.engine.instance;
    this.screen = this.engine.instance.screen;
    this.stage = this.pixiApp.stage;
    new StageEvents(this);

    // this.devMonitor = new DevMonitor();
    this.devMonitor = null;

    // Setup viewport
    this.viewport = new Viewport(this);
    new ViewportEvents(this);

    // Setup Memos
    this.memos = new Memos(this);

    // UI
    this.focusPoint = this.initFocusPoint();

    // Actions
    this.actions = new Actions(this);

    // Browser UI
    this.webUi = new WebUi(this);

    // // We stop Pixi ticker using stop() function because autoStart = false does NOT stop the shared ticker:
    // // doc: http://pixijs.download/release/docs/PIXI.Application.html
    // this.pixiApp.ticker.stop();
    // // Now, we use 'tick' from gsap
    // gsap.ticker.add(() => {
    //   this.pixiApp.ticker.update();
    // });
    gsap.registerPlugin(PixiPlugin);
    PixiPlugin.registerPIXI(PIXI);

    // Handler for "pixiApp and Viewport" dimensions dependency on window size
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

  get screenCenter() {
    return { x: this.pixiApp.screen.width / 2, y: this.pixiApp.screen.height / 2 };
  }

  resizeViewportHandler = () => {
    // solution ref: https://github.com/davidfig/pixi-viewport/issues/212#issuecomment-608231281
    const hostHTMLWidth = this.engine.hostHTML.clientWidth;
    const hostHTMLHeight = this.engine.hostHTML.clientHeight;
    if (this.pixiApp.screen.width !== hostHTMLWidth) {
      this.pixiApp.renderer.resize(hostHTMLWidth, hostHTMLHeight);
      this.viewport.instance.resize(hostHTMLWidth, hostHTMLHeight);
    }
  };

  initFocusPoint() {
    let circle = new PIXI.Graphics();
    circle.lineStyle(0); // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
    circle.beginFill(0xfff796, 0.4);
    circle.drawCircle(0, 0, 10);
    circle.endFill();
    circle.pivot.set(0, 0);
    circle.position.set(this.screenCenter.x, this.screenCenter.y);
    circle.alpha = 0;
    this.viewport.addToViewport(circle);
    return circle;
  }

  putFocusPoint(x: number, y: number) {
    this.focusPoint.alpha = 0;
    this.focusPoint.position.set(x, y);
    AnimateUiControls.pressFocusPoint(this.focusPoint);
  }
}
