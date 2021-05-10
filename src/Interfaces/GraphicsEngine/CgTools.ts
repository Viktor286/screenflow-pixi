import * as PIXI from 'pixi.js';
import { blobToHTMLImageElement } from '../AssetLoader';

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
