import * as PIXI from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import { SnapShotContainer, SnapShotLoader } from './SnapShot';
import { SpaceModifiers } from './SpaceModifiers';

// sprite = new PIXI.Sprite(PIXI.loader.resources["images/anyImage.png"].texture);
// base = new PIXI.BaseTexture(anyImageObject),
// texture = new PIXI.Texture(base),
// sprite = new PIXI.Sprite(texture);

export class PixiLoader {
  constructor(public viewport: Viewport) {}

  static urlSetLoaderProgress(
    loader: PIXI.Loader,
    resource: PIXI.LoaderResource,
  ): void {
    console.log('loading: ' + resource.url);
    // console.log("progress: " + loader.progress + "%");
    //If you gave your files names as the first argument
    //of the `add` method, you can access them like this
    //console.log("loading: " + resource.name);
  }

  setupResourcesAsSnapshots = (loader: PIXI.Loader) => {
    const snapShots = new SnapShotLoader(loader.resources);

    /** Temp Test modifiers **/
    SpaceModifiers.positionGrid(snapShots.store, 8, 230, 120);
    snapShots.store.forEach((s, i) => {
      s.scale = new PIXI.Point(0.1, 0.1);
    });

    snapShots.store.forEach((snapShot: SnapShotContainer) => {
      this.viewport.addChild(snapShot);
    });
  };

  loadUrlSet(urlSet: string[]) {
    const loader = new PIXI.Loader();
    loader
      .add(urlSet)
      .on('progress', PixiLoader.urlSetLoaderProgress)
      .load(this.setupResourcesAsSnapshots);
  }
}
