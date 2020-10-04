import FlowApp from '../Interfaces/FlowApp';
import ViewportActions from './Viewport';
import BoardActions from './Board';

export default class Actions {
  public readonly viewport: ViewportActions;
  public readonly board: BoardActions;
  constructor(public app: FlowApp) {
    this.viewport = new ViewportActions(app);
    this.board = new BoardActions(app);
  }
}
