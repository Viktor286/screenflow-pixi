import './index.css';
import * as PIXI from 'pixi.js';
import { SnapShot, SnapShotLoader } from './interfaces/SnapShot';
import { Viewport } from 'pixi-viewport';
import { urlLargeSet } from './fixtures/imagesDataSet';
import { SpaceModifiers } from "./interfaces/SpaceModifiers";

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

  let rectangle = new PIXI.Graphics();
  rectangle.lineStyle(1.1, 0xff3300, 1);
  rectangle.drawRect(300, 300, 100, 100);
  viewport.addChild(rectangle);

  viewport.on('zoomed', e => {
    const zoomLevel = e.viewport.transform.scale.x;
    // console.log('e.viewport', e.viewport);

    e.viewport.children.forEach(container => {
      if (container instanceof SnapShot && container.snapShot.selected) {
        container.drawSelection(zoomLevel);
      }
    })

    // This might be not 100% correct
    // const zoomCoords = {
    //   level: e.viewport.transform.scale.x,
    //   toPointX: e.viewport.transform.position.x,
    //   toPointY: e.viewport.transform.position.y,
    //   fromPointX: e.viewport.x,
    //   fromPointY: e.viewport.y,
    // };
    // console.log('e', e);
    // console.log('zoomCoords', zoomCoords);
  })

  // activate plugins
  viewport.drag().pinch().wheel().decelerate();

  const loader = new PIXI.Loader();
  loader.add(urlLargeSet).on('progress', loadProgressHandler).load(setup);

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
    SpaceModifiers.positionGrid(snapShots.store, 8, 230, 120);

    snapShots.store.forEach((s, i) => {
      s.scale = new PIXI.Point(.1, .1);
    });

    snapShots.store.forEach((snapShot: SnapShot) => {
      viewport.addChild(snapShot);
    });
  }
}
