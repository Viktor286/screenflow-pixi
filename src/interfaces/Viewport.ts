import PIXI from 'pixi.js';
import { GraphicsEngine } from './GraphicsEngine';
import { Viewport as PixiViewport } from 'pixi-viewport';
import FlowApp from './FlowApp';

// Viewport documentation: https://davidfig.github.io/pixi-viewport/jsdoc/Viewport.html
// Module: node_modules/pixi-viewport/dist/viewport.es.js

export default class Viewport {
  instance: PixiViewport;
  engine: GraphicsEngine;

  constructor(public app: FlowApp) {
    this.engine = app.engine;
    this.instance = this.setupViewport(this.engine.hostHTML.clientWidth, this.engine.hostHTML.clientHeight);
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
      interaction: this.engine.instance.renderer.plugins.interaction, // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
    });

    // viewport.drag().pinch().wheel().decelerate();

    return viewport;
  }

  addToViewport(displayObject: PIXI.DisplayObject) {
    return this.instance.addChild(displayObject);
  }
}
