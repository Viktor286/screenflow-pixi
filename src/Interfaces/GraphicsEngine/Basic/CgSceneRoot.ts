import { CgInteractiveContainer } from './CgInteractiveContainer';
import { CgEngine } from '../CgEngine';

export class CgSceneRoot extends CgInteractiveContainer {
  constructor(public engine: CgEngine) {
    super(engine.stage);
    this.enableInteractive();
  }

  renderInfoUI() {
    // TODO: conditional render info
    // traverse the whole tree and call dummy.render() from bottom to top
    this.dummy.render();
    // temp traverse
    const appTree = this.getAllElements();
    appTree.forEach((e) => e.dummy.render());
  }

  getDocumentTree() {}

  getPublicStateTree() {}
}
