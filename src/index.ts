import './index.css';
import FlowApp from './Interfaces/FlowApp';
// import BoardElement from './Interfaces/BoardElement';
// import { getImageUrlSet } from './fixtures/imagesDataSet';
// import { SpaceModifiers } from './Modifiers/SpaceModifiers';
// import Memo from './Interfaces/Memo';
// import { basicGroupWithScaling } from './tests/automation/interaction-scripts/groupWithScaling';

async function main() {
  const appDiv = document.querySelector('.app');
  if (appDiv instanceof HTMLElement) {
    const app = new FlowApp(appDiv);

    // /** Load test images **/
    // getImageUrlSet(3).forEach((imageUrl) => {
    //   app.board.addElementToBoard(new Memo(app.board, undefined, { mediaSource: imageUrl }));
    // });
    //
    // /** Load test Layout **/
    // SpaceModifiers.setPositionGrid(app, 3, 400, 230, 0.2);

    // const boardElement = new BoardElement(app.board);
    // const boardElement = app.board.createBoardElement();
    // boardElement.drawSelection();
    // app.board.addElementToBoard(boardElement);
    // console.log('boardElement', boardElement);
    console.log('app', app);
  }
}

main().then(async () => {
  /** Launch test action script **/
  // await basicGroupWithScaling();
});
