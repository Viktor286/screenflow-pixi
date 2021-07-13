import { CgInteractiveContainer } from './CgInteractiveContainer';
import { CgEngine } from '../CgEngine';

export class CgSceneRoot extends CgInteractiveContainer {
  constructor(public engine: CgEngine) {
    super(engine.stage);
    this.enableInteractive();
  }

  renderInfoUI() {
    // TODO: render info
    // traverse the whole tree and call dummy.render() from bottom to top
    this.dummy.resizeDummy(this.engine.renderScreenWidth, this.engine.renderScreenHeight);
    this.dummy.render();
    // const appTree = this.getAllElements();
    // console.log('CgSceneRoot AllElements', appTree);
  }
}
