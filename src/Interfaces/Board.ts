import FlowApp from './FlowApp';
import BoardElement, { BoardElementContainer } from './BoardElement';
import Memo from './Memo';
import Group from './Group';
import { IWorldCoords } from './Viewport';

export type ShiftModeState = 'off' | 'hold' | 'lock';

export default class Board {
  public isMemberDragging: boolean | string = false;
  public shiftModeState: ShiftModeState = 'off';
  public selection: BoardElement | null = null;
  public isMultiSelect: boolean = false;

  constructor(public app: FlowApp) {
    if (this.app.devMonitor) {
      this.app.devMonitor.addDevMonitor('boardEvents');
    }
  }

  // TODO: we need to add elements through the actions
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

    if (this.selection === boardElement) this.deselectElement();

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
      this.selectElement(boardElement);
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

  public setShiftModeState(state: ShiftModeState = 'off') {
    this.shiftModeState = state;

    if (state === 'hold' || state === 'lock') {
      this.isMultiSelect = true;
    }

    if (state === 'off') {
      this.isMultiSelect = false;
    }

    this.app.webUi.updateShiftMode(this.shiftModeState);
  }

  private setSelection(boardElement: BoardElement) {
    this.deselectElement();
    this.selection = boardElement;
    this.selection.onSelect();
    this.app.webUi.updateSelectedMode();
  }

  public selectElement(boardElement: BoardElement) {
    if (this.selection) {
      if (boardElement.id === this.selection.id) {
        return;
      }

      if (this.selection instanceof Group) {
        if (this.isMultiSelect) {
          if (!this.selection.isElementInGroup(boardElement)) {
            this.selection.addToGroup(boardElement);
          } else {
            if (!this.isMemberDragging) {
              const group = this.selection.removeFromGroup(boardElement);

              if (group) {
                const groupMembers = group.getGroupMembers();
                if (groupMembers && groupMembers.length === 1) {
                  const explodedGroup = group.explodeGroup();
                  this.deselectElement();
                  this.selectElement(explodedGroup.boardElements[0]);
                  this.deleteBoardElement(group);
                }
              }
            }
          }
        } else {
          if (!this.selection.isElementInGroup(boardElement)) {
            this.setSelection(boardElement);
          }
        }
      } else {
        // Prev Selection was not a group^
        if (this.isMultiSelect) {
          const group = this.addElementToBoard(new Group(this.app));
          group.addToGroup(this.selection);
          group.addToGroup(boardElement);
          this.setSelection(group);
        } else {
          this.setSelection(boardElement);
        }
      }
    } else {
      this.setSelection(boardElement);
    }
  }

  public deselectElement() {
    if (this.selection) {
      this.selection.onDeselect();
      this.selection = null;
      this.app.webUi.updateSelectedMode();
    }
  }

  public updateSelectionGraphics() {
    if (this.selection) {
      this.selection.drawSelection();
    }
  }

  public getSelectedElement(): BoardElement | null {
    return this.selection;
  }

  public getElementById(elementId: string): BoardElement | undefined {
    const displayObjects = this.app.viewport.instance.children.filter(
      (el) => el instanceof BoardElementContainer && el.boardElement.id === elementId,
    ) as BoardElementContainer[];

    return displayObjects.length > 0 ? displayObjects[0].boardElement : undefined;
  }

  public getAllBoardElements() {
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
