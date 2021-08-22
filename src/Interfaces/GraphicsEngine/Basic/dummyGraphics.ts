import * as PIXI from 'pixi.js';
import { CgBaseObject } from './CgBaseObject';

/**
 * Dummy graphics inherits x,y, scale from its parent,
 * **/
export class DummyGraphics {
  private c: CgBaseObject;
  private dummy = new PIXI.Graphics();
  public color = 0x00ff00;
  public opacity = 0.5;
  public info: string;
  private textObj = new PIXI.Text('null', {
    fontFamily: 'Arial',
    fontSize: 12,
    fill: this.color,
    align: 'right',
  });

  constructor(cgBaseObject: CgBaseObject) {
    this.c = cgBaseObject;
    this.info = `null`;
    this.c.cgObj.addChild(this.dummy);
    this.c.cgObj.addChild(this.textObj);
    setTimeout(() => this.render());
  }

  get width() {
    return this.dummy.width;
  }

  get height() {
    return this.dummy.height;
  }

  public render() {
    this.renderDummy({});
    this.updateText();
  }

  private updateText() {
    this.textObj.text = `
    ${this.c.constructor.name}
    dummy size: (${this.width.toFixed(2)} : ${this.height.toFixed(2)})
    obj coords: [${this.c.x.toFixed(2)} , ${this.c.y.toFixed(2)}]
    obj size: (${this.c.width.toFixed(2)} : ${this.c.height.toFixed(2)})
    obj scale: [${this.c.scaleX.toFixed(2)}, ${this.c.scaleY.toFixed(2)}]
    `;
    this.textObj.alpha = 0.5;
    this.c.cgObj.setChildIndex(this.textObj, this.c.cgObj.children.length - 1);
  }

  // todo: do we want support of just stroke-only highlighted of objects?
  public renderDummy({ color, opacity }: Partial<DummyGraphics>) {
    if (color) this.color = color;
    if (opacity) this.opacity = opacity;

    this.dummy.clear();
    this.dummy.beginFill(this.color, 0.1);
    // this.dummy.lineStyle(1, this.color);
    this.dummy.drawRect(0, 0, this.c.width, this.c.height);
    this.dummy.endFill();
    this.dummy.alpha = this.opacity;
    this.c.cgObj.setChildIndex(this.dummy, this.c.cgObj.children.length - 1);
  }
}
