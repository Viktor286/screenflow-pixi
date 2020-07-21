import { GraphicsEngine } from './GraphicsEngine';

import PIXI from 'pixi.js';
import DevMonitor from './DevMonitor';
import StageEvents from './InteractionEvents/StageEvents';
import Viewport from './Viewport';
import Memos from './Memos';

export default class FlowApp {
  engine: GraphicsEngine;
  stage: PIXI.Container;
  viewport: Viewport;
  devMonitor: DevMonitor; // TODO: replace for "Debug" with included prod logic
  memos: Memos;

  constructor(mainEngine: GraphicsEngine) {
    this.engine = mainEngine;
    this.stage = this.engine.instance.stage;

    this.devMonitor = new DevMonitor();

    // Setup stage
    this.stage.interactive = true;
    new StageEvents(this.stage, this.devMonitor);

    // Setup viewport
    this.viewport = new Viewport(this);
    this.stage.addChild(this.viewport.instance);

    // Setup Memos
    this.memos = new Memos(this);

    // Handler for "pixiApp and Viewport" dimensions dependency on window size
    window.addEventListener('resize', this.resizeViewportHandler);
  }

  resizeViewportHandler = () => {
    // solution ref: https://github.com/davidfig/pixi-viewport/issues/212#issuecomment-608231281
    const hostHTMLWidth = this.engine.hostHTML.clientWidth;
    const hostHTMLHeight = this.engine.hostHTML.clientHeight;
    this.engine.instance.renderer.resize(hostHTMLWidth, hostHTMLHeight);
    this.viewport.instance.resize(hostHTMLWidth, hostHTMLHeight);
  };
}
