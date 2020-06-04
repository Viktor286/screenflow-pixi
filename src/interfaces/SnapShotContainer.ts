import * as PIXI from 'pixi.js';
import { Snapshot } from './Snapshot';

export default class SnapShotContainer extends PIXI.Container {
  snapshot: Snapshot;

  constructor(texture: PIXI.Texture) {
    super();
    this.snapshot = new Snapshot(texture, this);
    this.addChild(this.snapshot.sprite);
    this.addChild(this.snapshot.selectionDrawing);
  }

  /**
   *
   * This function starts non-redux pattern
   * SnapShotContainer is in fact renderContainer
   * can we/need we? manage SnapShot store before render
   *
   **/
  static createSnapShotsFromPixiResources(
    resources: PIXI.IResourceDictionary,
  ): SnapShotContainer[] {
    let store: SnapShotContainer[] = [];
    for (const resource of Object.values(resources)) {
      const s = new SnapShotContainer(resource.texture);
      store.push(s);
    }
    return store;
  }
}
