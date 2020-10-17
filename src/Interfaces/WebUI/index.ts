import FlowApp from '../FlowApp';
import { reactInitializer } from './ReactWebUI';
import { Component } from 'react';
import { ShiftModeState } from '../InteractionEvents/Keyboard';

export default class WebUI {
  reactWebUI: Component = reactInitializer(this.app);

  constructor(public app: FlowApp) {}

  public updateZoomBtn() {
    this.reactWebUI.setState({
      zoomIndicator: this.app.viewport.getZoomString(),
    });
  }

  public updateSelectedMode() {
    this.reactWebUI.setState({
      isMemoSelected: !!this.app.board.selection,
    });
  }

  public updateShiftMode(state: ShiftModeState) {
    this.reactWebUI.setState({
      isShiftActive: state !== 'off',
    });
  }
}
