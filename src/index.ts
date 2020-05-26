// import * as PIXI from 'pixi.js';
import './index.css';
import App from './interfaces/App';
import { PixiEngine } from './interfaces/PixiEngine';
import { urlSmallSet as imageSet } from './fixtures/imagesDataSet';
import { SnapShotContainer } from './interfaces/SnapShot';
import { SpaceModifiers } from './interfaces/SpaceModifiers';

async function main() {
  const appDiv = document.querySelector('.app');
  if (appDiv instanceof HTMLElement) {
    const app = new App(new PixiEngine(appDiv, 1000, 800));

    const loader = await PixiEngine.loadUrlSet(imageSet);

    app.state.snapshots.store = SnapShotContainer.createSnapShotsFromPixiResources(
      loader.resources,
    );

    /** TODO: change modifier interface to matrix output (prev, next states for animation) **/
    SpaceModifiers.transformPositionGrid(
      app.state.snapshots.store,
      8,
      240,
      120,
      0.1,
    );

    // Objects viewport initialization
    app.state.snapshots.store.forEach((snapShot, i, store) => {
      app.engine.pixiViewport.addChild(snapShot);
    });

    // app.state.snapshots.store.forEach((snapShot, i) => {
    // snapShot.x = 0;
    // });

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
