import FlowApp from '../FlowApp';
import { reactInitializer } from './ReactWebUI';
import { Component } from 'react';

export default class WebUI {
  reactWebUI: Component;

  constructor(public app: FlowApp) {
    this.reactWebUI = reactInitializer(this.app);
  }

  updateZoomBtn() {
    this.reactWebUI.setState({
      zoomIndicator: this.app.viewport.getZoomString(),
    });
  }
}
