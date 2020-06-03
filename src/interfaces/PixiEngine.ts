import * as PIXI from 'pixi.js';
import { Viewport } from 'pixi-viewport';

// sprite = new PIXI.Sprite(PIXI.loader.resources["images/anyImage.png"].texture);
// base = new PIXI.BaseTexture(anyImageObject),
// texture = new PIXI.Texture(base),
// sprite = new PIXI.Sprite(texture);

export class PixiEngine {
  pixiApp: PIXI.Application;
  pixiViewport: Viewport;

  constructor(targetDiv: HTMLElement, initWidth: number, initHeight: number) {
    this.pixiApp = new PIXI.Application({
      width: initWidth,
      height: initHeight,
      antialias: true,
      resolution: 1,
      transparent: true,
    });
    targetDiv.appendChild(this.pixiApp.view);

    // Viewport
    this.pixiViewport = new Viewport({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      worldWidth: initWidth,
      worldHeight: initHeight,
      interaction: this.pixiApp.renderer.plugins.interaction, // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
    });

    this.pixiViewport.drag().pinch().wheel().decelerate();

    // Initial render of blank viewport
    this.pixiApp.stage.addChild(this.pixiViewport);
  }

  addToViewport(displayObject: PIXI.DisplayObject | PIXI.DisplayObject[]) {
    if (Array.isArray(displayObject)) {
      return this.pixiViewport.addChild(...displayObject);
    }

    return this.pixiViewport.addChild(displayObject);
  }
}
