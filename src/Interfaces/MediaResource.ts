import * as PIXI from 'pixi.js';
import Memo from './Memo';
import { loadMediaSource } from './AssetLoader';
import { IBoardImage } from './Board';
import {
  createTextureFromBlob,
  drawTextureWithRoundCornersOnGraphics,
  extractBlobImageFromContainer,
} from './GraphicsEngine';

export type TMediaSource = string;

export interface IMediaResource {
  isLoaded: boolean;
  mediaSource: TMediaSource; // in future could be base64, URL, SVG, serialized bitmap buffer
  // loadSource(): Promise<boolean>;
}

/**
 * ImageMedia is container for "graphics" objects
 * It constructs empty, loading media async
 * */
export class ImageMedia implements IMediaResource {
  public readonly parent: Memo;
  public isLoaded = false;
  public mediaSource: TMediaSource;
  public width: number = 0;
  public height: number = 0;

  // TODO: can we completely abstract from direc PIXI usage?
  public texture = new PIXI.Texture(new PIXI.BaseTexture());
  public graphics = new PIXI.Graphics();
  public container = new PIXI.Container();

  constructor(imageUrl: string, parent: Memo) {
    this.parent = parent;
    this.mediaSource = imageUrl;
    this.initializeImageMedia().then(() => {
      this.isLoaded = true;
    });
  }

  public async initializeImageMedia(mediaSource?: TMediaSource) {
    if (mediaSource) this.mediaSource = mediaSource;
    // todo: run loading spinner?
    const mediaSourceAsHTMLImageElement = await loadMediaSource(this.mediaSource);
    this.texture = await createTextureFromBlob(mediaSourceAsHTMLImageElement);
    this.width = this.texture.width;
    this.height = this.texture.height;
    this.processGraphics();
    this.container.addChild(this.graphics);
    console.log('this.container', this.container);
  }

  public resetGraphics() {
    drawTextureWithRoundCornersOnGraphics(this.graphics, this.texture, {
      width: this.width,
      height: this.height,
      cornerRadius: this.parent.cornerRadius,
    });
  }

  public processGraphics() {
    drawTextureWithRoundCornersOnGraphics(this.graphics, this.texture, {
      width: this.width,
      height: this.height,
      cornerRadius: 0,
    });
  }

  public async extractBoardImageObj(): Promise<IBoardImage> {
    this.resetGraphics();
    const containerGraphicsBlob = await extractBlobImageFromContainer(
      this.parent.board.engine.renderer,
      this.container,
    );
    this.processGraphics();
    return { data: containerGraphicsBlob, id: this.parent.id };
  }
}
