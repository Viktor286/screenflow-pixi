import * as PIXI from 'pixi.js';
import { Snapshot } from './Snapshot';
import MemoEvents from './InteractionEvents/MemoEvents';
import FlowApp from './FlowApp';

interface IMemos {
  list: Memo[];
  selected: Memo[];
}

export default class Memos {
  list: Memo[];
  selected: Memo[];

  constructor(public app: FlowApp) {
    this.list = [];
    this.selected = [];
  }

  addMemo(resource: PIXI.Texture) {
    const memo = new Memo(resource, this.app);
    this.list.push(memo);
    this.app.viewport.addToViewport(memo);
  }

  // /**
  //  *
  //  * This function starts non-redux pattern
  //  *
  //  **/
  // static createMemosFromPixiResources(resources: PIXI.IResourceDictionary): Memo[] {
  //   let memos: Memo[] = [];
  //   for (const resource of Object.values(resources)) {
  //     const s = new Memo(resource.texture);
  //     memos.push(s);
  //   }
  //   return memos;
  // }
}

export class Memo extends PIXI.Container {
  snapshot: Snapshot;
  selected: boolean;
  selectionDrawing: PIXI.Graphics;
  width: number;
  height: number;

  constructor(texture: PIXI.Texture, app: FlowApp) {
    super();
    this.snapshot = new Snapshot(texture, this);

    this.width = this.snapshot.width;
    this.height = this.snapshot.height;

    this.selected = false;
    this.selectionDrawing = new PIXI.Graphics();

    new MemoEvents(this, app.devMonitor);

    this.addChild(this.snapshot.sprite);
    this.addChild(this.selectionDrawing);
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
