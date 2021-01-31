import FlowApp from './FlowApp';
import BoardElement, { BoardElementContainer } from './BoardElement';
import Memo from './Memo';
import Group from './Group';
import { IWorldCoords } from './Viewport';

export type ShiftModeState = 'off' | 'hold' | 'lock';

class SelectionChangeLog {
  newSelection: Board['selectedBoardElement'] = null;
  prevSelection: Board['selectedBoardElement'] = null;
  addedToTempGroup: BoardElement[] = [];
  removedFromTempGroup: BoardElement[] = [];
  tempGroupCreated: undefined | Group = undefined;
  tempGroupRemoved: undefined | Group = undefined;

  public resetLog(currentSelection: Board['selectedBoardElement']): void {
    this.newSelection = null;
    this.prevSelection = currentSelection;
    this.tempGroupCreated = undefined;
    this.tempGroupRemoved = undefined;
    this.addedToTempGroup = [];
    this.removedFromTempGroup = [];
  }

  public export(currentSelection: Board['selectedBoardElement']): SelectionChangeLog {
    this.newSelection = currentSelection;
    return this;
  }
}

export default class Board {
  public isMemberDragging: boolean | string = false;
  public shiftModeState: ShiftModeState = 'off';
  public selectedBoardElement: BoardElement | null = null;
  public isMultiSelect: boolean = false;
  public selectionChangeLog = new SelectionChangeLog();

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
    if (this.selectedBoardElement?.id === boardElement.id) {
      return;
    }

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

  public selectElement(boardElement: BoardElement): SelectionChangeLog {
    return this.isMultiSelect
      ? this.multiSelectElement(boardElement)
      : this.singleSelectElement(boardElement);
  }

  public singleSelectElement(boardElement: BoardElement): SelectionChangeLog {
    this.selectionChangeLog.resetLog(this.selectedBoardElement);

    if (this.selectedBoardElement instanceof Group) {
      if (this.selectedBoardElement.isElementInGroup(boardElement)) {
        // CASE: Single select on group member -- do nothing, maybe move group or use group ui
        return this.selectionChangeLog.export(this.selectedBoardElement);
      }

      // CASE: was selected: group, new selection: non-group-element -- drop group, select non-group-element
      const group = this.selectedBoardElement;
      const explodedGroup = this.selectedBoardElement.explodeGroup();

      this.selectionChangeLog.removedFromTempGroup.push(...explodedGroup.boardElements);
      this.selectionChangeLog.tempGroupRemoved = group;

      this.deleteBoardElement(group);
    }

    this.setSelection(boardElement);
    return this.selectionChangeLog.export(this.selectedBoardElement);
  }

  public multiSelectElement(boardElement: BoardElement): SelectionChangeLog {
    this.selectionChangeLog.resetLog(this.selectedBoardElement);

    if (this.selectedBoardElement instanceof Group) {
      if (!this.selectedBoardElement.isElementInGroup(boardElement)) {
        // CASE: while some group already selected the new selected element adds to that group
        this.selectedBoardElement.addToGroup(boardElement);
        this.selectionChangeLog.addedToTempGroup.push(boardElement);
      } else {
        if (!this.isMemberDragging) {
          // CASE: while some group already selected the selected group member element removed from that group
          const group = this.selectedBoardElement.removeFromGroup(boardElement);
          this.selectionChangeLog.removedFromTempGroup.push(boardElement);

          // CASE: Remove the selected group if there is no more than one member left
          if (group) {
            const groupMembers = group.getGroupMembers();
            if (groupMembers && groupMembers.length === 1) {
              const explodedGroup = group.explodeGroup();
              this.setSelection(explodedGroup.boardElements[0]);

              this.selectionChangeLog.removedFromTempGroup.push(explodedGroup.boardElements[0]);
              this.selectionChangeLog.tempGroupRemoved = group;

              this.deleteBoardElement(group);
            }
          }
        }
      }

      return this.selectionChangeLog.export(this.selectedBoardElement);
    }

    // Create temp selection group
    if (this.selectedBoardElement instanceof Memo && this.selectedBoardElement !== boardElement) {
      const group = this.addElementToBoard(new Group(this.app));
      group.addToGroup(this.selectedBoardElement);
      group.addToGroup(boardElement);

      this.selectionChangeLog.addedToTempGroup.push(this.selectedBoardElement, boardElement);
      this.selectionChangeLog.tempGroupCreated = group;

      this.setSelection(group);

      return this.selectionChangeLog.export(this.selectedBoardElement);
    }

    // Make basic selection
    if (this.selectedBoardElement === null) {
      this.setSelection(boardElement);
      return this.selectionChangeLog.export(this.selectedBoardElement);
    }

    return this.selectionChangeLog.export(this.selectedBoardElement);
  }

  public deselectElement(): SelectionChangeLog {
    this.selectionChangeLog.resetLog(this.selectedBoardElement);

    if (this.selectedBoardElement) {
      // Remove group if it was temp
      if (this.selectedBoardElement instanceof Group && this.selectedBoardElement.isTempGroup) {
        const group = this.selectedBoardElement;
        const explodedGroup = this.selectedBoardElement.explodeGroup();

        this.selectionChangeLog.removedFromTempGroup.push(...explodedGroup.boardElements);
        this.selectionChangeLog.tempGroupRemoved = group;

        this.deleteBoardElement(group);
      }

      this.setDeselection();
    }

    return this.selectionChangeLog.export(this.selectedBoardElement);
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
