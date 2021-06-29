import FlowApp from '../FlowApp';
// import FocusPoint from './FocusPoint';
import StageBackTile from './StageBackTile';

export default class GUI {
  // public focusPoint = new FocusPoint(this.app);
  public stageBackTile = new StageBackTile(this.app);

  constructor(public app: FlowApp) {}
}
