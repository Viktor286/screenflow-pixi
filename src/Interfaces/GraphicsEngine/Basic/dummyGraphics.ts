import * as PIXI from 'pixi.js';
import { CgBaseObject } from './CgBaseObject';

export class DummyGraphics {
  private c: CgBaseObject;
  private dummy = new PIXI.Graphics();
  public width = 100;
  public height = 100;
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

  public render() {
    this.drawRect({});
    this.updateText();
  }

  private updateText() {
    this.textObj.text = `
    ${this.c.constructor.name}
    width: ${this.width.toFixed(2)}
    height: ${this.height.toFixed(2)}
    cgBaseObject width: ${this.c.width.toFixed(2)}
    cgBaseObject height: ${this.c.height.toFixed(2)}
    sX: ${this.c.scaleX.toFixed(2)}
    sY: ${this.c.scaleY.toFixed(2)}
    `;
    this.textObj.alpha = 0.5;

    this.textObj.position.x = this.width - this.textObj.width - 5;
    this.c.cgObj.setChildIndex(this.textObj, this.c.cgObj.children.length - 1);
  }

  public resizeDummy(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  // todo: do we want support of just stroke-only highlighted of objects?
  private drawRect({ color, width, height, opacity }: Partial<DummyGraphics>) {
    if (color) this.color = color;
    if (opacity) this.opacity = opacity;
    if (width) this.width = width;
    if (height) this.height = height;

    this.dummy.clear();
    this.dummy.beginFill(this.color, 0.1);
    // this.dummy.lineStyle(1, this.color);
    this.dummy.drawRect(0, 0, this.width, this.height);
    this.dummy.endFill();
    this.dummy.alpha = this.opacity;
    this.c.cgObj.setChildIndex(this.dummy, this.c.cgObj.children.length - 1);
  }
}
