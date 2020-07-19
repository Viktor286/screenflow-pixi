import { GraphicsEngine } from './GraphicsEngine';
import Memo from './Memo';
import { Viewport } from 'pixi-viewport';
import PIXI from 'pixi.js';
import DevMonitor from './DevMonitor';
import StageEvents from './InteractionEvents/StageEvents';

interface IMemos {
  list: Memo[];
  selected: Memo[];
}

// Viewport documentation: https://davidfig.github.io/pixi-viewport/jsdoc/Viewport.html
// Module: node_modules/pixi-viewport/dist/viewport.es.js

export default class FlowApp {
  engine: GraphicsEngine; // engine
  stage: PIXI.Container; // engine.pixiApp.stage
  viewport: Viewport; // engine.pixiApp.stage.viewport
  memos: IMemos; // engine.pixiApp.stage.viewport.objects
  devMonitor: DevMonitor; // TODO: replace for "Debug" with included prod logic

  // interactionEvents: InteractionEvents;

  constructor(mainEngine: GraphicsEngine) {
    this.engine = mainEngine;
    this.stage = this.engine.pixiApp.stage;

    this.memos = {
      list: [],
      selected: [],
    };

    this.devMonitor = new DevMonitor();

    // Setup app-wide stage
    this.stage.interactive = true;
    new StageEvents(this.stage, this.devMonitor);

    this.viewport = this.setupViewport(this.engine.hostHTML.clientWidth, this.engine.hostHTML.clientHeight);

    // Initial render of blank viewport
    this.stage.addChild(this.viewport);

    // Handler for "pixiApp and Viewport" dimensions dependency on window size
    window.addEventListener('resize', this.resizeViewportHandler);
  }

  setupViewport(hostHTMLWidth: number, hostHTMLHeight: number): Viewport {
    // Code Examples:
    // this.pixiViewport.moveCenter(3, 3);

    // Viewport
    const viewport = new Viewport({
      screenWidth: hostHTMLWidth,
      screenHeight: hostHTMLHeight,
      worldWidth: hostHTMLWidth,
      worldHeight: hostHTMLHeight,
      interaction: this.engine.pixiApp.renderer.plugins.interaction, // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
    });

    viewport.drag().pinch().wheel().decelerate();

    return viewport;
  }

  addToViewport(displayObject: PIXI.DisplayObject | PIXI.DisplayObject[]) {
    if (Array.isArray(displayObject)) {
      return this.viewport.addChild(...displayObject);
    }

    return this.viewport.addChild(displayObject);
  }

  resizeViewportHandler = () => {
    // solution ref: https://github.com/davidfig/pixi-viewport/issues/212#issuecomment-608231281
    const hostHTMLWidth = this.engine.hostHTML.clientWidth;
    const hostHTMLHeight = this.engine.hostHTML.clientHeight;
    this.engine.pixiApp.renderer.resize(hostHTMLWidth, hostHTMLHeight);
    this.viewport.resize(hostHTMLWidth, hostHTMLHeight);
  };

  /** Install snapshots in list and viewport **/
  addMemo(memos: Memo | Memo[]) {
    if (!Array.isArray(memos)) {
      memos = [memos];
    }

    memos.forEach((memo) => {
      this.memos.list.push(memo);
      this.addToViewport(memos);
    });
  }
}
