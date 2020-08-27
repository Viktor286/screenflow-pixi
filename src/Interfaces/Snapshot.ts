import * as PIXI from 'pixi.js';
import { Memo } from './Memos';

/** TODO: Snapshot needs to have its own set of events, extends PIXI.Container ? **/

export class Snapshot {
  title: string;
  parent: PIXI.Container;
  parentList: Memo[] | undefined;
  sprite: PIXI.Sprite;
  width: number;
  height: number;

  constructor(texture: PIXI.Texture, parent: PIXI.Container) {
    const sprite = PIXI.Sprite.from(texture);
    this.title = '';
    this.parent = parent;
    this.parentList = undefined;
    this.sprite = sprite;
    this.width = sprite.width;
    this.height = sprite.height;
  }
}
