import './index.css';
// import * as PIXI from 'pixi.js';
import App from './interfaces/App';
import { PixiEngine } from './interfaces/PixiEngine';
import { PixiLoader } from './interfaces/PixiLoader';
import { urlSmallSet as imageSet } from './fixtures/imagesDataSet';
import { SnapShotLoader } from './interfaces/SnapShot';
import { SpaceModifiers } from './interfaces/SpaceModifiers';

async function main() {
  const appDiv = document.querySelector('.app');
  if (appDiv instanceof HTMLElement) {
    const app = new App(new PixiEngine(appDiv, 1000, 800));

    /** TODO: merge this class with FileIO **/
    const loader = await PixiLoader.loadUrlSet(imageSet);

    /** TODO: refactor SnapShotLoader to work with store **/
    const snapShots = new SnapShotLoader(loader.resources);
    app.state.snapshots.store = snapShots.store;

    // Set initial transforms
    snapShots.store.forEach((snapShot, i) => {
      /** TODO: change modifier interface to matrix output **/
      SpaceModifiers.transformPositionGrid(snapShots.store, 8, 240, 120, 0.1);
      app.engine.pixiViewport.addChild(snapShot);
    });

    snapShots.store.forEach((snapShot, i) => {
      // snapShot.x = 0;
    });

    // viewport.on('zoomed', (e) => {
    //   const zoomLevel = e.viewport.transform.scale.x;
    //   // console.log('e.viewport', e.viewport);
    //
    //   e.viewport.children.forEach((container) => {
    //     if (
    //       container instanceof SnapShotContainer &&
    //       container.snapShot.selected
    //     ) {
    //       container.snapShot.drawSelection(zoomLevel);
    //     }
    //   });
    //
    //   // This might be not 100% correct
    //   // const zoomCoords = {
    //   //   level: e.viewport.transform.scale.x,
    //   //   toPointX: e.viewport.transform.position.x,
    //   //   toPointY: e.viewport.transform.position.y,
    //   //   fromPointX: e.viewport.x,
    //   //   fromPointY: e.viewport.y,
    //   // };
    //   // console.log('e', e);
    //   // console.log('zoomCoords', zoomCoords);
    // });

    // activate plugins
  }
}

main();
