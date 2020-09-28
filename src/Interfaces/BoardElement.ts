import * as PIXI from 'pixi.js';
import FlowApp from './FlowApp';
import { gsap } from 'gsap';

export interface IBoardElementState {
  x?: number;
  y?: number;
  scale?: number;
  element?: BoardElement;
}

export default class BoardElement {
  public selected = false;
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

  get width() {
    return this.container.width;
  }

  set width(val: number) {
    this.container.width = val;
    this.updateCenterPivot();
  }

  get height() {
    return this.container.height;
  }

  set height(val: number) {
    this.container.height = val;
    this.updateCenterPivot();
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
    this.container.scale.x = val;
    this.container.scale.y = val;
  }

  public select() {
    this.app.board.addElementToSelected(this);
    this.selected = true;
    this.drawSelection();
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

  private eraseSelection() {
    this.selectionDrawing.clear();
  }

  private updateCenterPivot() {
    this.pivotX = this.width / 2;
    this.pivotY = this.height / 2;
  }
}

interface IBoardElementContainer extends PIXI.Container {
  boardElement: BoardElement;
}

export class BoardElementContainer extends PIXI.Container implements IBoardElementContainer {
  constructor(public boardElement: BoardElement) {
    super();
  }
}
