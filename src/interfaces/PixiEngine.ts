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

    this.pixiViewport = new Viewport({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      worldWidth: initWidth,
      worldHeight: initHeight,
      interaction: this.pixiApp.renderer.plugins.interaction, // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
    });

    this.pixiViewport.drag().pinch().wheel().decelerate();

    this.pixiApp.stage.addChild(this.pixiViewport);

    targetDiv.appendChild(this.pixiApp.view);

    /** Temp Test sample **/
    let rectangle = new PIXI.Graphics();
    rectangle.lineStyle(1.1, 0xff3300, 1);
    rectangle.drawRect(300, 300, 100, 100);
    this.pixiViewport.addChild(rectangle);
  }

  static loadUrlSet(urlSet: string[]): Promise<PIXI.Loader> {
    return new Promise((resolve) => {
      const loader = new PIXI.Loader();
      loader
        .add(urlSet)
        .on('progress', PixiEngine.urlSetLoaderProgress)
        .load((loader: PIXI.Loader) => resolve(loader));
    });
  }

  static urlSetLoaderProgress(
    loader: PIXI.Loader,
    resource: PIXI.LoaderResource,
  ): void {
    console.log('loading: ' + resource.url);
    // console.log("progress: " + loader.progress + "%");
    //If you gave your files names as the first argument
    //of the `add` method, you can access them like this
    //console.log("loading: " + resource.name);
  }
}
