import * as PIXI from 'pixi.js';
import { fileOpen } from 'browser-nativefs';
import JSZip from 'jszip';
import FlowApp from './FlowApp';
import FilesIO from './FilesIO';
import Memo, { MemoSnapshot } from './Memo';
import { IAppDepositState } from '../StateManager';

export interface IProjectObject {
  fileName: string;
  data: string | ArrayBuffer;
  type: string;
}

export default class Project {
  constructor(public app: FlowApp) {}

  async open() {
    await this.importFromLocal();
    // from project file (need to unpack) or from project object in localstorage
    // this.openFileFromLocal
    // this.unpack
    // this.readCache
    // this.mount
  }

  pack(): Promise<Blob> {
    return new Promise(async (resolve) => {
      const projectArchive = new JSZip();
      projectArchive.file('application.json', this.app.stateManager.io.exportState());

      const memoSnapshotsPNG = await this.exportAllMemoSnapshotsPNG();
      // Save files into projectArchive
      memoSnapshotsPNG.forEach((memoSnapshot) => {
        // @ts-ignore
        projectArchive.file(`images/${memoSnapshot.id}.png`, memoSnapshot.data, {
          binary: true,
        });
      });

      projectArchive
        .generateAsync({
          type: 'blob',
          compression: 'STORE',
          // compression: 'DEFLATE', // no benefit for png
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

  async unpack(projectFile: Blob): Promise<IProjectObject[]> {
    // Zip open example: https://stuk.github.io/jszip/documentation/examples.html
    const zip = new JSZip();

    const asyncProjectFilesRead: Promise<IProjectObject>[] = [];

    const projectZip = await zip.loadAsync(projectFile);

    projectZip.forEach((relativePath, entry) => {
      // Handle application.json file
      if (entry.name === 'application.json') {
        // console.log('entry.name', entry.name);
        asyncProjectFilesRead.push(
          entry.async('string').then((appJsonStr) => ({
            fileName: 'application',
            data: appJsonStr,
            type: 'app',
          })),
        );
      }

      // PNG image
      if (entry.name.startsWith('images') && !entry.dir) {
        const fileName = entry.name.slice(7);
        // console.log('fileName', fileName);
        asyncProjectFilesRead.push(
          entry.async('arraybuffer').then((arrayBuffer) => ({
            fileName: fileName,
            data: arrayBuffer,
            type: 'png',
          })),
        );
      }
    });

    return await Promise.all(asyncProjectFilesRead);
  }

  async mount(unpackedProject: IProjectObject[]) {
    if (this.validateProject(unpackedProject)) {
      console.log('IMPORT unpackedProject VALIDATED', unpackedProject);

      this.app.engine.pauseEngine();
      this.app.board.resetBoard();

      // @ts-ignore -- ignore because we passed validation via validateProject
      const serializedAppState = unpackedProject.find((el) => el.fileName === 'application').data as string;
      const appDepositState: IAppDepositState = JSON.parse(serializedAppState);

      // Add project objects to board
      let n = 0;
      for (const obj of unpackedProject) {
        // PNG Objects
        if (obj.type === 'png' && obj.data instanceof ArrayBuffer && n < 99) {
          const imageBlob = new Blob([obj.data], { type: `image/png` });
          const imageElementRef = await FilesIO.saveImageToBlobStore(imageBlob);
          const pixiTexture = PIXI.Texture.from(imageElementRef as HTMLImageElement);

          // set memo id
          const memoId = obj.fileName.split('.')[0];
          const memo = new Memo(pixiTexture, this.app, memoId);
          this.app.board.addElementToBoard(memo);

          // attach element ref to state
          appDepositState.board[memoId].element = memo;

          // todo: we need to finalize this mount API with localstorage system
          //   1. Project: save .zip project to localstorage
          //   2. Assets: (what advantage? 1. lazy sync with server, 2. quick ready state to reopen)
          //   save blobs(most likely)/Base64/PIXI.Texture localForage(IndexedDB)
          //   3. viewport separate in localstorage?

          n += 1;

          //// 1. -------------- raw Uint8Array/Blob from PNG doesn't work right away ---------------
          // const b = new Uint8Array(obj.data);
          // const pixiTexture = PIXI.Texture.fromBuffer(b, w, h);
          // this.app.board.addElementToBoard(new Memo(pixiTexture, this.app)); // Error:
          // // "texImage2D: ArrayBufferView not big enough for request"

          //// 2. ------------ extractChunks approach causes same error as raw Uint8Array -----------------
          // // @ts-ignore
          // import extractChunks from 'png-chunks-extract';

          // let rgba = new Uint8Array();
          // const chunks = extractChunks(new Uint8Array(obj.data));
          //
          // for (let i = 0; i < chunks.length; i++) {
          //   if (chunks[i].name === 'IDAT') {
          //     const a = new Uint8Array(rgba);
          //     const b = new Uint8Array(chunks[i].data);
          //     rgba = new Uint8Array(a.length + b.length);
          //     rgba.set(a);
          //     rgba.set(b, a.length);
          //   }
          // }
          // const pixiTexture = PIXI.Texture.fromBuffer(rgba, w, h); // w & h previously were passed in application state
          // this.app.board.addElementToBoard(new Memo(pixiTexture, this.app)); // Error:
          // // "texImage2D: ArrayBufferView not big enough for request"
        }
      }

      this.app.stateManager.io.importState(appDepositState);
      this.app.engine.unpauseEngine();
    }
    console.log('Project doesnt seem to be valid');
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

  extractedSnapshots: number = 0;
  extractedSnapshotsTotal: number = 0;

  private async memoSnapshotsExtraction(memo: Memo) {
    const memoSnapshot = await memo.extractMemoSnapshot();
    const arraybuffer = await memoSnapshot.data.arrayBuffer();
    this.extractedSnapshots++;
    console.log(
      `[Export] ${this.extractedSnapshots} MemoImage extracted from ${this.extractedSnapshotsTotal}`,
    );
    return {
      id: memoSnapshot.id,
      data: arraybuffer,
    };
  }

  public async exportAllMemoSnapshotsPNG() {
    // TODO: this is temp "progress" tracking
    console.log(`[Export] image extraction started...`);

    const pngExtractionArr: Promise<MemoSnapshot>[] = [];

    const boardMemos = this.app.board.getAllMemos();
    this.extractedSnapshotsTotal = boardMemos.length;

    // @ts-ignore
    boardMemos.forEach((memo) => pngExtractionArr.push(this.memoSnapshotsExtraction(memo)));

    const fullPngCollection = await Promise.all(pngExtractionArr);

    console.log(`[Export] all images extracted`);

    this.extractedSnapshots = 0;
    this.extractedSnapshotsTotal = 0;

    // return fullPngCollection.reduce((acc, memoImage) => ({ ...acc, ...memoImage }), {});
    return fullPngCollection;
  }

  async importFromLocal() {
    const blob = await fileOpen({ mimeTypes: ['application/flow'] });
    const unpackedProject = await this.unpack(blob);

    await this.mount(unpackedProject);
  }

  validateProject(unpackedProject: IProjectObject[]) {
    const appStateObj = unpackedProject.find((el) => el.fileName === 'application');
    if (appStateObj && typeof appStateObj.data === 'string') {
      try {
        const appState = JSON.parse(appStateObj.data);
        // All project objects should be part of appState.board except 'application' file
        for (let i = 0; i < unpackedProject.length; i++) {
          const projObj = unpackedProject[i];
          if (projObj.fileName !== 'application' && !appState.board[projObj.fileName.split('.')[0]]) {
            console.log(
              'The file in project folder not found on project board.',
              projObj.fileName,
              appState.board,
            );
            return false;
          }
        }
      } catch (e) {
        console.log("Project doesn't contain parsable JSON state");
        return false;
      }
    } else {
      console.log("Project doesn't contain application file");
      return false;
    }
    return true;
  }

  // TODO: Cool workflow could be if we couldn't "export" project until we "saved" it into localstorage
  //  that would probably bloat localstorage but it also would allow "quick last open"
  async exportToLocal() {
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
