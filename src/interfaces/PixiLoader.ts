import * as PIXI from 'pixi.js';
// sprite = new PIXI.Sprite(PIXI.loader.resources["images/anyImage.png"].texture);
// base = new PIXI.BaseTexture(anyImageObject),
// texture = new PIXI.Texture(base),
// sprite = new PIXI.Sprite(texture);

export class PixiLoader {
  static loadUrlSet(urlSet: string[]): Promise<PIXI.Loader> {
    return new Promise((resolve) => {
      const loader = new PIXI.Loader();
      loader
        .add(urlSet)
        .on('progress', PixiLoader.urlSetLoaderProgress)
        .load((loader: PIXI.Loader) => resolve(loader));
    });
  }

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
}
