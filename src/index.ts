import './index.css';
import FlowApp from './Interfaces/FlowApp';
import { getImageUrlSet } from './fixtures/imagesDataSet';
import FilesIO from './Interfaces/FilesIO';
import { SpaceModifiers } from './Modifiers/SpaceModifiers';
import Memo from './Interfaces/Memo';
import { basicGroupWithScaling } from './tests/automation/interaction-scripts/groupWithScaling';

async function main() {
  const appDiv = document.querySelector('.app');
  if (appDiv instanceof HTMLElement) {
    const app = new FlowApp(appDiv);

    /** Load test images **/
    const loader = await FilesIO.loadUrlSet(getImageUrlSet(12));

    for (const resource of Object.values(loader.resources)) {
      app.board.addElementToBoard(new Memo(resource.texture, app));
    }

    /** Load test Layout **/
    SpaceModifiers.setPositionGrid(app, 3, 400, 230, 0.2);
  }
}

main().then(async () => {
  /** Launch test action script **/
  await basicGroupWithScaling();
});
