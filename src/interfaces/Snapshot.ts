import * as PIXI from 'pixi.js';
import Memo from './Memo';

/** TODO: Snapshot needs to have its own set of events, extends PIXI.Container ? **/

export class Snapshot {
  title: string;
  parent: PIXI.Container;
  parentList: Memo[] | undefined;
  sprite: PIXI.Sprite;
  selectionDrawing: PIXI.Graphics;
  selected: boolean;
  width: number;
  height: number;

  constructor(texture: PIXI.Texture, parent: PIXI.Container) {
    const sprite = PIXI.Sprite.from(texture);
    this.title = '';
    this.parent = parent;
    this.parentList = undefined;
    this.sprite = sprite;
    this.selectionDrawing = new PIXI.Graphics();
    this.selected = false;
    this.width = sprite.width;
    this.height = sprite.height;
  }

  select() {
    this.selected = true;
    // clear list, add current
    this.drawSelection();
  }

  deselect() {
    this.selected = false;
    // clear list, rm current
    this.eraseSelection();
  }

  drawSelection(zoomLevel: number = 1): void {
    this.selectionDrawing
      .clear()
      .lineStyle(1.1 / zoomLevel / this.parent.transform.scale.x, 0x73b2ff)
      .drawRect(0, 0, this.width, this.height);
  }

  eraseSelection() {
    this.selectionDrawing.clear();
  }
}
