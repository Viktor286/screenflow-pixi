import * as PIXI from 'pixi.js';
import { fileSave } from 'browser-nativefs';

// browser-nativefs docs
// https://github.com/GoogleChromeLabs/browser-nativefs#api-documentation

export default class FilesIO {
  static async fileSavePng(blob: Blob, fileName = 'Untitled.png') {
    return await fileSave(blob, {
      fileName,
      extensions: ['.png'],
    });
  }

  static downloadFileToClient(data: Blob, filename: string, type: string) {
    const file = new Blob([data], { type: type });
    const a = document.createElement('a');
    const url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }

  static saveImageToBlobStore(blob: Blob) {
    return new Promise((resolve) => {
      const imageObjectURL = window.URL.createObjectURL(blob);
      console.log('imageObjectURL', imageObjectURL);
      const imageElement = new Image();
      imageElement.setAttribute('src', imageObjectURL);
      imageElement.onload = () => {
        URL.revokeObjectURL(imageObjectURL);
        resolve(imageElement);
      };
    });
  }

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
