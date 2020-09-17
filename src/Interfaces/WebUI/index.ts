import FlowApp from '../FlowApp';
import ReactWebUI from './react';
import ReactDOM from 'react-dom';
import React from 'react';

export default class WebUI {
  constructor(public app: FlowApp) {
    ReactDOM.render(
      React.createElement(ReactWebUI, { app: this.app }, null),
      document.getElementById('web-ui'),
    );
  }

  updateZoomBtn() {
    // this.zoomIndicator.innerHTML = this.app.viewport.getZoomString();
    // return this.zoomIndicator;
  }
}
