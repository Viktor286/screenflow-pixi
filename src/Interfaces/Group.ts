import * as PIXI from 'pixi.js';
import FlowApp from './FlowApp';
import BoardElement, { BoardElementContainer } from './BoardElement';

export interface IExplodedGroup {
  boardElements: BoardElement[];
  initialScale: number;
}

export default class Group extends BoardElement {
  [key: string]: any;
  private groupDrawing = new PIXI.Graphics();

  leftMostChild: BoardElementContainer | undefined;

  constructor(public app: FlowApp) {
    super(app);

    this.container.interactive = true;
    this.groupDrawing.zIndex = 1;
    this.container.addChild(this.groupDrawing);

    // PIXI.DisplayObjectContainer

    // If an object has no interactive children use interactiveChildren = false
    // the interaction manager will then be able to avoid crawling through the object.

    // Set this.container.hitArea = new PIXI.Rectangle(x,y,w,h). As above should stop the interaction manager from crawling through the object.
    // https://github.com/pixijs/pixi.js/wiki/v4-Performance-Tips
  }

  public selectGroup() {
    this.app.board.addElementToSelected(this);
    this.selected = true;

    this.container.children.forEach((elm) => {
      if (elm instanceof BoardElementContainer) {
        elm.boardElement.drawSelection();
      }
    });

    this.drawGroupBorder();
  }

  public explodeGroup(): IExplodedGroup {
    const initialScale = this.scale;
    const fScale = 1 / initialScale;

    const elementMap = new Map<BoardElementContainer, PIXI.Point>();
    const boardElements: BoardElement[] = [];

    this.container.children.forEach((elm) => {
      if (elm instanceof BoardElementContainer) {
        elementMap.set(elm, elm.toGlobal(this.app.viewport.instance.position));
      }
    });

    elementMap.forEach((coords, elm) => {
      elm.boardElement.inGroup = undefined;
      this.app.viewport.instance.addChild(elm);
      elm.x = coords.x;
      elm.y = coords.y;
      elm.boardElement.scale = elm.boardElement.scale / fScale;
      boardElements.push(elm.boardElement);
    });

    this.container.removeChildren();
    this.container.destroy();

    return { boardElements, initialScale };
  }

  public implodeGroup({ boardElements, initialScale = 1 }: IExplodedGroup) {
    this.container = new BoardElementContainer(this);
    this.container.interactive = true;
    this.groupDrawing.zIndex = 1;
    this.container.addChild(this.groupDrawing);

    this.app.board.addBoardElement(this);

    // Calculate group transforms
    const fScale = 1 / initialScale;

    boardElements.forEach((boardElement) => {
      // Apply scale modifications before adding children to container
      boardElement.x *= fScale;
      boardElement.y *= fScale;
      boardElement.scale *= fScale;

      this.container.addChildAt(boardElement.container, 0);
      boardElement.inGroup = this;
    });

    // After all children are ready, calc group transforms
    // Find leftMostX and leftMostY point, which will be group's new position
    let leftMostX = Infinity;
    let leftMostY = Infinity;
    this.container.children.forEach((elm) => {
      if (elm instanceof BoardElementContainer) {
        if (elm.x < leftMostX) leftMostX = elm.x;
        if (elm.y < leftMostY) leftMostY = elm.y;
      }
    });

    // Set group's new position. Bring back original position of mostLeft child
    this.x = leftMostX / fScale;
    this.y = leftMostY / fScale;

    // Shift children to their prev position
    this.container.children.forEach((elm) => {
      if (elm instanceof BoardElementContainer) {
        elm.x = elm.x - leftMostX;
        elm.y = elm.y - leftMostY;
      }
    });

    // Draw border before scale
    this.drawGroupBorder(initialScale);

    // Apply needed group scale
    this.scale = initialScale;
    // this.container.cacheAsBitmap = true;
  }

  public drawGroupBorder(scale = 1): void {
    console.log('this.scale', this.scale);
    this.groupDrawing
      .clear()
      .lineStyle(1 / scale, 0xe3d891)
      .drawRect(0, 0, this.width, this.height);
  }
}
