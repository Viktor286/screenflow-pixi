import * as PIXI from 'pixi.js';
import { GraphicsEngine } from './GraphicsEngine';
import Viewport from './Viewport';
import StageEvents from './InteractionEvents/StageEvents';
import DevMonitor from './DevMonitor';
import Memos from './Memos';
import WebUI from './WebUI';
import GUI from './GUI';
import ViewportActions from '../Actions/Viewport';
import { gsap } from 'gsap';
import { PixiPlugin } from 'gsap/PixiPlugin';
import StateManager from './StateManager';

export default class FlowApp {
  engine: GraphicsEngine;
  stage: PIXI.Container;
  viewport: Viewport;
  devMonitor: DevMonitor | null; // TODO: replace for "Debug" with included prod logic
  memos: Memos;
  pixiApp: PIXI.Application;
  screen: PIXI.Rectangle;
  gui: GUI;
  webUi: WebUI;
  actions: ViewportActions;
  stageEvents: StageEvents;
  // store: Store;
  stateManager: StateManager;

  constructor(mainEngine: GraphicsEngine) {
    console.log('FlowApp', this);

    this.engine = mainEngine;
    this.pixiApp = this.engine.instance;
    this.screen = this.engine.instance.screen;
    this.stage = this.pixiApp.stage;

    // this.devMonitor = new DevMonitor();
    this.devMonitor = null;

    this.stageEvents = new StageEvents(this);

    // Setup viewport
    this.viewport = new Viewport(this);

    // Setup Memos
    this.memos = new Memos(this);

    // Actions
    this.actions = new ViewportActions(this);

    this.stateManager = new StateManager(this);

    // UI
    this.gui = new GUI(this);

    // Browser UI
    this.webUi = new WebUI(this);

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

  resizeViewportHandler = () => {
    // solution ref: https://github.com/davidfig/pixi-viewport/issues/212#issuecomment-608231281
    const hostHTMLWidth = this.engine.hostHTML.clientWidth;
    const hostHTMLHeight = this.engine.hostHTML.clientHeight;
    if (this.pixiApp.screen.width !== hostHTMLWidth) {
      this.pixiApp.renderer.resize(hostHTMLWidth, hostHTMLHeight);
      this.viewport.instance.resize(hostHTMLWidth, hostHTMLHeight);
    }
  };
}
