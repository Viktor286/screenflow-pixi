import FlowApp from '../Interfaces/FlowApp';
import ViewportActions from './Viewport';
import MemoActions from './Memos';

export default class Actions {
  public readonly viewport: ViewportActions;
  public readonly memos: MemoActions;
  constructor(public app: FlowApp) {
    this.viewport = new ViewportActions(app);
    this.memos = new MemoActions(app);
  }
}
