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

  startDrag(startPoint: IWorldCoords) {
    super.startDrag(startPoint);
    this.snapshot.sprite.tint = 0x91b6e3;
  }

  stopDrag() {
    super.stopDrag();
    this.snapshot.sprite.tint = 0xffffff;
  }
}
