// import React from 'react';
// import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import * as PIXI from 'pixi.js';
import { SnapShot, SnapShotLoader } from './interfaces/SnapShot';
import { Viewport } from 'pixi-viewport';
import { urlSmallSet } from './fixtures/imagesDataSet.ts';

const app = new PIXI.Application({
  width: 1200,
  height: 800,
  antialias: true,
  resolution: 1,
  transparent: true,
});

const appDiv = document.querySelector('.app');
if (appDiv) {
  appDiv.appendChild(app.view);

  const viewport = new Viewport({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    worldWidth: 1000,
    worldHeight: 1000,

    interaction: app.renderer.plugins.interaction, // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
  });

  // add the viewport to the stage
  app.stage.addChild(viewport);

  // activate plugins
  viewport.drag().pinch().wheel().decelerate();

  const loader = new PIXI.Loader();
  loader.add(urlSmallSet).on('progress', loadProgressHandler).load(setup);

  let rectangle = new PIXI.Graphics();
  rectangle.lineStyle(3, 0xff3300, 1);
  rectangle.drawRect(0, 0, 100, 100);
  viewport.addChild(rectangle);

  function loadProgressHandler(
    loader: PIXI.Loader,
    resource: PIXI.LoaderResource,
  ): void {
    console.log('loading: ' + resource.url);
    // console.log("progress: " + loader.progress + "%");
    //If you gave your files names as the first argument
    //of the `add` method, you can access them like this
    //console.log("loading: " + resource.name);
  }

  function setup(loader: PIXI.Loader) {
    const snapShots = new SnapShotLoader(loader.resources);
    snapShots.store.forEach((snapShot: SnapShot) => {
      viewport.addChild(snapShot.snapShot.sprite);
    });
  }
}
