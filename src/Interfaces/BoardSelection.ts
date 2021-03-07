import BoardElement from './BoardElement';
import Group from './Group';
import Board from './Board';
import Memo from './Memo';

export class ElementSelection {
  public isMultiSelect: boolean = false;
  public selectedElement: BoardElement | null = null;

  newSelection: ElementSelection['selectedElement'] = null;
  prevSelection: ElementSelection['selectedElement'] = null;
  addedToTempGroup: BoardElement[] = [];
  removedFromTempGroup: BoardElement[] = [];
  tempGroupCreated: undefined | Group = undefined;
  tempGroupRemoved: undefined | Group = undefined;

  constructor(public board: Board) {}

  public resetLog(currentSelection: ElementSelection['selectedElement']): void {
    this.newSelection = null;
    this.prevSelection = currentSelection;
    this.tempGroupCreated = undefined;
    this.tempGroupRemoved = undefined;
    this.addedToTempGroup = [];
    this.removedFromTempGroup = [];
  }

  public export(currentSelection: ElementSelection['selectedElement']): ElementSelection {
    this.newSelection = currentSelection;
    return this;
  }

  public setSelection(boardElement: BoardElement) {
    if (this.selectedElement?.id === boardElement.id) {
      return;
    }

    this.setDeselection();
    this.selectedElement = boardElement;
    this.selectedElement.onSelect();
    this.board.app.webUi.updateSelectedMode(); // not cool external binding but keep for simplification
  }

  public setDeselection() {
    if (this.selectedElement) {
      this.selectedElement.onDeselect();
      this.selectedElement = null;
      this.board.app.webUi.updateSelectedMode(); // not cool external binding but keep for simplification
    }
  }

  public selectElement(boardElement: BoardElement): ElementSelection {
    return this.isMultiSelect
      ? this.multiSelectElement(boardElement)
      : this.singleSelectElement(boardElement);
  }

  public deselectElement(): ElementSelection {
    this.resetLog(this.selectedElement);

    if (this.selectedElement) {
      // Remove group if it was temp
      if (this.selectedElement instanceof Group && this.selectedElement.isTempGroup) {
        const group = this.selectedElement;
        const explodedGroup = this.selectedElement.explodeGroup();

        this.removedFromTempGroup.push(...explodedGroup.boardElements);
        this.tempGroupRemoved = group;

        this.board.deleteBoardElement(group);
      }

      this.setDeselection();
    }

    return this.export(this.selectedElement);
  }

  public singleSelectElement(boardElement: BoardElement): ElementSelection {
    this.resetLog(this.selectedElement);

    if (this.selectedElement instanceof Group) {
      if (this.selectedElement.isElementInGroup(boardElement)) {
        // CASE: Single select on group member -- do nothing, maybe move group or use group ui
        return this.export(this.selectedElement);
      }

      // CASE: was selected: group, new selection: non-group-element -- drop group, select non-group-element
      const group = this.selectedElement;
      const explodedGroup = this.selectedElement.explodeGroup();

      this.removedFromTempGroup.push(...explodedGroup.boardElements);
      this.tempGroupRemoved = group;

      this.board.deleteBoardElement(group);
    }

    this.setSelection(boardElement);
    return this.export(this.selectedElement);
  }

  public multiSelectElement(boardElement: BoardElement): ElementSelection {
    this.resetLog(this.selectedElement);

    if (this.selectedElement instanceof Group) {
      if (!this.selectedElement.isElementInGroup(boardElement)) {
        // CASE: while some group already selected the new selected element adds to that group
        this.selectedElement.addToGroup(boardElement);
        this.addedToTempGroup.push(boardElement);
      } else {
        if (!this.board.isMemberDragging) {
          // CASE: while some group already selected the selected group member element removed from that group
          const group = this.selectedElement.removeFromGroup(boardElement);
          this.removedFromTempGroup.push(boardElement);

          // CASE: Remove the selected group if there is no more than one member left
          if (group) {
            const groupMembers = group.getGroupMembers();
            if (groupMembers && groupMembers.length === 1) {
              const explodedGroup = group.explodeGroup();
              this.setSelection(explodedGroup.boardElements[0]);

              this.removedFromTempGroup.push(explodedGroup.boardElements[0]);
              this.tempGroupRemoved = group;

              this.board.deleteBoardElement(group);
            }
          }
        }
      }

      return this.export(this.selectedElement);
    }

    // Create temp selection group
    if (this.selectedElement instanceof Memo && this.selectedElement !== boardElement) {
      const group = this.board.addElementToBoard(new Group(this.board.app));
      group.addToGroup(this.selectedElement);
      group.addToGroup(boardElement);

      this.addedToTempGroup.push(this.selectedElement, boardElement);
      this.tempGroupCreated = group;

      this.setSelection(group);

      return this.export(this.selectedElement);
    }

    // Make basic selection
    if (this.selectedElement === null) {
      this.setSelection(boardElement);
      return this.export(this.selectedElement);
    }

    return this.export(this.selectedElement);
  }

  public updateSelectionGraphics() {
    if (this.selectedElement) {
      this.selectedElement.drawSelection();
    }
  }

  public getSelectedElement(): BoardElement | null {
    return this.selectedElement;
  }
}
