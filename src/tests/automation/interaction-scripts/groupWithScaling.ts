/* global window */
import { wait } from '../../utils';
import Group from '../../../Interfaces/Group';

export async function basicGroupWithScaling() {
  const app = window.app;
  await wait(1000);

  const group = app.board.addBoardElement(new Group(app));
  const Memos = app.board.getMemos();

  app.actions.viewport.moveTo({ wX: 0, wY: 0 }, 0.2);
  await wait(500);

  app.actions.board.scaleTo(Memos[5].id, 0.1);

  await wait(500);
  const stepDelayFactor = 1;

  group.addToGroup(Memos[0]);
  group.addToGroup(Memos[3]);
  group.addToGroup(Memos[5]);
  group.addToGroup(Memos[9]);
  group.select();
  await wait(700 * stepDelayFactor);

  app.actions.viewport.fitToArea({ wX: group.centerX, wY: group.centerY }, group.width, group.height);
  group.removeFromGroup(Memos[0]);
  group.select();
  await wait(700 * stepDelayFactor);

  app.actions.board.scaleTo(group.id, 0.8);
  await wait(700 * stepDelayFactor);

  Memos[7].select();
  group.addToGroup(Memos[7]);
  group.select();

  await wait(700 * stepDelayFactor);

  group.removeFromGroup(Memos[3]);
  group.select();
  await wait(700 * stepDelayFactor);

  app.actions.board.scaleTo(group.id, 1.4);
  await wait(700 * stepDelayFactor);

  app.actions.board.moveTo(group.id, { wX: 100, wY: 100 });
  await wait(700 * stepDelayFactor);

  group.removeFromGroup(Memos[5]);
  group.select();
  group.addToGroup(Memos[2]);
  app.actions.viewport.moveTo({ wX: group.centerX, wY: group.centerY }, 0.45);
  await wait(700 * stepDelayFactor);

  group.removeFromGroup(Memos[0]);
  await wait(700 * stepDelayFactor);

  group.removeFromGroup(Memos[7]);
  await wait(700 * stepDelayFactor);

  group.removeFromGroup(Memos[9]);
}
