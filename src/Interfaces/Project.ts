import { fileOpen } from 'browser-nativefs';
import JSZip from 'jszip';
import FlowApp from './FlowApp';
import FilesIO from './FilesIO';
import Memo, { MemoImage } from './Memo';

// interface ProjectObject {
//   assets: [];
//   mainState: {};
// }
//
// type ProjectFile = JSZip;

export default class Project {
  constructor(public app: FlowApp) {}

  async open() {
    await this.openFromLocal();
    // from project file (need to unpack) or from project object in localstorage
    // this.openFileFromLocal
    // this.unpack
    // this.readCache
    // this.mount
  }

  pack(): Promise<Blob> {
    return new Promise(async (resolve) => {
      const projectArchive = new JSZip();
      projectArchive.file('application.json', this.app.stateManager.exportState());

      // Save files into projectArchive
      const memoImagesPNG = await this.exportAllMemoImagesPNG();

      for (const memoImage in memoImagesPNG) {
        if (Object.prototype.hasOwnProperty.call(memoImagesPNG, memoImage)) {
          // @ts-ignore
          projectArchive.file(`images/${memoImage}.png`, memoImagesPNG[memoImage] as Blob, {
            binary: true,
            type: 'blob',
          });
        }
      }

      projectArchive
        .generateAsync({
          type: 'blob',
          compression: 'STORE',
          compressionOptions: {
            level: 9,
          },
          platform: 'UNIX',
        })
        .then(function (content) {
          resolve(content);
        });
    });

    // state.json + media assets
    // board["1gogrhcng4"]
  }

  // async unpack(projectFile: ProjectFile): ProjectObject {
  async unpack() {
    // unpack from project file
    // Zip open example
    // https://stuk.github.io/jszip/documentation/examples.html
    // // Async read files from project file
    // let asyncProjectFilesRead = [];
    //
    // const zip = new JSZip();
    // zip.loadAsync(projectFile).then((projectZip) => {
    //   projectZip.forEach((relativePath, entry) => {
    //     if (entry.name.startsWith('images') && !entry.dir) {
    //       const fileName = entry.name.slice(7);
    //       const hash = fileName.slice(0, fileName.lastIndexOf('.'));
    //       const ext = fileName.substring(fileName.lastIndexOf('.') + 1);
    //
    //       let type = undefined;
    //       if (ext === 'png') type = 'png';
    //       if (ext === 'gif') type = 'gif';
    //       if (ext === 'svg') type = 'svg+xml';
    //       if (ext === 'jpeg' || ext === 'jpg') type = 'jpeg';
    //
    //       asyncProjectFilesRead.push(
    //         entry.async('arraybuffer').then(async (arrayBuffer) => {
    //           if (arrayBuffer.byteLength > 100) {
    //             const imageBlob = new Blob([arrayBuffer], { type: `image/${type}` });
    //             // Save image to Blob Store right away
    //             const imageElement = await FilesIO.saveImageToBlobStore(imageBlob);
    //             // Return finalized ImageFileData object
    //             console.log('[progress] saved imageElement', imageElement);
    //             return await FabricBridge.constructImageFileData(imageElement, imageBlob);
    //           }
    //         }),
    //       );
    //     } else {
    //       // Handle application.json file
    //       if (entry.name === 'application.json') {
    //         asyncProjectFilesRead.push(
    //           entry.async('string').then((appJsonStr) => ({
    //             file: 'application',
    //             data: JSON.parse(appJsonStr),
    //             type: 'json',
    //           })),
    //         );
    //       }
    //     }
    //   });
    // });
  }

  async mount() {
    // project object
    // use Board API, StateManager, WebUI
    // or move this method to FlowApp class
  }

  async readCache() {
    // get project object from localstorage and validate
  }

  async saveCache() {
    // save project object into localstorage, overwrite existed projects
  }

  async deleteCache() {
    // remove all projects objects from localstorage
  }

  extractedImages: number = 0;
  extractedImagesTotal: number = 0;

  private async memoImageExtraction(memo: Memo) {
    const memoImage = await memo.extractMemoImage();
    this.extractedImages++;
    console.log(`[Export] ${this.extractedImages} MemoImage extracted from ${this.extractedImagesTotal}`);
    return memoImage;
  }

  public async exportAllMemoImagesPNG() {
    // TODO: this is temp "progress" tracking
    console.log(`[Export] image extraction started...`);

    const pngExtractionArr: Promise<MemoImage>[] = [];

    const boardMemos = this.app.board.getAllMemos();
    this.extractedImagesTotal = boardMemos.length;

    boardMemos.forEach((memo) => pngExtractionArr.push(this.memoImageExtraction(memo)));

    const fullPngCollection = await Promise.all(pngExtractionArr);

    console.log(`[Export] all images extracted`);

    this.extractedImages = 0;
    this.extractedImagesTotal = 0;

    return fullPngCollection.reduce((acc, memoImage) => ({ ...acc, ...memoImage }), {});
  }

  async openFromLocal() {
    const blob = await fileOpen({
      mimeTypes: ['image/*'],
    });
    console.log('!!! blob', blob);
    // https://web.dev/file-system-access/
    // https://www.npmjs.com/package/browser-nativefs
  }

  async saveToLocal() {
    // save File API established opened file or save new one on disk
    const projectFile = await this.pack();

    // Options are optional.
    // const options = {
    //   fileName: 'FlowProject',
    //   extensions: ['.zip'],
    //   mimeTypes: ['application/zip'],
    // };

    // https://github.com/GoogleChromeLabs/browser-nativefs

    // Optional file handle to save back to an existing file.
    // This will only work with the File System Access API.
    // Get a `FileHandle` from the `handle` property of the `Blob`
    // you receive from `fileOpen()` (this is non-standard).
    // const handle = previouslyOpenedBlob.handle;
    // const handle = undefined;

    // TODO: fileSave from browser-nativefs causes error here because of long project build time?
    // await fileSave(projectFile, options, handle);
    FilesIO.downloadFileToClient(projectFile, 'project.flow', 'application/zip');

    // await this.fileHandle.write
    // FilesIO.downloadFileToClient(content, 'project.flow', 'application/zip');
  }
}
