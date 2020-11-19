import * as PIXI from 'pixi.js';
import { HTMLInputEvent } from './WebUI';

export default class AssetConversion {
  static getBufferFromFileReader(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = (e) => {
        if (e.target) {
          resolve(e.target.result as ArrayBuffer);
        } else {
          reject();
        }
      };
      fr.onerror = reject;
      fr.readAsArrayBuffer(file);
    });
  }

  // Note: unfortunately, in most cases we need to convert the image file data
  // into HTMLImageElement to get width and height.
  public static getHTMLImageElementsFromBlobs(imageBlobs?: Blob[]): Promise<HTMLImageElement[]> | undefined {
    if (imageBlobs && imageBlobs.length > 0) {
      return Promise.all(imageBlobs.map((blob) => AssetConversion.getHTMLImageElementFromBlob(blob)));
    }
    return undefined;
  }

  public static getHTMLImageElementFromBlob(blob: Blob): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
      const imageObjectURL = window.URL.createObjectURL(blob);
      const imageElement = new Image();
      imageElement.setAttribute('src', imageObjectURL);
      imageElement.onload = () => {
        URL.revokeObjectURL(imageObjectURL);
        resolve(imageElement);
      };
    });
  }

  public static getPixiTexturesFromImages(images?: HTMLImageElement[]): PIXI.Texture[] | undefined {
    if (images && images.length > 0) {
      return images.map((image) => PIXI.Texture.from(image));
    }
    return undefined;
  }

  public static async getBlobsFromInputEvent(inputEvent: HTMLInputEvent): Promise<Blob[] | undefined> {
    if (!inputEvent.currentTarget) return undefined;
    const inputFiles = inputEvent.currentTarget.files;
    const imageBuffers = await AssetConversion.getImageBuffersFromFileList(inputFiles);
    if (imageBuffers) {
      return imageBuffers.map((buffer) => new Blob([buffer], { type: 'image/png' }));
    }
    return undefined;
  }

  public static async getBlobsFromClipboardEvent(
    clipboardEvent: ClipboardEvent,
  ): Promise<Blob[] | undefined> {
    if (!clipboardEvent.clipboardData) return undefined;
    const clipboardDataItems = clipboardEvent.clipboardData.items;
    const imageBuffers = await AssetConversion.getImageBuffersFromDataTransfer(clipboardDataItems);
    if (imageBuffers) {
      return imageBuffers.map((buffer) => new Blob([buffer], { type: 'image/png' }));
    }
    return undefined;
  }

  static async getBlobsFromDropEvent(dragEvent: DragEvent) {
    if (!dragEvent.dataTransfer) return undefined;
    const dropDataItems = dragEvent.dataTransfer.items;
    const imageBuffers = await AssetConversion.getImageBuffersFromDataTransfer(dropDataItems);
    if (imageBuffers) {
      return imageBuffers.map((buffer) => new Blob([buffer], { type: 'image/png' }));
    }
    return undefined;
  }

  static async getImageBuffersFromFileList(fileList: FileList | null): Promise<ArrayBuffer[]> {
    if (fileList instanceof FileList && fileList.length > 0) {
      const filesBuffers = [];
      for (let i = 0; i < fileList.length; i++) {
        const fileItem = fileList[i];
        if (!fileItem.type.startsWith('image')) continue;
        const imageFileBuffer = await AssetConversion.getBufferFromFileReader(fileItem);
        if (imageFileBuffer && imageFileBuffer.byteLength > 0) {
          filesBuffers.push(imageFileBuffer);
        }
      }
      return Promise.all(filesBuffers);
    }
    return Promise.resolve([]);
  }

  static getImageBuffersFromDataTransfer(
    dataTransferItemList: DataTransferItemList,
  ): Promise<ArrayBuffer[]> | undefined {
    // In case of "dragged files" or "files from buffer"
    // "clipboardData.items" will be "DataTransferItemList"
    // looks like we can't see items of the list in console, the length will be 0
    // https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItemList
    if (dataTransferItemList instanceof DataTransferItemList && dataTransferItemList.length > 0) {
      const filesBuffers = [];
      for (let i = 0; i < dataTransferItemList.length; i++) {
        const dataTransferItem = dataTransferItemList[i];
        // https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItem
        if (!dataTransferItem.type.startsWith('image')) continue;
        // File can also be represent as: stream, text, arrayBuffer (last two via stream reading)
        const imageFile = dataTransferItem.getAsFile();
        if (imageFile && imageFile.size > 0) {
          // Convert file to blob to have exactly same
          // blob hashes in Blob URL Store and app reference
          filesBuffers.push(imageFile.arrayBuffer());
        }
      }
      return Promise.all(filesBuffers);
    }
    return undefined;
  }
}
