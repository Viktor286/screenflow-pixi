import * as PIXI from 'pixi.js';
import { Viewport } from 'pixi-viewport';

export class PixiEngine {
  app: PIXI.Application;
  viewport: Viewport;

  constructor(targetDiv: HTMLElement, initWidth: number, initHeight: number) {
    this.app = new PIXI.Application({
      width: initWidth,
      height: initHeight,
      antialias: true,
      resolution: 1,
      transparent: true,
    });

    this.viewport = new Viewport({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      worldWidth: initWidth,
      worldHeight: initHeight,
      interaction: this.app.renderer.plugins.interaction, // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
    });

    this.viewport.drag().pinch().wheel().decelerate();

    this.app.stage.addChild(this.viewport);

    targetDiv.appendChild(this.app.view);

    /** Temp Test sample **/
    let rectangle = new PIXI.Graphics();
    rectangle.lineStyle(1.1, 0xff3300, 1);
    rectangle.drawRect(300, 300, 100, 100);
    this.viewport.addChild(rectangle);
  }
}
