import './index.css';
import { PixiEngine } from './interfaces/PixiEngine';
import { PixiLoader } from './interfaces/PixiLoader';
import { urlSmallSet as imageSet } from './fixtures/imagesDataSet';

const appDiv = document.querySelector('.app');
if (appDiv instanceof HTMLElement) {
  const pixiApp = new PixiEngine(appDiv, 1000, 800);
  const pixiLoader = new PixiLoader(pixiApp.viewport);
  pixiLoader.loadUrlSet(imageSet);
  console.log(pixiApp);

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
