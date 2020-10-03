import * as PIXI from 'pixi.js';
import FlowApp from './FlowApp';
import { gsap } from 'gsap';
import Group from './Group';

export interface IBoardElementState {
  x?: number;
  y?: number;
  scale?: number;
  element?: BoardElement;
}

export default class BoardElement {
  public selected = false;
  public inGroup: Group | undefined = undefined;
  public container = new BoardElementContainer(this);
  private selectionDrawing = new PIXI.Graphics();
  public readonly id: string;

  public readonly state: IBoardElementState = {
    x: 0,
    y: 0,
    scale: 1,
    element: this,
  };

  [key: string]: any;

  constructor(public app: FlowApp) {
    this.id = Math.random().toString(32).slice(2);
    this.container.addChild(this.selectionDrawing);
  }

  public getLocalDimensions() {
    const { width, height } = this.container.getLocalBounds();
    return { width, height };
  }

  get x() {
    return this.container.x;
  }

  set x(val: number) {
    if (this.inGroup) {
      // we don't allow to change pos in group for now
      this.container.x = val;
    } else {
      this.container.x = val;
    }
  }

  get y() {
    return this.container.y;
  }

  set y(val: number) {
    if (this.inGroup) {
      this.container.y = val;
      // we don't allow to change pos in group for now
    } else {
      this.container.y = val;
    }
  }

  get scale() {
    return this.container.scale.x;
  }

  set scale(val: number) {
    if (this.inGroup) {
      // we don't allow to change pos in group for now
      this.container.scale.x = val;
      this.container.scale.y = val;
    } else {
      this.container.scale.x = val;
      this.container.scale.y = val;
    }
  }

  get width() {
    // does it call getLocalBounds anyway?
    return this.container.width;
  }

  get height() {
    // does it call getLocalBounds anyway?
    return this.container.height;
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

  // get pivotX() {
  //   return this.container.pivot.x;
  // }
  //
  // set pivotX(val: number) {
  //   this.container.pivot.x = val;
  // }
  //
  // get pivotY() {
  //   return this.container.pivot.y;
  // }
  //
  // set pivotY(val: number) {
  //   this.container.pivot.y = val;
  // }

  public select() {
    if (this.inGroup) {
      this.inGroup.selectGroup(); // TODO: make proper selection
    } else {
      this.app.board.addElementToSelected(this);
      this.selected = true;
      this.drawSelection();
    }
  }

  public deselect() {
    this.app.board.removeElementFromSelected(this);
    this.selected = false;
    this.eraseSelection();
  }

  public animateBoardElement(boardElementProps: IBoardElementState): Promise<IBoardElementState> {
    return new Promise((resolve) => {
      gsap.to(this, {
        ...boardElementProps,
        duration: 0.7,
        ease: 'power3.out',
        onStart: () => {
          this.container.zIndex = 1;
        },
        onUpdate: () => {
          if (this.selected) {
            this.drawSelection();
          }
          // this.app.gui.stageBackTile.updateGraphics();
        },
        onComplete: () => {
          this.container.zIndex = 0; // bring back zIndex after sorting operation
          resolve({ ...boardElementProps });
        },
      });
    });
  }

  public drawSelection(): void {
    const { width, height } = this.getLocalDimensions();
    this.selectionDrawing
      .clear()
      .lineStyle(4 / this.app.viewport.scale / this.scale, 0x73b2ff)
      .drawRect(0, 0, width, height);
  }

  public eraseSelection() {
    this.selectionDrawing.clear();
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
