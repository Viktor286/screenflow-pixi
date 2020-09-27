import * as PIXI from 'pixi.js';
import { Snapshot } from './Snapshot';
import FlowApp from './FlowApp';
import BoardElement from './BoardElement';

export class Memo extends BoardElement {
  private snapshot: Snapshot;
  [key: string]: any;

  constructor(texture: PIXI.Texture, public app: FlowApp) {
    super(app);
    this.snapshot = new Snapshot(texture, this);
    this.container.addChild(this.snapshot.sprite);

    this.width = this.snapshot.width;
    this.height = this.snapshot.height;

    this.container.interactive = true;
  }
}
