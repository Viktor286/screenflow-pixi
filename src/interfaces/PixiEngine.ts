import * as PIXI from 'pixi.js';
import { Viewport } from 'pixi-viewport';

// sprite = new PIXI.Sprite(PIXI.loader.resources["images/anyImage.png"].texture);
// base = new PIXI.BaseTexture(anyImageObject),
// texture = new PIXI.Texture(base),
// sprite = new PIXI.Sprite(texture);

export class PixiEngine {
  pixiApp: PIXI.Application;
  pixiViewport: Viewport;
  hostHTML: HTMLElement;

  constructor(targetDiv: HTMLElement) {
    this.hostHTML = targetDiv;

    const hostHTMLWidth = this.hostHTML.clientWidth;
    const hostHTMLHeight = this.hostHTML.clientHeight;

    this.pixiApp = new PIXI.Application({
      width: hostHTMLWidth,
      height: hostHTMLHeight,
      antialias: true,
      resolution: 1,
      transparent: true,
    });

    this.hostHTML.appendChild(this.pixiApp.view);

    // Viewport
    this.pixiViewport = new Viewport({
      screenWidth: hostHTMLWidth,
      screenHeight: hostHTMLHeight,
      worldWidth: hostHTMLWidth,
      worldHeight: hostHTMLHeight,
      interaction: this.pixiApp.renderer.plugins.interaction, // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
    });

    this.pixiViewport.drag().pinch().wheel().decelerate();

    // Initial render of blank viewport
    this.pixiApp.stage.addChild(this.pixiViewport);

    // Events
    window.addEventListener('resize', this.resizeViewportHandler);
  }

  addToViewport(displayObject: PIXI.DisplayObject | PIXI.DisplayObject[]) {
    if (Array.isArray(displayObject)) {
      return this.pixiViewport.addChild(...displayObject);
    }

    return this.pixiViewport.addChild(displayObject);
  }

  resizeViewportHandler = () => {
    // solution ref: https://github.com/davidfig/pixi-viewport/issues/212#issuecomment-608231281
    const hostHTMLWidth = this.hostHTML.clientWidth;
    const hostHTMLHeight = this.hostHTML.clientHeight;
    this.pixiViewport.resize(hostHTMLWidth, hostHTMLHeight);
    this.pixiApp.renderer.resize(hostHTMLWidth, hostHTMLHeight);
  };
}
