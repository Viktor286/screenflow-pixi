import * as PIXI from 'pixi.js';

// PIXI documentation: https://pixijs.download/dev/docs/PIXI.html
//
// Module: node_modules/pixi.js/lib/pixi.es.js
//
// Code Examples:
// sprite = new PIXI.Sprite(PIXI.loader.resources["images/anyImage.png"].texture);
// base = new PIXI.BaseTexture(anyImageObject),
// texture = new PIXI.Texture(base),
// sprite = new PIXI.Sprite(texture);

export class GraphicsEngine {
  pixiApp: PIXI.Application;
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
  }
}
