import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';
import Group from './Group';
import { IGsapProps, IPoint } from '../types/global';
import { IWorldCoords } from './Viewport';
import Board, { BoardElementId, BoardElementType } from './Board';

export interface IBoardElementPublicState {
  id: BoardElementId;
  type: BoardElementType;
  x: number;
  y: number;
  scale: number;
}

export default class BoardElement {
  public publicState: IBoardElementPublicState;
  public isSelected = false;
  public isDragging = false;
  public startDragPoint: IWorldCoords | undefined = undefined;
  public isScaleFromCenter = false;
  public inGroup: Group | undefined = undefined;
  public container = new BoardElementContainer(this);
  public selectionDrawing = new PIXI.Graphics();
  private dragPoint: IPoint = { x: 0, y: 0 };
  public readonly id: string;

  constructor(public board: Board, id?: BoardElementId) {
    this.id = id ? id : Math.random().toString(32).slice(2);
    this.container.addChild(this.selectionDrawing);

    // TODO: it looks like this state should have fields which have
    //  getters to obtain plain text data for "DepositState"
    //  setters to trigger updates properly
    this.publicState = {
      id: this.id,
      type: 'BoardElement',
      x: this.x,
      y: this.y,
      scale: this.scale,
    };
  }

  get x() {
    return this.container.x;
  }

  set x(val: number) {
    this.container.x = val;
  }

  get y() {
    return this.container.y;
  }

  set y(val: number) {
    this.container.y = val;
  }

  get scale() {
    return this.container.scale.x;
  }

  set scale(val: number) {
    if (this.isScaleFromCenter) {
      // offset approach
      const oWidth = this.container.width;
      const oHeight = this.container.height;

      this.container.scale.x = val;
      this.container.scale.y = val;

      const width = this.container.width;
      const height = this.container.height;

      this.container.position.x -= (width - oWidth) / 2;
      this.container.position.y -= (height - oHeight) / 2;
    } else {
      this.container.scale.x = val;
      this.container.scale.y = val;
    }
  }

  get zIndex() {
    return this.container.zIndex;
  }

  set zIndex(val: number) {
    this.container.zIndex = val;
  }

  get pivotX() {
    return this.container.pivot.x;
  }

  set pivotX(val: number) {
    this.container.pivot.x = val;
  }

  get pivotY() {
    return this.container.pivot.y;
  }

  set pivotY(val: number) {
    this.container.pivot.y = val;
  }

  /** width/height	Implemented in Container. Scaling. The width property calculates scale.x/scale.y by dividing
   * the "requested" width/height by the local bounding box width/height. It is indirectly an abstraction over scale.x/scale.y,
   * and there is no concept of user-defined width. https://pixijs.download/dev/docs/PIXI.DisplayObject.html */

  /** First, remember that in pixi, width and height are just another way of expressing scale.
   // Second, a containers width and height are expressed by the bounds of its children, but express no dimensions themselves.
   // https://github.com/pixijs/pixi.js/issues/4990#issuecomment-401556950 */

  // set width(val: number) {
  //   this.container.width = val;
  // }

  // set height(val: number) {
  //   this.container.height = val;
  // }

  get width() {
    return this.container.width;
  }

  get height() {
    return this.container.height;
  }

  get centerX() {
    return this.container.x + this.container.width / 2;
  }

  get centerY() {
    return this.container.y + this.container.height / 2;
  }

  public setCoords(point: IPoint) {
    this.x = point.x;
    this.y = point.y;
  }

  public delete(hard: boolean = false) {
    // TODO: need to delete from state?
    //  when we would be really ready to destroy?
    //  probably this need two variations: soft/hard deletion (same as board.deleteBoardElement)
    // temporary, just wipe it out without opt to "redo" the deletion
    this.destroy();
  }

  public destroy() {
    // Pass the destroy call to other BoardElementContainers
    this.container.children.forEach((displayObject) => {
      if (displayObject instanceof BoardElementContainer) {
        displayObject.boardElement.destroy();
      }
    });

    this.container.destroy({
      children: true,
      texture: true,
      baseTexture: true,
    });
  }

  public onSelect() {
    if (this.inGroup) {
      this.inGroup.onSelect();
    } else {
      if (!this.isSelected) {
        this.isSelected = true;
        this.drawSelection();
        return true;
      }
      return false;
    }
  }

  public onDeselect() {
    if (this.isSelected) {
      this.isSelected = false;
      this.eraseSelectionDrawing();
      return true;
    }

    return false;
  }

  public drawSelection(): void {
    const groupFactor = this.inGroup ? this.inGroup.scale : 1;

    // Sharp corners border
    this.selectionDrawing
      .clear()
      .lineStyle(4 / this.board.viewport.scale / this.scale / groupFactor, 0x73b2ff)
      .drawRect(0, 0, this.width / this.scale, this.height / this.scale);
  }

  public eraseSelectionDrawing() {
    this.selectionDrawing.clear();
  }

  public startDrag(startPoint: IWorldCoords) {
    if (this.inGroup) {
      this.inGroup.startDrag(startPoint);
    } else {
      this.isDragging = true;
      this.startDragPoint = startPoint;
      this.container.alpha = 0.5;
      this.zIndex = 1;
      const { wX: wMx, wY: wMy } = this.board.viewport.getWorldCoordsFromMouse();

      // Compensate mouse movement and start point
      this.x -= startPoint.wX - wMx;
      this.y -= startPoint.wY - wMy;

      this.dragPoint = { x: wMx - this.x, y: wMy - this.y };
      this.board.engine.ticker.add(this.onDrag);
    }
  }

  public stopDrag() {
    if (this.inGroup) {
      this.inGroup.stopDrag();
    } else {
      this.isDragging = false;
      this.startDragPoint = undefined;
      this.container.alpha = 1;
      this.zIndex = 0;
      this.dragPoint = { x: 0, y: 0 };
      this.board.engine.ticker.remove(this.onDrag);
    }
  }

  private onDrag = (delta: any) => {
    const mouseCoords = this.board.viewport.getWorldCoordsFromMouse();
    this.x = mouseCoords.wX - this.dragPoint.x;
    this.y = mouseCoords.wY - this.dragPoint.y;
  };

  public animateBoardElement(
    boardElementProps: Partial<BoardElement>,
    gsapProps?: IGsapProps,
  ): Promise<Partial<BoardElement>> {
    this.isScaleFromCenter = true;
    return new Promise((resolve) => {
      gsap.to(this, {
        ...boardElementProps,
        duration: 0.5,
        ease: 'power3.out',
        ...gsapProps,
        onStart: () => {
          this.container.zIndex = 1;
        },
        onUpdate: () => {
          if (this.isSelected) {
            this.drawSelection();
          }
          // this.app.gui.stageBackTile.updateGraphics();
        },
        onComplete: () => {
          this.container.zIndex = 0; // bring back zIndex after sorting operation
          this.isScaleFromCenter = false;
          resolve({ ...boardElementProps });
        },
      });
    });
  }
}

interface IBoardElementContainer extends PIXI.Container {
  boardElement: BoardElement;
}

export class BoardElementContainer extends PIXI.Container implements IBoardElementContainer {
  constructor(public boardElement: BoardElement) {
    super();
  }

  // public addChild<TChildren extends PIXI.DisplayObject[]>(...children: TChildren): TChildren[0] {
  //   const originReturn = super.addChild.call(this, ...arguments);
  //   // if (this instanceof Memo) {
  //   //   this.updateCenterPivot();
  //   // }
  //   return originReturn;
  // }
  //
  // public updateCenterPivot() {
  //   this.pivot.x = this.width / 2;
  //   this.pivot.y = this.height / 2;
  // }
}
