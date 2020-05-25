import * as PIXI from 'pixi.js';

interface ISnapShotObject {
  title: string;
  resourceUrl: string;
  sprite: PIXI.Sprite;
  selectionDrawing: PIXI.Graphics,
  selected: boolean,
  width: number,
  height: number
}

interface ISnapShot extends PIXI.Container {
  snapShot: ISnapShotObject;
}

export class SnapShot extends PIXI.Container implements ISnapShot {
  public snapShot: ISnapShotObject;

  constructor(resourceUrl: string, texture: PIXI.Texture) {
    super();

    const image = PIXI.Sprite.from(texture);
    this.snapShot = {
      title: '',
      sprite: image,
      resourceUrl,
      selectionDrawing:  new PIXI.Graphics(),
      selected: true,
      width: image.width,
      height: image.height
    };

    this.addChild(image);
    this.addChild(this.snapShot.selectionDrawing);
    // console.log('SnapShot', this);
  }

  drawSelection(zoomLevel: number = 1) {
    this.snapShot.selectionDrawing
      .clear()
      .lineStyle(1.1 / zoomLevel / this.transform.scale.x, 0x73b2ff)
      .drawRect(0, 0, this.snapShot.width, this.snapShot.height)
  }
}

interface ISnapShotLoader {
  store: Array<SnapShot>;
}

export class SnapShotLoader implements ISnapShotLoader {
  public store: Array<SnapShot> = [];
  constructor(resources: PIXI.IResourceDictionary) {
    for (const [resourceUrl, resource] of Object.entries(resources)) {
      const s = new SnapShot(resourceUrl, resource.texture);
      this.store.push(s);
    }
  }
}
