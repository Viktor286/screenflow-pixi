import FlowApp from '../FlowApp';
import FocusPoint from './FocusPoint';
import StageBackTile from './StageBackTile';

export default class GUI {
  focusPoint: FocusPoint;
  stageBackTile: StageBackTile;

  constructor(public app: FlowApp) {
    this.focusPoint = new FocusPoint(this.app);
    this.stageBackTile = new StageBackTile(this.app);
  }
}
