/* global window */
import { wait } from '../../utils';
import Group from '../../../Interfaces/Group';

export async function basicGroupWithScaling() {
  const app = window.app;
  await wait(1000);

  const group = app.board.addElementToBoard(new Group(app));
  const Memos = app.board.getMemos();

  app.actions.viewport.moveTo({ wX: 0, wY: 0 }, 0.2);
  await wait(500);

  app.actions.board.scaleElementById(Memos[5].id, 0.1);

  await wait(500);
  const stepDelayFactor = 1;

  group.addToGroup(Memos[0]);
  group.addToGroup(Memos[3]);
  group.addToGroup(Memos[5]);
  group.addToGroup(Memos[9]);
  app.board.selectElement(group);
  await wait(700 * stepDelayFactor);

  app.actions.viewport.fitToBoard();
  group.removeFromGroup(Memos[0]);
  app.board.selectElement(group);
  await wait(700 * stepDelayFactor);

  app.actions.board.scaleElementById(group.id, 0.8);
  await wait(700 * stepDelayFactor);

  app.board.selectElement(Memos[7]);
  group.addToGroup(Memos[7]);
  app.board.selectElement(group);

  await wait(700 * stepDelayFactor);

  group.removeFromGroup(Memos[3]);
  app.board.selectElement(group);
  await wait(700 * stepDelayFactor);

  app.actions.board.scaleElementById(group.id, 1.4);
  await wait(700 * stepDelayFactor);

  app.actions.board.moveElementById(group.id, { wX: 100, wY: 100 });
  await wait(700 * stepDelayFactor);

  group.removeFromGroup(Memos[5]);
  app.board.selectElement(group);
  group.addToGroup(Memos[2]);
  app.actions.viewport.moveTo({ wX: group.centerX, wY: group.centerY }, 0.45);
  await wait(700 * stepDelayFactor);

  group.removeFromGroup(Memos[0]);
  await wait(700 * stepDelayFactor);

  group.removeFromGroup(Memos[7]);
  await wait(700 * stepDelayFactor);

  group.removeFromGroup(Memos[9]);
}
