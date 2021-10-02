import * as PIXI from 'pixi.js';
import { CgContainer } from '../Basic/CgContainer';

export class CgDrawContainer extends CgContainer {
  graphicContent = new Map<string, PIXI.Graphics>();

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    super();
  }

  createGraphics(gKey: string) {
    const g = new PIXI.Graphics();
    this.cgObj.addChild(g);
    this.graphicContent.set(gKey, g);
  }

  removeGraphics(gKey: string) {
    return this.graphicContent.delete(gKey);
  }

  getGraphics(gKey: string) {
    return this.graphicContent.get(gKey);
  }

  clearGraphics(gKey: string) {
    const g = this.getGraphics(gKey);
    if (g) g.clear();
  }

  drawRect(gKey: string, { width = 0, height = 0, lineWidth = 1, lineColor = 0x000000 }) {
    const g = this.getGraphics(gKey);
    if (g) {
      // Sharp corners border
      g.clear().lineStyle(lineWidth, lineColor).drawRect(0, 0, width, height);
    }
  }

  drawRectWithRoundedCorners(
    gKey: string,
    { width = 0, height = 0, cornerRadius = 0, lineWidth = 1, lineColor = 0x000000 },
  ) {
    const g = this.getGraphics(gKey);
    if (g) {
      // Round corners border
      g.clear().lineStyle(lineWidth, lineColor).drawRoundedRect(0, 0, width, height, cornerRadius);
    }
  }
}
