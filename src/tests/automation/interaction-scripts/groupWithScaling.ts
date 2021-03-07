/* global window */
import { wait } from '../../utils';

export async function basicGroupWithScaling() {
  const app = window.app;
  await wait(1000);

  const Memos = app.board.getAllMemos();

  app.stateManager.actions.viewport.moveTo({ wX: 0, wY: 0 }, 0.2);
  await wait(500);

  app.stateManager.actions.board.scaleElementById(Memos[5].id, 0.1);

  await wait(500);
  const stepDelayFactor = 1;

  app.stateManager.actions.board.setShiftModeState('lock');
  app.stateManager.actions.board.selectElement(Memos[0]);
  app.stateManager.actions.board.selectElement(Memos[3]);
  app.stateManager.actions.board.selectElement(Memos[5]);
  app.stateManager.actions.board.selectElement(Memos[9]);
  await wait(700 * stepDelayFactor);

  app.stateManager.actions.viewport.fitToBoard();
  await wait(700 * stepDelayFactor);

  const selected = app.board.selection.getSelectedElement();
  if (selected) app.stateManager.actions.board.scaleElementById(selected.id, 0.8);
  await wait(700 * stepDelayFactor);

  app.stateManager.actions.board.selectElement(Memos[0]);
  await wait(700 * stepDelayFactor);

  app.stateManager.actions.board.selectElement(Memos[7]);
  await wait(700 * stepDelayFactor);

  if (selected) app.stateManager.actions.board.scaleElementById(selected.id, 1.4);
  await wait(700 * stepDelayFactor);

  if (selected) app.stateManager.actions.board.moveElementById(selected.id, { wX: 100, wY: 100 });
  await wait(700 * stepDelayFactor);

  app.stateManager.actions.board.selectElement(Memos[5]);
  app.stateManager.actions.board.selectElement(Memos[2]);
  if (selected)
    app.stateManager.actions.viewport.moveTo({ wX: selected.centerX, wY: selected.centerY }, 0.45);
  await wait(700 * stepDelayFactor);

  app.stateManager.actions.board.selectElement(Memos[7]);
  await wait(700 * stepDelayFactor);

  app.stateManager.actions.board.selectElement(Memos[9]);
  await wait(700 * stepDelayFactor);

  app.stateManager.actions.board.selectElement(Memos[3]);
  app.stateManager.actions.board.setShiftModeState('off');
}
