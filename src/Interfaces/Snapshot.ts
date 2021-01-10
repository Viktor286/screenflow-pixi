import * as PIXI from 'pixi.js';
import Memo from './Memo';

export class Snapshot {
  public title: string;
  public readonly parent: Memo;
  public readonly parentList: Memo[] | undefined;
  public sprite: PIXI.Sprite;
  public width: number;
  public height: number;
  public textureGraphics = new PIXI.Graphics();

  constructor(texture: PIXI.Texture, parent: Memo) {
    const sprite = PIXI.Sprite.from(texture);
    this.title = '';
    this.parent = parent;
    this.parentList = undefined;
    this.sprite = sprite;
    this.width = sprite.width; // or texture.width
    this.height = sprite.height; // or texture.height

    // Image Rounded corners implementation
    this.textureGraphics
      .beginTextureFill({ texture }) // mask is very slow
      .drawRoundedRect(0, 0, this.width, this.height, this.parent.cornerRadius)
      .endFill();

    // TODO: Does it requite x2 memory to store both sprite and Graphics?
  }
}
