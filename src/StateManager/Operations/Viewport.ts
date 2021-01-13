import FlowApp from '../../Interfaces/FlowApp';
import Viewport, { IPublicViewportState } from '../../Interfaces/Viewport';
import { AsyncId } from './Async';
import { StateUpdateRequest } from '../StateUpdateRequest';

export default class ViewportOperations {
  constructor(public app: FlowApp) {}

  get originState() {
    return this.app.viewport.publicViewportState;
  }

  animate(stateUpdate: StateUpdateRequest, asyncId: AsyncId) {
    this.app.viewport
      .animateViewport(stateUpdate.slice as IPublicViewportState)
      .then((viewportProps) =>
        this.app.stateManager.setState('viewport', viewportProps, { async: 'animated', asyncId }),
      );
  }

  update(
    property: Extract<keyof Viewport, string>,
    value: IPublicViewportState[keyof IPublicViewportState],
    stateUpdate: StateUpdateRequest,
  ) {
    if (Object.prototype.hasOwnProperty.call(this.app.viewport, property)) {
      this.app.viewport[property] = value;
    }
    return value;
  }
}
