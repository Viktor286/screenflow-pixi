import * as PIXI from 'pixi.js';
import './index.css';
import FlowApp from './Interfaces/FlowApp';
import { getImageUrlSet } from './fixtures/imagesDataSet';
import FilesIO from './Interfaces/FilesIO';
import { SpaceModifiers } from './modifiers/SpaceModifiers';

async function main() {
  const appDiv = document.querySelector('.app');
  if (appDiv instanceof HTMLElement) {
    const app = new FlowApp(appDiv);

    /** Temp Test sample **/
    let rectangle = new PIXI.Graphics();
    rectangle.lineStyle(1.1, 0xff3300, 1);
    rectangle.drawRect(300, 300, 100, 100);
    app.viewport.addToViewport(rectangle);

    /** Load test images **/
    const loader = await FilesIO.loadUrlSet(getImageUrlSet(12));

    for (const resource of Object.values(loader.resources)) {
      app.board.addElement(resource.texture);
    }

    SpaceModifiers.setPositionGrid(app, 3, 400, 230, 0.2);

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
