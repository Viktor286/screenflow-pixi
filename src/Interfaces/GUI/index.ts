import FlowApp from '../FlowApp';
import FocusPoint from './FocusPoint';

export default class Index {
  focusPoint: FocusPoint;

  constructor(public app: FlowApp) {
    this.focusPoint = new FocusPoint(this.app);
  }
}
