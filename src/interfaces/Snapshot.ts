import * as PIXI from 'pixi.js';
import SnapShotContainer from './SnapShotContainer';

/** Mimics PIXI.interaction.InteractionEvent with targets overwritten **/
interface ISnapshotsEvent {
  stopped: boolean;
  target: SnapShotContainer;
  currentTarget: SnapShotContainer;
  type: string;
  data: PIXI.interaction.InteractionData;
  stopPropagation(): void;
  reset(): void;
}

export class Snapshot {
  title: string;
  parent: PIXI.Container;
  parentList: SnapShotContainer[] | undefined;
  sprite: PIXI.Sprite;
  selectionDrawing: PIXI.Graphics;
  selected: boolean;
  width: number;
  height: number;

  constructor(texture: PIXI.Texture, parent: PIXI.Container) {
    const sprite = PIXI.Sprite.from(texture);
    this.title = '';
    this.parent = parent;
    this.parentList = undefined;
    this.sprite = sprite;
    this.selectionDrawing = new PIXI.Graphics();
    this.selected = false;
    this.width = sprite.width;
    this.height = sprite.height;

    this.activateInteraction();
  }

  select() {
    this.selected = true;
    // clear list, add current
    this.drawSelection();
  }

  deselect() {
    this.selected = false;
    // clear list, rm current
    this.eraseSelection();
  }

  drawSelection(zoomLevel: number = 1): void {
    this.selectionDrawing
      .clear()
      .lineStyle(1.1 / zoomLevel / this.parent.transform.scale.x, 0x73b2ff)
      .drawRect(0, 0, this.width, this.height);
  }

  eraseSelection() {
    this.selectionDrawing.clear();
  }

  activateInteraction() {
    // https://pixijs.io/examples/#/interaction/interactivity.js
    // Mouse & touch events are normalized into
    // the pointer* events for handling different
    // button events.
    this.parent
      .on('pointerdown', Snapshot.interaction().onButtonDown)
      .on('pointerup', Snapshot.interaction().onButtonUp)
      .on('pointerupoutside', Snapshot.interaction().onButtonUp)
      .on('pointerover', Snapshot.interaction().onButtonOver)
      .on('pointerout', Snapshot.interaction().onButtonOut);
  }

  static interaction() {
    return {
      onButtonUp: (e: ISnapshotsEvent) => {
        console.log('1 onButton Up', e);
        const targetSnapshotContainer: SnapShotContainer = e.target;
        const snapShot = targetSnapshotContainer.snapshot;

        snapShot.selected ? snapShot.deselect() : snapShot.select();
      },

      onButtonDown: (e: ISnapshotsEvent) => {
        console.log('2 onButton Down');
        // const targetSnapshotContainer: SnapShotContainer = e.target;
        // const snapShot = targetSnapshotContainer.snapShot;
        // snapShot.selected ? snapShot.deselect() : snapShot.select();
      },

      onButtonOver: () => {
        console.log('3 onButton Over');
      },

      onButtonOut: () => {
        console.log('4 onButton Out');
      },
    };
  }
}
