import { SnapShotContainer } from './SnapShot';
import { PixiEngine } from './PixiEngine';

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

  addSnapshots(snapshot: SnapShotContainer | SnapShotContainer[]) {
    if (!Array.isArray(snapshot)) {
      snapshot = [snapshot];
    }

    snapshot.forEach((sp) => {
      this.snapshots.list.push(sp);
      this.engine.addToViewport(snapshot);
    });
  }
}
