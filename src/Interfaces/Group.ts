import BoardElement from './BoardElement';
import { ITransforms } from '../types/global';
import { IWorldCoords } from './Viewport';
import Memo from './Memo';
import Board, { BoardElementId } from './Board';
import { CgContainer, CgDrawContainer } from './GraphicsEngine';

export interface IGroupSettings {
  isTempGroup: boolean;
}

export interface IExplodedGroup {
  boardElements: BoardElement[];
  initialScale: number;
}

export default class Group extends BoardElement {
  private groupDrawing = new CgDrawContainer();
  leftMostChild: CgContainer | undefined;
  isTempGroup: boolean = true;

  constructor(public board: Board, id: BoardElementId, settings: IGroupSettings = { isTempGroup: false }) {
    super(board, id);
    this.isTempGroup = settings.isTempGroup;
    this.zIndex = 1;
    this.enableInteractive();
    this.groupDrawing.zIndex = 0;
    this.addElement(this.groupDrawing);

    this.publicState = {
      ...super.publicState,
      type: 'Group',
    };

    // If an object has no interactive children use interactiveChildren = false
    // the interaction manager will then be able to avoid crawling through the object.

    // TODO: try interaction manager optimization
    // Set this.container.hitArea = new PIXI.Rectangle(x,y,w,h).
    // As above should stop the interaction manager from crawling through the object.
    // https://github.com/pixijs/pixi.js/wiki/v4-Performance-Tips
  }

  public onSelect() {
    if (!this.isSelected) {
      this.isSelected = true;
      this.drawSelection();
      this.getAllContents().forEach(() => (this.isSelected = true));
      return true;
    }
    return false;
  }

  public onDeselect() {
    if (this.isSelected) {
      this.isSelected = false;
      this.eraseSelectionDrawing();
      this.getAllContents().forEach((elm) => (elm.isSelected = false));

      if (this.isTempGroup) {
        this.explodeGroup();
      }

      return true;
    }

    return false;
  }

  public drawSelection(): void {
    // Let children draw it's own selection
    this.getAllContents().forEach((elm) => elm.drawSelection());

    // TODO: bug -- group object shifts a bit on x,y via different global scale
    // // Border line stroke with sharp angle
    // const lineWidth = 2 / this.board.viewport.scale / this.scale;
    //
    // this.groupDrawing
    //   .clear()
    //   .lineStyle(lineWidth, 0xe3d891)
    //   .drawRect(0, 0, this.width / this.scale - lineWidth, this.height / this.scale - lineWidth);
    // Area Fill with padding and rounded angles
    // const padding = 8;
    //
    // this.groupDrawing
    //   .clear()
    //   .beginFill(0xe3d891, 0.15)
    //   .drawRoundedRect(
    //     -padding,
    //     -padding,
    //     (this.width + padding * 2) / this.scale,
    //     (this.height + padding * 2) / this.scale,
    //     4 / this.board.viewport.scale / this.scale,
    //   )
    //   .endFill();
  }

  public eraseSelectionDrawing() {
    this.groupDrawing.clear();

    this.getAllContents().forEach((elm) => {
      if (elm instanceof CgContainer) {
        elm.boardElement.eraseSelectionDrawing();
      }
    });
  }

  public startDrag(startPoint: IWorldCoords) {
    this.getAllContents().forEach((elm) => {
      if (elm instanceof CgContainer) {
        elm.boardElement.isDragging = true;

        if (elm.boardElement instanceof Memo) {
          elm.boardElement.setDrag();
        }
      }
    });
    super.startDrag(startPoint);
  }

  public stopDrag() {
    this.getAllContents().forEach((elm) => {
      if (elm instanceof CgContainer) {
        elm.boardElement.isDragging = false;

        if (elm.boardElement instanceof Memo) {
          elm.boardElement.unsetDrag();
        }
      }
    });
    super.stopDrag();
  }

  public isElementInGroup(boardElement: BoardElement) {
    return this.getAllContents().find(
      (elm) => elm instanceof CgContainer && elm.boardElement === boardElement,
    );
  }

  public getGroupMembers() {
    const boardElementContainers = this.getAllContents().filter(
      (elm) => elm instanceof CgContainer,
    ) as CgContainer[];
    return boardElementContainers.map((elmC) => elmC.boardElement);
  }

  public addToGroup<T extends BoardElement>(boardElement: T) {
    if (!this.isElementInGroup(boardElement)) {
      const explodedGroup = this.explodeGroup();
      explodedGroup.boardElements.push(boardElement);
      this.implodeGroup(explodedGroup);
    }
  }

  public removeFromGroup<T extends BoardElement>(boardElement: T): Group | undefined {
    if (this.isElementInGroup(boardElement)) {
      const explodedGroup = this.explodeGroup();
      const boardElements = explodedGroup.boardElements.filter((item) => item !== boardElement);

      return this.implodeGroup({
        boardElements,
        initialScale: explodedGroup.initialScale,
      });
    }
  }

  public explodeGroup(): IExplodedGroup {
    const initialScale = this.scale;

    if (this.container) {
      const elementMap = new Map<CgContainer, ITransforms>();
      const boardElements: BoardElement[] = [];

      // Prepare future position
      this.getAllContents().forEach((elm) => {
        if (elm instanceof CgContainer) {
          elementMap.set(elm, {
            x: this.x + elm.x * this.scale,
            y: this.y + elm.y * this.scale,
            s: elm.scale.x * this.scale,
          });
        }
      });

      // Remove children from group & apply prepared position
      elementMap.forEach((coords, boardElementContainer) => {
        const { boardElement } = boardElementContainer;
        boardElement.inGroup = undefined;
        boardElement.eraseSelectionDrawing();
        this.board.viewport.instance.addChild(boardElementContainer);
        boardElement.x = coords.x;
        boardElement.y = coords.y;
        boardElement.scale = coords.s;
        boardElements.push(boardElement);
      });

      this.eraseSelectionDrawing();
      return { boardElements, initialScale };
    }

    this.eraseSelectionDrawing();
    return {
      boardElements: [],
      initialScale,
    };
  }

  public implodeGroup({ boardElements, initialScale = 1 }: IExplodedGroup): Group {
    // Calculate group transforms
    const fScale = 1 / initialScale;

    boardElements.forEach((boardElement) => {
      // Apply scale modifications before adding children to container
      boardElement.x *= fScale;
      boardElement.y *= fScale;
      boardElement.scale *= fScale;

      this.addElement(boardElement.container);
      boardElement.inGroup = this;
    });

    // After all children are ready, calc group transforms
    // Find leftMostX and leftMostY point, which will be group's new position
    let leftMostX = Infinity;
    let leftMostY = Infinity;
    this.getAllContents().forEach((elm) => {
      if (elm instanceof CgContainer) {
        if (elm.x < leftMostX) leftMostX = elm.x;
        if (elm.y < leftMostY) leftMostY = elm.y;
      }
    });

    // Set group's new position. Bring back original position of mostLeft child
    this.x = leftMostX / fScale;
    this.y = leftMostY / fScale;

    // Shift children to their prev position
    this.getAllContents().forEach((elm) => {
      if (elm instanceof CgContainer) {
        elm.x = elm.x - leftMostX;
        elm.y = elm.y - leftMostY;
      }
    });

    // Apply needed group scale
    this.scaleX = initialScale;
    // this.container.cacheAsBitmap = true;

    // Draw for debug
    this.drawSelection();

    return this;
  }
}
