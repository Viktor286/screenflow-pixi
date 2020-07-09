import * as PIXI from 'pixi.js';
import { Snapshot } from './Snapshot';

/** Mimics PIXI.interaction.InteractionEvent with targets overwritten **/
interface InteractionEvent {
  stopped: boolean;
  target: Memo;
  currentTarget: Memo;
  type: string;
  data: PIXI.interaction.InteractionData;
  stopPropagation(): void;
  reset(): void;
}

export default class Memo extends PIXI.Container {
  snapshot: Snapshot;

  constructor(texture: PIXI.Texture) {
    super();
    this.snapshot = new Snapshot(texture, this);

    // this.activateInteraction();

    this.addChild(this.snapshot.sprite);
    this.addChild(this.snapshot.selectionDrawing);
  }

  /**
   * Next TODO: Setup debug for iOS and Chrome monitoring
   */
  activateInteraction() {
    // https://pixijs.io/examples/#/interaction/interactivity.js
    // Mouse & touch events are normalized into
    // the pointer* events for handling different
    // button events.
    this.on('pointerdown', Memo.interaction().onButtonDown)
      .on('pointerup', Memo.interaction().onButtonUp)
      .on('pointerupoutside', Memo.interaction().onButtonUp)
      .on('pointerover', Memo.interaction().onButtonOver)
      .on('pointerout', Memo.interaction().onButtonOut);
  }

  static interaction() {
    return {
      onButtonUp: (e: InteractionEvent) => {
        console.log('1 onButton Up', e);
        const targetSnapshotContainer: Memo = e.target;
        const snapShot = targetSnapshotContainer.snapshot;

        snapShot.selected ? snapShot.deselect() : snapShot.select();
      },

      onButtonDown: (e: InteractionEvent) => {
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

  /**
   *
   * This function starts non-redux pattern
   * SnapShotContainer is in fact renderContainer
   * can we/need we? manage SnapShot store before render
   *
   **/
  static createSnapShotsFromPixiResources(
    resources: PIXI.IResourceDictionary,
  ): Memo[] {
    let store: Memo[] = [];
    for (const resource of Object.values(resources)) {
      const s = new Memo(resource.texture);
      store.push(s);
    }
    return store;
  }
}
