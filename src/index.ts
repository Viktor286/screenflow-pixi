import * as PIXI from 'pixi.js';
import './index.css';
import App from './interfaces/App';
import { PixiEngine } from './interfaces/PixiEngine';
import { urlSmallSet as imageSet } from './fixtures/imagesDataSet';
import Memo from './interfaces/Memo';
import FilesIO from './interfaces/FilesIO';
import { SpaceModifiers } from './modifiers/SpaceModifiers';

async function main() {
  const appDiv = document.querySelector('.app');
  if (appDiv instanceof HTMLElement) {
    const app = new App(new PixiEngine(appDiv, 1000, 800));

    /** Temp Test sample **/
    let rectangle = new PIXI.Graphics();
    rectangle.lineStyle(1.1, 0xff3300, 1);
    rectangle.drawRect(300, 300, 100, 100);
    app.engine.addToViewport(rectangle);

    /** Load test images **/
    const loader = await FilesIO.loadUrlSet(imageSet);

    const loadedSnapshots = Memo.createSnapShotsFromPixiResources(
      loader.resources,
    );

    SpaceModifiers.setPositionGrid(loadedSnapshots, 8, 240, 120, 0.1);

    app.addSnapshots(loadedSnapshots);

    // /** Auto update from store **/
    // app.state.snapshots.store.forEach((snapShot, i) => {
    //   snapShot.x = 0;
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
