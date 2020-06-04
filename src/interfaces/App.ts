import { PixiEngine } from './PixiEngine';
import SnapShotContainer from './SnapShotContainer';

interface ISnapshots {
  list: SnapShotContainer[];
  selected: SnapShotContainer[];
}

export default class App {
  snapshots: ISnapshots;
  engine: PixiEngine;

  constructor(mainEngine: PixiEngine) {
    this.engine = mainEngine;

    this.snapshots = {
      list: [],
      selected: [],
    };
  }

  /** Install snapshots in list and viewport **/
  addSnapshots(snapshot: SnapShotContainer | SnapShotContainer[]) {
    if (!Array.isArray(snapshot)) {
      snapshot = [snapshot];
    }

    snapshot.forEach((snapshotContainer) => {
      this.snapshots.list.push(snapshotContainer);
      snapshotContainer.snapshot.parentList = this.snapshots.list;
      snapshotContainer.interactive = true;
      this.engine.addToViewport(snapshot);
    });
  }
}
