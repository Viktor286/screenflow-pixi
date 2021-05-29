import { CgContainer } from './CgContainer';

export class CgStage extends CgContainer {
  constructor(public stageRoot: CgContainer['cgObj']) {
    super(stageRoot);
  }
}
