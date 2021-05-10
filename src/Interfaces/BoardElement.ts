import { gsap } from 'gsap';
import Group from './Group';
import { IGsapProps } from '../types/global';
import { IWorldCoords } from './Viewport';
import Board, { BoardElementId, BoardElementType } from './Board';
import { CgDrawContainer, CgInteractiveContainer } from './GraphicsEngine';

export interface IBoardElementPublicState {
  id: BoardElementId;
  type: BoardElementType;
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
}

export default class BoardElement extends CgInteractiveContainer {
  public readonly id: string;
  public publicState: IBoardElementPublicState;
  public cgDrawContainer = new CgDrawContainer();
  public inGroup: Group | undefined = undefined;

  public selectionDrawing = new CgDrawContainer();

  constructor(public board: Board, id?: BoardElementId) {
    super(board.engine, board.viewport);

    this.id = id ? id : Math.random().toString(32).slice(2);
    this.cgDrawContainer.addGraphics('selectionDrawing');

    // TODO: it looks like this state should have fields which have
    //  getters to obtain plain text data for "DepositState"
    //  setters to trigger updates properly
    this.publicState = {
      id: this.id,
      type: 'BoardElement',
      x: this.x,
      y: this.y,
      scaleX: this.scaleX,
      scaleY: this.scaleY,
    };
  }

  public delete(hard: boolean = false) {
    // TODO: need to delete from state?
    //  when we would be really ready to destroy?
    //  probably this need two variations: soft/hard deletion (same as board.deleteBoardElement)
    // temporary, just wipe it out without opt to "redo" the deletion
    this.destroy();
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
    const groupFactor = this.inGroup ? this.inGroup.scaleX : 1;
    this.cgDrawContainer.drawRect('selectionDrawing', {
      width: this.width / this.scaleX,
      height: this.height / this.scaleX,
      lineWidth: 4 / this.board.viewport.scale / this.scaleX / groupFactor,
      lineColor: 0x73b2ff,
    });
  }

  public eraseSelectionDrawing() {
    this.cgDrawContainer.clear('selectionDrawing');
  }

  public startDrag(startPoint: IWorldCoords) {
    this.inGroup ? this.inGroup.startDrag(startPoint) : super.startDrag(startPoint);
    this.alpha = 0.5;
    this.zIndex = 1;
  }

  public stopDrag() {
    this.inGroup ? this.inGroup.stopDrag() : super.stopDrag();
    this.alpha = 1;
    this.zIndex = 0;
  }

  // TODO: extract this into "Graphics Engine"
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
          this.zIndex = 1;
        },
        onUpdate: () => {
          if (this.isSelected) this.drawSelection();
        },
        onComplete: () => {
          this.zIndex = 0; // bring back zIndex after sorting operation
          this.isScaleFromCenter = false;
          resolve({ ...boardElementProps });
        },
      });
    });
  }
}
