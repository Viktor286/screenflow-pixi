import * as PIXI from 'pixi.js';

export default class FilesIO {
  static loadUrlSet(urlSet: string[]): Promise<PIXI.Loader> {
    return new Promise((resolve) => {
      const loader = new PIXI.Loader();
      loader
        .add(urlSet)
        // .on('progress', FilesIO.urlSetLoaderProgress)
        .load((loader: PIXI.Loader) => resolve(loader));
    });
  }

  // static urlSetLoaderProgress(
  //   loader: PIXI.Loader,
  //   resource: PIXI.LoaderResource,
  // ): void {
  //   console.log('loading: ' + resource.url);
  //   console.log('progress: ' + loader.progress + '%');
  //   //If you gave your files names as the first argument
  //   //of the `add` method, you can access them like this
  //   //console.log("loading: " + resource.name);
  // }
}
