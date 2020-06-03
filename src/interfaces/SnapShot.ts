import * as PIXI from 'pixi.js';

export class SnapShot {
  title: string;
  parent: PIXI.Container;
  sprite: PIXI.Sprite;
  selectionDrawing: PIXI.Graphics;
  selected: boolean;
  width: number;
  height: number;

  constructor(texture: PIXI.Texture, parent: PIXI.Container) {
    const sprite = PIXI.Sprite.from(texture);
    this.title = '';
    this.parent = parent;
    this.sprite = sprite;
    this.selectionDrawing = new PIXI.Graphics();
    this.selected = true;
    this.width = sprite.width;
    this.height = sprite.height;
  }

  drawSelection(zoomLevel: number = 1): void {
    this.selectionDrawing
      .clear()
      .lineStyle(1.1 / zoomLevel / this.parent.transform.scale.x, 0x73b2ff)
      .drawRect(0, 0, this.width, this.height);
  }
}

export class SnapShotContainer extends PIXI.Container {
  snapShot: SnapShot;

  constructor(texture: PIXI.Texture) {
    super();
    this.snapShot = new SnapShot(texture, this);
    this.addChild(this.snapShot.sprite);
    this.addChild(this.snapShot.selectionDrawing);
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
