import './index.css';
// import * as PIXI from 'pixi.js';
import App from './interfaces/App';
import { PixiEngine } from './interfaces/PixiEngine';
import { PixiLoader } from './interfaces/PixiLoader';
import { urlSmallSet as imageSet } from './fixtures/imagesDataSet';
import { SpaceModifiers } from './interfaces/SpaceModifiers';

const appDiv = document.querySelector('.app');
if (appDiv instanceof HTMLElement) {
  const app = new App(new PixiEngine(appDiv, 1000, 800));

  const pixiLoader = new PixiLoader(app);
  pixiLoader.loadUrlSet(imageSet);

  /** Temp Test modifiers **/
  SpaceModifiers.transformPositionGrid(app.state.snapshots.store, 8, 230, 120);

  console.log(app);

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
