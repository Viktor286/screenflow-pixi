import FlowApp from './FlowApp';
import BoardElement, { BoardElementContainer, IBoardElementPublicState } from './BoardElement';
import Memo from './Memo';
import Group from './Group';
import { IWorldCoords } from './Viewport';

export type ShiftModeState = 'off' | 'hold' | 'lock';

export interface IPublicBoardState {
  [key: string]: IBoardElementPublicState;
}

export default class Board {
  public readonly state: IPublicBoardState = {};
  public isMemberDragging: boolean | string = false;
  public shiftModeState: ShiftModeState = 'off';
  public selection: BoardElement | null = null;
  public isMultiSelect: boolean = false;

  constructor(public app: FlowApp) {
    if (this.app.devMonitor) {
      this.app.devMonitor.addDevMonitor('boardEvents');
    }
  }

  public addElementToBoard<T extends BoardElement>(boardElement: T): T {
    this.state[boardElement.id] = boardElement.state;
    this.app.viewport.addToViewport(boardElement.container);
    this.app.viewport.instance.setChildIndex(boardElement.container, 0);
    return boardElement;
  }

  // todo: how to make "undo" for "hard" delete of Sprites? never really delete BoardElement?
  public deleteBoardElement<T extends BoardElement>(boardElement: T): boolean {
    if (boardElement instanceof Group) {
      boardElement.isTempGroup = false; // keep from rm on deselect

      boardElement.getGroupMembers().forEach((boardElement) => {
        if (boardElement && this.state[boardElement.id]) delete this.state[boardElement.id];
      });
    }

    if (this.selection === boardElement) this.deselectElement();

    if (this.state[boardElement.id]) delete this.state[boardElement.id];

    boardElement.delete();
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
    const boardStateElement = this.state[elementId];
    if (
      Object.prototype.hasOwnProperty.call(boardStateElement, 'element') &&
      boardStateElement.element instanceof BoardElement
    ) {
      return boardStateElement.element;
    }
    return undefined;
  }

  public getAllMemos() {
    const displayObject = this.app.viewport.instance.children.filter(
      (el) => el instanceof BoardElementContainer && el.boardElement instanceof Memo,
    ) as BoardElementContainer[];

    return displayObject.map((container) => container.boardElement);
  }

  public getAllGroups() {
    const displayObject = this.app.viewport.instance.children.filter(
      (el) => el instanceof BoardElementContainer && el.boardElement instanceof Group,
    ) as BoardElementContainer[];

    return displayObject.map((container) => container.boardElement);
  }

  public sendEventToMonitor(boardElement: BoardElement, eventName: string, msg: string = '') {
    if (this.app.devMonitor) {
      this.app.devMonitor.dispatchMonitor('boardEvents', `[${boardElement.id}] ${eventName}`, msg);
    }
  }
}
