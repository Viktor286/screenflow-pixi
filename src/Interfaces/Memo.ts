import * as PIXI from 'pixi.js';
import { Snapshot } from './Snapshot';
import FlowApp from './FlowApp';
import BoardElement from './BoardElement';
import { IWorldCoords } from './Viewport';

export default class Memo extends BoardElement {
  private snapshot: Snapshot;
  [key: string]: any;

  constructor(texture: PIXI.Texture, public app: FlowApp) {
    super(app);
    this.snapshot = new Snapshot(texture, this);

    this.container.addChild(this.snapshot.sprite);

    this.container.interactive = true;
  }

  public setDragState() {
    this.snapshot.sprite.tint = 0x91b6e3;
  }

  public unsetDragState() {
    this.snapshot.sprite.tint = 0xffffff;
  }

  public startDrag(startPoint: IWorldCoords) {
    this.setDragState();
    super.startDrag(startPoint);
  }

  public stopDrag() {
    this.unsetDragState();
    super.stopDrag();
  }

  public extractPngBlob() {
    return new Promise((resolve) => {
      const renderer = this.app.engine.renderer;

      // renderer.plugins.extract API has .image, .base64, .pixels
      // https://github.com/pixijs/pixi.js/blob/adaf4db0df0df58f84d9e8a59db31aa97f864a0e/packages/extract/src/Extract.ts#L13
      // There might be issues with renderer.plugins.extract
      // https://www.html5gamedevs.com/topic/41926-get-pixeldata-in-a-webgl/

      // more examples of using .pixels (via gl.readPixels)
      // https://jsfiddle.net/bigtimebuddy/a6vc5ye8/
      // https://github.com/pixijs/pixi.js/issues/4895

      if (this.isSelected) this.eraseSelectionDrawing();

      const ctx = renderer.plugins.extract.canvas(this.container);
      ctx.toBlob((blob: Blob) => {
        resolve(blob);
      }, 'image/png'); // alternatively we can get jpg with compression

      if (this.isSelected) this.drawSelection();

      //  Other approach pixels array to PNG with some libs
      //  but then we can go down deep into manual png construction
      //  probably png-chunk-text/png-chunks-encode/png-chunks-extract (ex: Excalidraw)
      //  https://medium.com/the-guardian-mobile-innovation-lab/generating-images-in-javascript-without-using-the-canvas-api-77f3f4355fad
      //  https://vivaxyblog.github.io/2019/11/07/decode-a-png-image-with-javascript.html
    });
  }
}
