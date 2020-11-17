import { fileOpen } from 'browser-nativefs';
import FlowApp from './FlowApp';

// interface ProjectObject {
//   assets: [];
//   mainState: {};
// }
//
// type ProjectFile = JSZip;

export default class Project {
  constructor(public app: FlowApp) {}

  async open() {
    await this.openFileFromLocal();
    // from project file (need to unpack) or from project object in localstorage
    // this.openFileFromLocal
    // this.unpack
    // this.readCache
    // this.mount
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

  async buildFile() {
    // const projectArchive = new JSZip();
    // state.json + media assets
  }

  async openFileFromLocal() {
    const blob = await fileOpen({
      mimeTypes: ['image/*'],
    });
    console.log('!!! blob', blob);
    // https://web.dev/file-system-access/
    // https://www.npmjs.com/package/browser-nativefs
  }

  async saveFileToLocal() {
    // save File API established opened file or save new one on disk
    // await this.fileHandle.write
  }
}
