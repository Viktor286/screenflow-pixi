import * as PIXI from 'pixi.js';
import Memo from './Memo';

export class Snapshot {
  public title: string;
  public readonly parent: Memo;
  public readonly parentList: Memo[] | undefined;
  public sprite: PIXI.Sprite;
  public width: number;
  public height: number;

  constructor(texture: PIXI.Texture, parent: Memo) {
    const sprite = PIXI.Sprite.from(texture);
    this.title = '';
    this.parent = parent;
    this.parentList = undefined;
    this.sprite = sprite;
    this.width = sprite.width;
    this.height = sprite.height;
  }
}
