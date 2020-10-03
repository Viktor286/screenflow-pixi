import * as PIXI from 'pixi.js';
import './index.css';
import FlowApp from './Interfaces/FlowApp';
import { getImageUrlSet } from './fixtures/imagesDataSet';
import FilesIO from './Interfaces/FilesIO';
import { SpaceModifiers } from './modifiers/SpaceModifiers';
import Memo from './Interfaces/Memo';
import Group, { IExplodedGroup } from './Interfaces/Group';
import { BoardElementContainer } from './Interfaces/BoardElement';

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
      app.board.addBoardElement(new Memo(resource.texture, app));
    }

    SpaceModifiers.setPositionGrid(app, 3, 400, 230, 0.2);

    const group = app.board.addBoardElement(new Group(app));
    console.log('group', group);

    const displayObject = app.viewport.instance.children.filter(
      (el) => el instanceof BoardElementContainer && el.boardElement instanceof Memo,
    ) as BoardElementContainer[];

    const Memos = displayObject.map((container) => container.boardElement);

    let groupMembers: IExplodedGroup;

    setTimeout(() => {
      Memos[0].scale = 0.2;
      Memos[3].scale = 0.22;
      Memos[5].scale = 0.24;

      group.implodeGroup({ boardElements: [Memos[0], Memos[3], Memos[5]], initialScale: 0.1 });
      // group.scale = 0.5;
    }, 2000);
    setTimeout(() => {
      // group.x = -1000;
      // group.y = -1000;
      // group.scale = 0.5;
      groupMembers = group.explodeGroup();
    }, 3000);
    // setTimeout(() => group.addToGroup(Memos[4]), 4000);
    setTimeout(() => {
      group.implodeGroup(groupMembers);
      // console.log('GMemo', Memos[0]);
      // console.log('GMemo before x move', Memos[0].x);
      // Memos[0].x = -15;
      // console.log('GMemo after x move', Memos[0].x);
    }, 5000);
    //
    setTimeout(() => {
      // group.scale = 0.5;
      group.explodeGroup();
    }, 6000);

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
