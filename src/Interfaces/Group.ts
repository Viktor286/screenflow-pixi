import * as PIXI from 'pixi.js';
import FlowApp from './FlowApp';
import BoardElement from './BoardElement';

export default class Group extends BoardElement {
  [key: string]: any;
  private groupDrawing = new PIXI.Graphics();

  constructor(public app: FlowApp) {
    super(app);
    this.container.addChild(this.groupDrawing);

    // TODO: start from here and how width/height works in Memo
    // width	Implemented in Container. Scaling. The width property calculates scale.x by dividing the "requested" width by the local bounding box width. It is indirectly an abstraction over scale.x, and there is no concept of user-defined width.
    // height	Implemented in Container. Scaling. The height property calculates scale.y by dividing the "requested" height by the local bounding box height. It is indirectly an abstraction over scale.y, and there is no concept of user-defined height.
    // https://pixijs.download/dev/docs/PIXI.DisplayObject.html

    // First, remember that in pixi, width and height are just another way of expressing scale.
    // Second, a containers width and height are expressed by the bounds of its children, but express no dimensions themselves.
    // https://github.com/pixijs/pixi.js/issues/4990#issuecomment-401556950

    // this.width = 500;
    // this.height = 500;

    console.log('this.width', this.width);
    this.container.interactive = true;

    setTimeout(() => {
      this.drawGroupBorder();
      console.log('this.width 2', this.width);
    }, 2000);
  }

  public addToGroup(boardElement: BoardElement) {
    this.container.addChild(boardElement.container);
  }

  public drawGroupBorder(): void {
    this.groupDrawing.clear().lineStyle(1, 0xe3d891).drawRect(0, 0, 400, 400);
  }
}
