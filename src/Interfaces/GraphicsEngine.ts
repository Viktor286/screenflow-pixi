import * as PIXI from 'pixi.js';
import FlowApp from './FlowApp';
import { gsap } from 'gsap';
import { PixiPlugin } from 'gsap/PixiPlugin';

// PIXI documentation: https://pixijs.download/dev/docs/PIXI.html
//
// Module: node_modules/pixi.js/lib/pixi.es.js
//
// Code Examples:
// sprite = new PIXI.Sprite(PIXI.loader.resources["images/anyImage.png"].texture);
// base = new PIXI.BaseTexture(anyImageObject),
// texture = new PIXI.Texture(base),
// sprite = new PIXI.Sprite(texture);

export default class GraphicsEngine {
  instance: PIXI.Application;
  stage: PIXI.Container;
  renderer: PIXI.Renderer;
  ticker: PIXI.Ticker;
  // screen: PIXI.Rectangle;

  constructor(public app: FlowApp) {
    const hostHTMLWidth = this.app.hostHTML.clientWidth;
    const hostHTMLHeight = this.app.hostHTML.clientHeight;

    this.instance = new PIXI.Application({
      width: hostHTMLWidth,
      height: hostHTMLHeight,
      antialias: true,
      resolution: 1,
      transparent: true,
    });

    this.stage = this.instance.stage;
    this.renderer = this.instance.renderer;
    this.ticker = this.instance.ticker;

    this.app.hostHTML.appendChild(this.instance.view);

    // // We stop Pixi ticker using stop() function because autoStart = false does NOT stop the shared ticker:
    // // doc: http://pixijs.download/release/docs/PIXI.Application.html
    // this.pixiApp.ticker.stop();
    // // Now, we use 'tick' from gsap
    // gsap.ticker.add(() => {
    //   this.pixiApp.ticker.update();
    // });
    gsap.registerPlugin(PixiPlugin);
    PixiPlugin.registerPIXI(PIXI);
  }

  get screenWidth() {
    return this.instance.screen.width;
  }

  get screenHeight() {
    return this.instance.screen.height;
  }

  addDisplayObject(...children: PIXI.DisplayObject[]): PIXI.DisplayObject {
    return this.instance.stage.addChild(...children);
  }
}
