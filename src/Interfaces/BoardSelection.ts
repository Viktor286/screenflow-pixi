import BoardElement from './BoardElement';
import Group from './Group';
import Board from './Board';
import Memo from './Memo';

class MultiSelectionAsTempGroup {
  constructor(public board: Board, public selection: ElementSelection) {}

  addedToTempGroup: BoardElement[] = [];
  removedFromTempGroup: BoardElement[] = [];
  createdTempGroup: undefined | Group = undefined;
  deletedTempGroup: undefined | Group = undefined;

  public resetReport(): void {
    this.createdTempGroup = undefined;
    this.deletedTempGroup = undefined;
    this.addedToTempGroup = [];
    this.removedFromTempGroup = [];
  }

  public getReport() {
    return {
      addedToTempGroup: this.addedToTempGroup,
      removedFromTempGroup: this.removedFromTempGroup,
      createdTempGroup: this.createdTempGroup,
      deletedTempGroup: this.deletedTempGroup,
    };
  }

  public delete() {
    if (this.selection.selectedElement instanceof Group && this.selection.selectedElement.isTempGroup) {
      const group = this.selection.selectedElement;
      const explodedGroup = this.selection.selectedElement.explodeGroup();
      this.removedFromTempGroup.push(...explodedGroup.boardElements);
      this.deletedTempGroup = group;
      this.board.deleteBoardElement(group);
    }
  }

  public create(boardElements: BoardElement[]) {
    const group = this.board.addElementToBoard(new Group(this.board.app));

    boardElements.forEach((boardElement) => {
      if (boardElement instanceof Memo) {
        group.addToGroup(boardElement);
        this.addedToTempGroup.push(boardElement);
      }
    });

    this.createdTempGroup = group;
    return group;
  }

  public add(boardElement: BoardElement) {
    if (this.selection.selectedElement instanceof Group && this.selection.selectedElement.isTempGroup) {
      this.selection.selectedElement.addToGroup(boardElement);
      this.addedToTempGroup.push(boardElement);
    }
  }

  public remove(boardElement: BoardElement) {
    if (this.selection.selectedElement instanceof Group && this.selection.selectedElement.isTempGroup) {
      this.selection.selectedElement.removeFromGroup(boardElement);
      this.removedFromTempGroup.push(boardElement);
    }
  }
}

interface SelectionReport {
  addedToTempGroup: MultiSelectionAsTempGroup['addedToTempGroup'];
  removedFromTempGroup: MultiSelectionAsTempGroup['removedFromTempGroup'];
  createdTempGroup: MultiSelectionAsTempGroup['createdTempGroup'];
  deletedTempGroup: MultiSelectionAsTempGroup['deletedTempGroup'];
  selectedElement: ElementSelection['selectedElement'];
}

export class ElementSelection {
  public isMultiSelect: boolean = false;
  public selectedElement: BoardElement | null = null;
  public multiselection: MultiSelectionAsTempGroup = new MultiSelectionAsTempGroup(this.board, this);

  constructor(public board: Board) {}

  public setSelection(boardElement: BoardElement) {
    if (this.selectedElement?.id === boardElement.id) {
      return;
    }

    this.setDeselection({ webUiUpdate: false });
    this.selectedElement = boardElement;
    this.selectedElement.onSelect();
    this.board.app.webUi.updateSelectedMode(); // not cool external binding but keep for simplification
  }

  public setDeselection({ webUiUpdate } = { webUiUpdate: true }) {
    if (this.selectedElement) {
      this.selectedElement.onDeselect();
      this.selectedElement = null;
      if (webUiUpdate) this.board.app.webUi.updateSelectedMode(); // not cool external binding but keep for simplification
    }
  }

  public selectElement(boardElement: BoardElement): SelectionReport {
    return this.isMultiSelect
      ? this.multiSelectElement(boardElement)
      : this.singleSelectElement(boardElement);
  }

  public deselectElement(): SelectionReport {
    this.resetSelectionReport();

    if (this.selectedElement) {
      if (this.selectedElement instanceof Group && this.selectedElement.isTempGroup) {
        this.multiselection.delete();
      }

      this.setDeselection();
    }

    return this.getSelectionReport();
  }

  public singleSelectElement(boardElement: BoardElement): SelectionReport {
    this.resetSelectionReport();

    if (this.selectedElement instanceof Group) {
      if (this.selectedElement.isElementInGroup(boardElement)) {
        // CASE: Single select on group member -- no changes to selection (maybe moving group or using group ui)
        return this.getSelectionReport();
      }

      // CASE: was selected: group, new selection: non-group-element -- drop group, select non-group-element
      this.multiselection.delete();
    }

    this.setSelection(boardElement);
    return this.getSelectionReport();
  }

  public multiSelectElement(boardElement: BoardElement): SelectionReport {
    this.resetSelectionReport();

    if (this.selectedElement instanceof Group && this.selectedElement.isTempGroup) {
      if (!this.selectedElement.isElementInGroup(boardElement)) {
        // CASE: while some group already selected the new selected element adds to that group
        this.multiselection.add(boardElement);
      } else {
        if (!this.board.isMemberDragging) {
          // CASE: while some group already selected the selected group member element removed from that group
          this.multiselection.remove(boardElement);

          // CASE: Remove the selected group if there is no more than one member left
          if (this.selectedElement) {
            const groupMembers = this.selectedElement.getGroupMembers();
            if (groupMembers.length === 1 && groupMembers[0]) {
              this.multiselection.delete();
              this.setSelection(groupMembers[0]);
            }
          }
        }
      }

      return this.getSelectionReport();
    }

    // Create temp selection group
    if (this.selectedElement instanceof Memo && this.selectedElement !== boardElement) {
      this.setSelection(this.multiselection.create([this.selectedElement, boardElement]));
      return this.getSelectionReport();
    }

    // Make basic selection
    if (this.selectedElement === null) {
      this.setSelection(boardElement);
      return this.getSelectionReport();
    }

    return this.getSelectionReport();
  }

  public getSelectionReport(): SelectionReport {
    return { ...this.multiselection.getReport(), selectedElement: this.selectedElement };
  }

  public resetSelectionReport(): void {
    this.multiselection.resetReport();
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
