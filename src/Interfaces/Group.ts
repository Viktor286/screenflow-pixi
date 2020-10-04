import * as PIXI from 'pixi.js';
import FlowApp from './FlowApp';
import BoardElement, { BoardElementContainer } from './BoardElement';
import { ITransforms } from '../types/global';

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

    this.container = new BoardElementContainer(this);
    this.container.zIndex = 1;
    this.container.interactive = true;
    this.container.sortableChildren = true;

    this.groupDrawing.zIndex = 2;
    this.container.addChild(this.groupDrawing);

    this.app.board.addBoardElement(this);

    // PIXI.DisplayObjectContainer

    // If an object has no interactive children use interactiveChildren = false
    // the interaction manager will then be able to avoid crawling through the object.

    // TODO: try this optimization
    // Set this.container.hitArea = new PIXI.Rectangle(x,y,w,h).
    // As above should stop the interaction manager from crawling through the object.
    // https://github.com/pixijs/pixi.js/wiki/v4-Performance-Tips
  }

  public select() {
    this.app.board.addElementToSelected(this);
    this.selected = true;

    this.drawSelection();

    this.container.children.forEach((elm) => {
      if (elm instanceof BoardElementContainer) {
        this.selected = true;
      }
    });
  }

  public deselect() {
    this.app.board.removeElementFromSelected(this);
    this.selected = false;

    this.eraseSelection();

    this.container.children.forEach((elm) => {
      if (elm instanceof BoardElementContainer) {
        this.selected = false;
      }
    });
  }

  public drawSelection(): void {
    this.container.children.forEach((elm) => {
      if (elm instanceof BoardElementContainer) {
        elm.boardElement.drawSelection();
      }
    });

    const lineWidth = 2 / this.app.viewport.scale / this.scale;

    this.groupDrawing
      .clear()
      .lineStyle(lineWidth, 0xe3d891)
      .drawRect(0, 0, this.width / this.scale - lineWidth, this.height / this.scale - lineWidth);
  }

  public eraseSelection() {
    this.groupDrawing.clear();

    this.container.children.forEach((elm) => {
      if (elm instanceof BoardElementContainer) {
        elm.boardElement.eraseSelection();
      }
    });
  }

  public addToGroup<T extends BoardElement>(boardElement: T) {
    const explodedGroup = this.explodeGroup();
    explodedGroup.boardElements.push(boardElement);
    this.implodeGroup(explodedGroup);
  }

  public removeFromGroup<T extends BoardElement>(boardElement: T) {
    if (
      this.container.children.find(
        (elm) => elm instanceof BoardElementContainer && elm.boardElement === boardElement,
      )
    ) {
      const explodedGroup = this.explodeGroup();
      const boardElements = explodedGroup.boardElements.filter((item) => item !== boardElement);

      this.implodeGroup({
        boardElements,
        initialScale: explodedGroup.initialScale,
      });
    }
  }

  public explodeGroup(): IExplodedGroup {
    const initialScale = this.scale;

    if (this.container) {
      const elementMap = new Map<BoardElementContainer, ITransforms>();
      const boardElements: BoardElement[] = [];

      // Prepare future position
      this.container.children.forEach((elm) => {
        if (elm instanceof BoardElementContainer) {
          elementMap.set(elm, {
            x: (elm.x + this.x * this.scale) * this.scale,
            y: (elm.y + this.y * this.scale) * this.scale,
            s: elm.scale.x * this.scale,
          });
        }
      });

      // Remove children from group & apply prepared position
      elementMap.forEach((coords, boardElementContainer) => {
        const { boardElement } = boardElementContainer;
        boardElement.inGroup = undefined;
        boardElement.eraseSelection();
        this.app.viewport.instance.addChild(boardElementContainer);
        boardElement.x = coords.x;
        boardElement.y = coords.y;
        boardElement.scale = coords.s;
        boardElements.push(boardElement);
      });

      return { boardElements, initialScale };
    }

    return {
      boardElements: [],
      initialScale,
    };
  }

  public implodeGroup({ boardElements, initialScale = 1 }: IExplodedGroup) {
    // Calculate group transforms
    const fScale = 1 / initialScale;

    boardElements.forEach((boardElement) => {
      // Apply scale modifications before adding children to container
      boardElement.x *= fScale;
      boardElement.y *= fScale;
      boardElement.scale *= fScale;

      this.container.addChildAt(boardElement.container, 1);
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

    // Apply needed group scale
    this.scale = initialScale;
    // this.container.cacheAsBitmap = true;

    // Draw for debug
    // this.drawSelection();
  }
}
