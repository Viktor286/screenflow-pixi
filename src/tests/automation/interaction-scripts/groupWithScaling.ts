/* global window */
import { wait } from '../../utils';
import Group from '../../../Interfaces/Group';

export async function basicScaling() {
  const app = window.app;
  await wait(1000);

  // app.actions.viewport.moveTo({ wX: 0, wY: 0 }, 0.2);
  await wait(500);

  const group = app.board.addBoardElement(new Group(app));
  const Memos = app.board.getMemos();

  const stepDelayFactor = 2;

  group.addToGroup(Memos[0]);
  group.addToGroup(Memos[3]);
  group.addToGroup(Memos[5]);
  // group.removeFromGroup(Memos[0]);

  group.select();
  app.actions.board.scaleTo(group.id, 0.8);
  // group.scale = 0.8;
  await wait(700 * stepDelayFactor);

  // Memos[7].select();
  group.explodeGroup();
  // group.addToGroup(Memos[7]);
  // group.select();
  // await wait(500 * stepDelayFactor);

  // group.select();
  // app.actions.board.scaleTo(group.id, 1.2);
  // await wait(700 * stepDelayFactor);
  //
  // group.removeFromGroup(Memos[5]);
  // Memos[5].select();
}

export async function basicGroupWithScaling() {
  const app = window.app;
  await wait(1000);

  app.actions.viewport.moveTo({ wX: 0, wY: 0 }, 0.2);
  await wait(500);

  const group = app.board.addBoardElement(new Group(app));
  const Memos = app.board.getMemos();

  app.actions.board.moveTo(Memos[0].id, { wX: Memos[0].x + 30, wY: Memos[0].x + 30 });
  app.actions.board.scaleTo(Memos[0].id, 0.15);
  app.actions.board.scaleTo(Memos[3].id, 0.25);
  app.actions.board.scaleTo(Memos[5].id, 0.1);
  await wait(1000);

  const stepDelayFactor = 2;

  Memos[0].select();
  group.addToGroup(Memos[0]);
  await wait(500 * stepDelayFactor);

  group.select();
  await wait(500 * stepDelayFactor);

  Memos[3].select();
  group.addToGroup(Memos[3]);
  await wait(500 * stepDelayFactor);

  group.select();
  await wait(500 * stepDelayFactor);

  Memos[5].select();
  group.addToGroup(Memos[5]);
  await wait(500 * stepDelayFactor);

  group.select();
  await wait(500 * stepDelayFactor);

  Memos[0].select();
  group.removeFromGroup(Memos[0]);
  await wait(500 * stepDelayFactor);

  Memos[0].select();
  await wait(500 * stepDelayFactor);

  group.select();
  app.actions.board.scaleTo(group.id, 0.8);
  await wait(700 * stepDelayFactor);

  Memos[7].select();
  group.addToGroup(Memos[7]);
  await wait(500 * stepDelayFactor);

  group.select();
  app.actions.board.scaleTo(group.id, 1.2);
  await wait(700 * stepDelayFactor);

  group.removeFromGroup(Memos[5]);
  Memos[5].select();
}
