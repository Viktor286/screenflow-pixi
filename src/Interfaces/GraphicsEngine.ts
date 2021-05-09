import * as PIXI from 'pixi.js';
import FlowApp from './FlowApp';
import { blobToHTMLImageElement } from './AssetLoader';

export default class GraphicsEngine {
  public readonly instance: PIXI.Application;
  public readonly stage: PIXI.Container;
  public readonly renderer: PIXI.Renderer;
  public readonly ticker: PIXI.Ticker;

  constructor(public app: FlowApp) {
    const hostHTMLWidth = this.app.hostHTML.clientWidth;
    const hostHTMLHeight = this.app.hostHTML.clientHeight;

    this.instance = new PIXI.Application({
      width: hostHTMLWidth,
      height: hostHTMLHeight,
      antialias: true,
      // TODO: res 1 for slow devices or native pixel only for new devices?
      resolution: window.automationScreenshot ? 1 : window.devicePixelRatio || 1,
      autoDensity: !window.automationScreenshot,
      transparent: true,
    });

    // TODO: Some older mobile devices run things a little slower.
    //  passing in the option 'legacy:true' to the renderer can help with performance.
    //  https://github.com/pixijs/pixi.js/wiki/v4-Performance-Tips
    //  Is this correct application?
    //  this.renderer.options.legacy = true;
    //  this.renderer.reset();

    // option to try for headless tests (didn't work yet)
    // https://github.com/pixijs/pixi.js/issues/5778
    // PIXI.settings.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT = false;

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
    // gsap.registerPlugin(PixiPlugin);
    // PixiPlugin.registerPIXI(PIXI);
  }

  get screenWidth() {
    return this.instance.screen.width;
  }

  get screenHeight() {
    return this.instance.screen.height;
  }

  public addDisplayObject(...children: PIXI.DisplayObject[]): PIXI.DisplayObject {
    return this.instance.stage.addChild(...children);
  }

  public pauseEngine(): void {
    this.instance.stage.interactive = false;
    this.instance.ticker.stop();
  }

  public unpauseEngine(): void {
    this.instance.stage.interactive = true;
    this.instance.ticker.start();
  }
}

export async function createTextureFromBlob(imageBlob: Blob): Promise<PIXI.Texture> {
  const mediaSourceAsHTMLImageElement = await blobToHTMLImageElement(new Blob([imageBlob]));
  return new PIXI.Texture(new PIXI.BaseTexture(mediaSourceAsHTMLImageElement));

  // *** notes ***

  // // (works) Rely on PIXI.Texture.fromURL (analog of "blobToHTMLImageElement -> BaseTexture -> PIXI.Texture")
  // const texture = await PIXI.Texture.fromURL(this.mediaSource);

  // // (works) Based64 attempt
  // function arrayBufferToBase64(buffer: ArrayBuffer) {
  //   var binary = '';
  //   var bytes = [].slice.call(new Uint8Array(buffer));
  //   bytes.forEach((b) => (binary += String.fromCharCode(b)));
  //   return window.btoa(binary);
  // }
  // const dataImage = 'data:image/png;base64,';
  // const imageBase64 = arrayBufferToBase64(buffer);
  // const texture = await PIXI.Texture.from(dataImage + imageBase64);

  // // (doesn't work with error trying to create texture from Uint8Array)
  // const { width, height } = await getRemoteImageSize(this.mediaSource);
  // const base = await PIXI.BaseTexture.fromBuffer(new Uint8Array(buffer), width, height);
  // const texture = new PIXI.Texture(base);

  // // (doesn't work with error "Tainted canvases may not be loaded.")
  // const image = await loadUrlAsImage(this.mediaSource);
  // const canvas = image2Canvas(image);
  // document.body.appendChild(canvas);
  // const base = new PIXI.BaseTexture(canvas);
  // const texture = new PIXI.Texture(base);
}

export function extractBlobImageFromContainer(
  renderer: PIXI.Renderer,
  container: PIXI.Container,
  imageMime = 'image/png',
): Promise<Blob> {
  return new Promise((resolve) => {
    try {
      const ctx = renderer.plugins.extract.canvas(container);
      ctx.toBlob((blob: Blob) => {
        resolve(blob);
      }, imageMime); // alternatively we can get jpg with compression
    } catch (e) {
      throw new Error('Failed to extract BlobImage from renderer');
    }
  });

  // *** notes for image extraction ***

  // renderer.plugins.extract API has .image, .base64, .pixels
  // https://github.com/pixijs/pixi.js/blob/adaf4db0df0df58f84d9e8a59db31aa97f864a0e/packages/extract/src/Extract.ts#L13
  // There might be issues with renderer.plugins.extract
  // https://www.html5gamedevs.com/topic/41926-get-pixeldata-in-a-webgl/

  // more examples of using .pixels (via gl.readPixels)
  // https://jsfiddle.net/bigtimebuddy/a6vc5ye8/
  // https://github.com/pixijs/pixi.js/issues/4895

  //  Other approach pixels array to PNG with some libs
  //  but then we can go down deep into manual png construction
  //  probably png-chunk-text/png-chunks-encode/png-chunks-extract (ex: Excalidraw)
  //  https://medium.com/the-guardian-mobile-innovation-lab/generating-images-in-javascript-without-using-the-canvas-api-77f3f4355fad
  //  https://vivaxyblog.github.io/2019/11/07/decode-a-png-image-with-javascript.html
}

export function drawTextureWithRoundCornersOnGraphics(
  graphics: PIXI.Graphics,
  texture: PIXI.Texture,
  { width = 0, height = 0, cornerRadius = 0 },
) {
  return graphics
    .beginTextureFill({ texture }) // mask is very slow
    .drawRoundedRect(0, 0, width, height, cornerRadius)
    .endFill();
}

export function drawRoundedBorderOnGraphics(
  graphics: PIXI.Graphics,
  { width = 0, height = 0, cornerRadius = 0, lineWidth = 1, lineColor = 0x000000 },
) {
  // Rounded corners border
  graphics.clear().lineStyle(lineWidth, lineColor).drawRoundedRect(0, 0, width, height, cornerRadius);
}

// ** OTHER NOTES

// import { gsap } from 'gsap';
// import { PixiPlugin } from 'gsap/PixiPlugin';

// PIXI documentation: https://pixijs.download/dev/docs/PIXI.html
//
// Code Examples:
// sprite = new PIXI.Sprite(PIXI.loader.resources["images/anyImage.png"].texture);
// base = new PIXI.BaseTexture(anyImageObject),
// texture = new PIXI.Texture(base),
// sprite = new PIXI.Sprite(texture);
