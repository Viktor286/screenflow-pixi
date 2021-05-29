import { Viewport as PixiViewport } from 'pixi-viewport';
import { CgEngine } from './CgEngine';
import { CgStage } from './CgStage';
import FlowApp from '../FlowApp';

export default class CgScene {
  public stage: CgStage;
  public engine: CgEngine;

  constructor(public app: FlowApp) {
    this.engine = new CgEngine();
    this.stage = new CgStage(this.engine.stageRoot);
    this.viewport = new PixiViewport({
      screenWidth: this.app.hostHTMLWidth,
      screenHeight: this.app.hostHTMLHeight,
      worldWidth: this.app.hostHTMLWidth,
      worldHeight: this.app.hostHTMLHeight,
      interaction: this.engine.instance.renderer.plugins.interaction, // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
    });
  }
}
