import FlowApp from './FlowApp';
import BoardElement, { BoardElementContainer } from './BoardElement';
import Memo from './Memo';
import Group from './Group';
import { IWorldCoords } from './Viewport';
import { ElementSelection } from './BoardSelection';

export type ShiftModeState = 'off' | 'hold' | 'lock';

export default class Board {
  public isMemberDragging: boolean | string = false;
  public selection = new ElementSelection(this);

  constructor(public app: FlowApp) {
    if (this.app.devMonitor) {
      this.app.devMonitor.addDevMonitor('boardEvents');
    }
  }

  // TODO: this is currently a shortcut method, we need to add elements properly through the actions
  public addNewMemosToBoardFromTextures(textures?: PIXI.Texture[]) {
    if (textures && textures.length > 0) {
      textures.forEach((texture) => {
        this.addElementToBoard(new Memo(texture, this.app));
      });
    }
  }

  public addElementToBoard<T extends BoardElement>(boardElement: T): T {
    boardElement.zIndex = 1;
    this.app.viewport.addToViewport(boardElement.container);
    return boardElement;
  }

  // todo: how to make "undo" for "hard" delete of Sprites? never really delete BoardElement?
  //   probably this need two variations: soft/hard deletion
  public deleteBoardElement<T extends BoardElement>(boardElement: T, hard: boolean = false): boolean {
    if (boardElement instanceof Group) {
      boardElement.isTempGroup = false; // keep from rm on deselect
    }

    if (this.selection.selectedElement === boardElement) this.selection.setDeselection(); // todo: this points at incorrect binds with "selection"

    boardElement.delete(hard);
    return true;
  }

  public resetBoard() {
    // Looks like in order to fully reset the board we just need to remove all board elements
    const allBoardElements = this.getAllBoardElements();
    allBoardElements.forEach((el) => this.deleteBoardElement(el, true));
    return true;
  }

  public startDragElement(
    boardElement: BoardElement,
    startPoint: IWorldCoords = { wX: boardElement.x, wY: boardElement.y },
  ) {
    if (!this.isMemberDragging) {
      this.isMemberDragging = boardElement.id;
      this.selection.selectElement(boardElement);
      this.app.viewport.instance.pause = true;
      boardElement.startDrag(startPoint);
    }
  }

  public stopDragElement(boardElement: BoardElement) {
    // Small delay to prevent immediate actions after stopDrag, e.g. removeFromGroup on shift+select
    setTimeout(() => {
      this.isMemberDragging = false;
    }, 500);
    this.app.viewport.instance.pause = false;
    boardElement.stopDrag();
  }

  public getElementById(elementId: string): BoardElement | undefined {
    const displayObjects = this.app.viewport.instance.children.filter(
      (el) => el instanceof BoardElementContainer && el.boardElement.id === elementId,
    ) as BoardElementContainer[];

    return displayObjects.length > 0 ? displayObjects[0].boardElement : undefined;
  }

  public getAllBoardElements() {
    // API design: Should we get all elements in a flat way, including inner group members?

    const displayObjects = this.app.viewport.instance.children.filter(
      (el) => el instanceof BoardElementContainer,
    ) as BoardElementContainer[];

    return displayObjects.map((container) => container.boardElement) as BoardElement[];
  }

  public getAllMemos(): Memo[] {
    const displayObjects = this.app.viewport.instance.children.filter(
      (el) => el instanceof BoardElementContainer && el.boardElement instanceof Memo,
    ) as BoardElementContainer[];

    return displayObjects.map((container) => container.boardElement) as Memo[];
  }

  public getAllGroups() {
    const displayObjects = this.app.viewport.instance.children.filter(
      (el) => el instanceof BoardElementContainer && el.boardElement instanceof Group,
    ) as BoardElementContainer[];

    return displayObjects.map((container) => container.boardElement);
  }

  public sendEventToMonitor(boardElement: BoardElement, eventName: string, msg: string = '') {
    if (this.app.devMonitor) {
      this.app.devMonitor.dispatchMonitor('boardEvents', `[${boardElement.id}] ${eventName}`, msg);
    }
  }
}
