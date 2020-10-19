import FlowApp from './FlowApp';
import BoardElement, { BoardElementContainer, IBoardElementPublicState } from './BoardElement';
import Memo from './Memo';
import Group from './Group';
import { IWorldCoords } from './Viewport';

export interface IPublicBoardState {
  [key: string]: IBoardElementPublicState;
}

export default class Board {
  public readonly state: IPublicBoardState = {};
  public isMemberDragging: boolean | string = false;
  public selection: BoardElement | undefined = undefined;
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

  public removeElementFromBoard<T extends BoardElement>(boardElement: T): boolean {
    delete this.state[boardElement.id];
    this.app.viewport.removeFromViewport(boardElement.container);
    return true;
  }

  public activateMultiselect() {
    this.isMultiSelect = true;
  }

  public deactivateMultiselect() {
    this.isMultiSelect = false;
  }

  public startDragElement(
    boardElement: BoardElement,
    startPoint: IWorldCoords = { wX: boardElement.x, wY: boardElement.y },
  ) {
    if (!this.app.board.isMemberDragging) {
      this.app.board.isMemberDragging = boardElement.id;
      this.selectElement(boardElement);
      boardElement.startDrag(startPoint);
    }
  }

  public stopDragElement(boardElement: BoardElement) {
    // Small delay to prevent immediate actions after stopDrag, e.g. removeFromGroup on shift+select
    setTimeout(() => {
      this.app.board.isMemberDragging = false;
    }, 500);
    boardElement.stopDrag();
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
              this.selection.removeFromGroup(boardElement);
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

      if (this.selection instanceof Group && this.selection.isTempGroup) {
        this.selection.deleteGroup();
      }

      this.selection = undefined;
      this.app.webUi.updateSelectedMode();
    }
  }

  public updateSelectionGraphics() {
    if (this.selection) {
      this.selection.drawSelection();
    }
  }

  public getSelectedElement(): BoardElement | undefined {
    return this.app.board.selection;
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

  public getMemos() {
    const displayObject = this.app.viewport.instance.children.filter(
      (el) => el instanceof BoardElementContainer && el.boardElement instanceof Memo,
    ) as BoardElementContainer[];

    return displayObject.map((container) => container.boardElement);
  }

  public getGroups() {
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
