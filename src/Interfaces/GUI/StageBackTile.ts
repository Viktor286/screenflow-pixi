import * as PIXI from 'pixi.js';
import FlowApp from '../FlowApp';
// import { gsap } from 'gsap';

export default class StageBackTile {
  // lvlTileTop: PIXI.TilingSprite;
  private tileMiddle: PIXI.TilingSprite;
  // lvlTileLow: PIXI.TilingSprite;

  constructor(public app: FlowApp) {
    // https://pixijs.io/examples/#/sprite/tiling-sprite.js
    // http://pixijs.download/release/docs/PIXI.TilingSprite.html

    const tileTx = PIXI.Texture.from(
      'http://192.168.1.152:5000/texture/grid-tiles/simple-grid_512(alpha).png',
    );

    this.tileMiddle = this.createTile(tileTx);
    // this.lvlTileLow = this.createTile(tileTx);

    // this.tileMiddle.blendMode = PIXI.BLEND_MODES.LIGHTEN;
    // this.lvlTileLow.blendMode = PIXI.BLEND_MODES.LIGHTEN;

    // this.initGridShader(this.app.viewport.screenWidth, this.app.viewport.screenHeight);

    this.updateGraphics();
    // console.log('this.tileMiddle', this.tileMiddle);
  }

  public updateDimensions(hostHTMLWidth: number, hostHTMLHeight: number) {
    this.tileMiddle.width = hostHTMLWidth;
    this.tileMiddle.height = hostHTMLHeight;

    // this.lvlTileLow.width = hostHTMLWidth;
    // this.lvlTileLow.height = hostHTMLHeight;
  }

  public updateGraphics() {
    this.tileMiddle.tileScale.x = this.app.viewport.scale * 0.25;
    this.tileMiddle.tileScale.y = this.app.viewport.scale * 0.25;

    this.tileMiddle.tilePosition.x = this.app.viewport.x;
    this.tileMiddle.tilePosition.y = this.app.viewport.y;
    // if (this.app.viewport.scale > 1) {
    //   const nVal = gsap.utils.normalize(9, 1, this.app.viewport.scale);
    //   this.tileMiddle.alpha = nVal;
    //   console.log('normalize', nVal);
    // }
    // this.lvlTileLow.tileScale.x = this.app.viewport.scale * 0.1;
    // this.lvlTileLow.tileScale.y = this.app.viewport.scale * 0.1;
    // this.lvlTileLow.tilePosition.x = this.app.viewport.x;
    // this.lvlTileLow.tilePosition.y = this.app.viewport.y;
  }

  private createTile(tileTx: PIXI.Texture) {
    // console.log('tileTx', tileTx);
    // tileTx.width
    // tileTx.height

    const tile = new PIXI.TilingSprite(tileTx, this.app.viewport.screenWidth, this.app.viewport.screenHeight);

    tile.roundPixels = true;
    // tile.filters = [new PIXI.Filter(undefined, this.shader())];

    this.app.engine.stage.addChild(tile);
    this.app.engine.stage.setChildIndex(tile, 0);

    return tile;
  }

  /**
   * Reference to start diving into shaders for PIXI
   * https://www.html5gamedevs.com/topic/44488-cant-get-grid-shader-to-work-v3-to-v5/?do=findComment&comment=247713
   *
   * About GLSL shaders in general "The Book of Shaders"
   * https://thebookofshaders.com/
   *
   * Examples adopted from an interesting article
   * https://css-tricks.com/building-an-images-gallery-using-pixijs-and-webgl/
   * */
  //   private shader() {
  //     return `#ifdef GL_ES
  // precision mediump float;
  // #endif
  //
  // float isGridLine (vec2 coord) {
  //   vec2 pixelsPerGrid = vec2(50.0, 50.0);
  //   vec2 gridCoords = fract(coord / pixelsPerGrid);
  //   vec2 gridPixelCoords = gridCoords * pixelsPerGrid;
  //   vec2 gridLine = step(gridPixelCoords, vec2(1.0));
  //   float isGridLine = max(gridLine.x, gridLine.y);
  //   return isGridLine;
  // }
  //
  // void main () {
  //   vec2 coord = gl_FragCoord.xy;
  //   vec3 color = vec3(0.0);
  //   color.b = isGridLine(coord) * 0.3;
  //   gl_FragColor = vec4(color, 1.0);
  // }`;
  //   }

  /**
   * https://www.html5gamedevs.com/topic/44488-cant-get-grid-shader-to-work-v3-to-v5/
   * https://codepen.io/ardenpm/pen/pVojYG
   * */
  // private initGridShader(width: number, height: number) {
  //   const uniforms = {
  //     vpw: width,
  //     vph: height,
  //     offset: { type: 'v2', value: { x: 0, y: 0 } },
  //     pitch: { type: 'v2', value: { x: 50, y: 50 } },
  //     resolution: { type: 'v2', value: { x: width, y: height } },
  //   };
  //
  //   const gridShader = new PIXI.Filter('', this.gridShader(), uniforms);
  //   const rect = new PIXI.Graphics().drawRect(0, 0, width, height);
  //   rect.filters = [gridShader];
  //   this.app.engine.stage.addChild(rect);
  //   this.app.engine.stage.setChildIndex(rect, 0);
  // }

  //   private gridShader() {
  //     return `precision mediump float;
  //
  // uniform float vpw; // Width, in pixels
  // uniform float vph; // Height, in pixels
  //
  // uniform vec2 offset; // e.g. [-0.023500000000000434 0.9794000000000017], currently the same as the x/y offset in the mvMatrix
  // uniform vec2 pitch;  // e.g. [50 50]
  //
  // void main() {
  //   float lX = gl_FragCoord.x / vpw;
  //   float lY = gl_FragCoord.y / vph;
  //
  //   float scaleFactor = 100.0;
  //
  //   float offX = (scaleFactor * offset[0]) + gl_FragCoord.x;
  //   float offY = (scaleFactor * offset[1]) + (1.0 - gl_FragCoord.y);
  //
  //   if (int(mod(offX, pitch[0])) == 0 ||
  //       int(mod(offY, pitch[1])) == 0) {
  //     gl_FragColor = vec4(0.0, 0.0, 0.0, 0.5);
  //   } else {
  //     gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  //   }
  // }`;
  //   }
}
