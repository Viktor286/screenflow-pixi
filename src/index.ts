import * as PIXI from 'pixi.js';
import './index.css';
import FlowApp from './Interfaces/FlowApp';
import { getImageUrlSet } from './fixtures/imagesDataSet';
import FilesIO from './Interfaces/FilesIO';
import { SpaceModifiers } from './modifiers/SpaceModifiers';
import Memo from './Interfaces/Memo';
import { basicGroupWithScaling } from './tests/automation/interaction-scripts/groupWithScaling';

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

    /** Load test Layout **/
    SpaceModifiers.setPositionGrid(app, 3, 400, 230, 0.2);
  }
}

main().then(async () => {
  /** Launch test action script **/
  await basicGroupWithScaling();
});
