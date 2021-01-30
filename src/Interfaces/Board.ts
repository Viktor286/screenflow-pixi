import FlowApp from './FlowApp';
import BoardElement, { BoardElementContainer } from './BoardElement';
import Memo from './Memo';
import Group from './Group';
import { IWorldCoords } from './Viewport';

export type ShiftModeState = 'off' | 'hold' | 'lock';

interface ISelectionChangeLog {
  newSelection: null | BoardElement;
  prevSelection: null | BoardElement;
  addedToGroup: BoardElement[];
  removedFromGroup: BoardElement[];
  groupCreated: undefined | Group;
  groupRemoved: undefined | Group;
}

export default class Board {
  public isMemberDragging: boolean | string = false;
  public shiftModeState: ShiftModeState = 'off';
  public selectedBoardElement: BoardElement | null = null;
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

    if (this.selectedBoardElement === boardElement) this.setDeselection();

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
    this.setDeselection();
    this.selectedBoardElement = boardElement;
    this.selectedBoardElement.onSelect();
    this.app.webUi.updateSelectedMode();
  }

  private setDeselection() {
    if (this.selectedBoardElement) {
      this.selectedBoardElement.onDeselect();
      this.selectedBoardElement = null;
      this.app.webUi.updateSelectedMode();
    }
  }

  private static createSelectionChangeLog(): ISelectionChangeLog {
    return {
      newSelection: null,
      prevSelection: null,
      addedToGroup: [],
      removedFromGroup: [],
      groupCreated: undefined,
      groupRemoved: undefined,
    };
  }

  public selectElement(boardElement: BoardElement): ISelectionChangeLog {
    const selectionChangeLog = Board.createSelectionChangeLog();

    if (this.selectedBoardElement) {
      if (boardElement.id === this.selectedBoardElement.id) {
        // CASE: the already selected element selected
        return selectionChangeLog;
      }

      if (this.selectedBoardElement instanceof Group) {
        if (this.isMultiSelect) {
          if (!this.selectedBoardElement.isElementInGroup(boardElement)) {
            // CASE: while some group already selected the new selected element adds to that group
            this.selectedBoardElement.addToGroup(boardElement);
            selectionChangeLog.addedToGroup.push(boardElement);
          } else {
            if (!this.isMemberDragging) {
              // CASE: while some group already selected the selected group member element removes from that group
              const group = this.selectedBoardElement.removeFromGroup(boardElement);
              selectionChangeLog.removedFromGroup.push(boardElement);

              // CASE: Remove the selected group if there is no more than one member left
              if (group) {
                const groupMembers = group.getGroupMembers();
                if (groupMembers && groupMembers.length === 1) {
                  const explodedGroup = group.explodeGroup();
                  this.setSelection(explodedGroup.boardElements[0]);

                  selectionChangeLog.removedFromGroup.push(explodedGroup.boardElements[0]);
                  selectionChangeLog.groupRemoved = group;

                  this.deleteBoardElement(group);
                }
              }
            }
          }
        } else {
          if (!this.selectedBoardElement.isElementInGroup(boardElement)) {
            // CASE: while multiselect off and previous selection is a group, select new element and delete the group
            const group = this.selectedBoardElement;

            const explodedGroup = this.selectedBoardElement.explodeGroup();

            selectionChangeLog.removedFromGroup.push(...explodedGroup.boardElements);
            selectionChangeLog.groupRemoved = group;

            selectionChangeLog.prevSelection = group;
            this.setSelection(boardElement);

            this.deleteBoardElement(group);
          }
        }
      } else {
        // CASE: while prev selection was not a group, it should be single boardElement
        if (this.isMultiSelect) {
          // CASE: if multiselect on, create new temp group for previous and new boardElement

          const group = this.addElementToBoard(new Group(this.app));
          group.addToGroup(this.selectedBoardElement);
          group.addToGroup(boardElement);

          selectionChangeLog.addedToGroup.push(this.selectedBoardElement);
          selectionChangeLog.addedToGroup.push(boardElement);

          selectionChangeLog.groupCreated = group;

          selectionChangeLog.prevSelection = this.selectedBoardElement;
          this.setSelection(group);
        } else {
          selectionChangeLog.prevSelection = this.selectedBoardElement;
          this.setSelection(boardElement);
        }
      }
    } else {
      // CASE: if multiselect off, just select new boardElement
      this.setSelection(boardElement);
    }

    return { ...selectionChangeLog, newSelection: this.selectedBoardElement };
  }

  public deselectElement(): ISelectionChangeLog {
    const selectionChangeLog = Board.createSelectionChangeLog();

    if (this.selectedBoardElement) {
      if (this.selectedBoardElement instanceof Group) {
        const group = this.selectedBoardElement;
        const explodedGroup = this.selectedBoardElement.explodeGroup();

        selectionChangeLog.removedFromGroup.push(...explodedGroup.boardElements);
        selectionChangeLog.groupRemoved = group;

        this.deleteBoardElement(group);
      }

      if (this.selectedBoardElement) {
        selectionChangeLog.prevSelection = this.selectedBoardElement;
      }

      this.setDeselection();
    }

    return selectionChangeLog;
  }

  public updateSelectionGraphics() {
    if (this.selectedBoardElement) {
      this.selectedBoardElement.drawSelection();
    }
  }

  public getSelectedElement(): BoardElement | null {
    return this.selectedBoardElement;
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
