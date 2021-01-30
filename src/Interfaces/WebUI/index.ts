import FlowApp from '../FlowApp';
import { reactInitializer } from './ReactWebUI';
import { Component } from 'react';
import { ShiftModeState } from '../Board';
import AssetConversion from '../AssetConversion';

export interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
  currentTarget: HTMLInputElement & EventTarget;
}

export default class WebUI {
  reactWebUI: Component = reactInitializer(this.app);

  constructor(public app: FlowApp) {
    this.setupGlobalDragImage();
    this.setupGlobalPasteImage();
  }

  public updateZoomBtn() {
    this.reactWebUI.setState({
      zoomIndicator: this.app.viewport.getZoomString(),
    });
  }

  public updateSelectedMode() {
    this.reactWebUI.setState({
      isMemoSelected: !!this.app.board.selectedBoardElement,
    });
  }

  public updateShiftMode(state: ShiftModeState) {
    this.reactWebUI.setState({
      isShiftActive: state !== 'off',
    });
  }

  // TODO: refactor this into setupGlobalDragEvent
  public setupGlobalDragImage() {
    const handler = (event: DragEvent) => event.preventDefault();
    window.addEventListener('dragenter', handler, false);
    window.addEventListener('dragleave', handler, false);
    window.addEventListener('dragover', handler, false);
    window.addEventListener('drop', async (event: DragEvent) => {
      event.preventDefault();
      const imageBlobs = await AssetConversion.getBlobsFromDropEvent(event);
      const imageElements = await AssetConversion.getHTMLImageElementsFromBlobs(imageBlobs);
      const textures = await AssetConversion.getPixiTexturesFromImages(imageElements);
      this.app.board.addNewMemosToBoardFromTextures(textures);
    });
  }

  // TODO: refactor this into setupGlobalPasteEvent
  public setupGlobalPasteImage() {
    // @ts-ignore
    window.addEventListener('paste', async (pasteEvent: ClipboardEvent) => {
      const imageBlobs = await AssetConversion.getBlobsFromClipboardEvent(pasteEvent);
      const imageElements = await AssetConversion.getHTMLImageElementsFromBlobs(imageBlobs);
      const textures = await AssetConversion.getPixiTexturesFromImages(imageElements);
      this.app.board.addNewMemosToBoardFromTextures(textures);
    });
  }

  public selectImageToUpload() {
    const input = window.document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('name', 'myFiles');
    input.setAttribute('multiple', 'true');
    input.setAttribute('accept', 'image/*');
    input.setAttribute('style', 'display:none');
    // @ts-ignore
    input.addEventListener('change', async (event: HTMLInputEvent) => {
      if (event.currentTarget.files && event.currentTarget.files.length > 0) {
        const imageBlobs = await AssetConversion.getBlobsFromInputEvent(event);
        const imageElements = await AssetConversion.getHTMLImageElementsFromBlobs(imageBlobs);
        const textures = await AssetConversion.getPixiTexturesFromImages(imageElements);
        this.app.board.addNewMemosToBoardFromTextures(textures);
      }
      window.document.body.removeChild(input);
    });

    window.document.body.appendChild(input);
    input.click();
  }
}
