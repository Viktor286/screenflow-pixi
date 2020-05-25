import { SnapShotContainer } from './SnapShot';
import { PixiEngine } from './PixiEngine';

interface AppState {
  snapshots: {
    store: SnapShotContainer[];
    active: SnapShotContainer[];
  };
}

export default class App {
  state: AppState;
  engine: PixiEngine;

  constructor(mainEngine: PixiEngine) {
    this.engine = mainEngine;

    this.state = {
      snapshots: {
        store: [],
        active: [],
      },
    };
  }
}
