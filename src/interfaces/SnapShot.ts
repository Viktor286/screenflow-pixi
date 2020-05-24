import * as PIXI from 'pixi.js';

interface ISnapShotObject {
  title: string;
  resourceUrl: string;
  sprite: PIXI.Sprite;
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
    };

    this.addChild(image);
  }
}

interface ISnapShotLoader {
  store: Array<SnapShot>;
}

export class SnapShotLoader implements ISnapShotLoader {
  public store: Array<SnapShot> = [];
  constructor(resources: PIXI.IResourceDictionary) {
    for (const [resourceUrl, resource] of Object.entries(resources)) {
      this.store.push(new SnapShot(resourceUrl, resource.texture));
    }
  }
}
