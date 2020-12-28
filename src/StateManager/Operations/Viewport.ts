import FlowApp from '../../Interfaces/FlowApp';
import { IPublicCameraState } from '../../Interfaces/Viewport';
import Helpers from '../Helpers';

export default class ViewportOperations {
  constructor(public app: FlowApp) {}

  // todo: it looks like polymorphic api messing things here and it would be simpler just have diff methods
  //  We can use Pick<Type, Keys>, Omit<Type, Keys>, or Partial<Type>
  //  https://www.typescriptlang.org/docs/handbook/utility-types.html
  updateCamera(property: string, value: number | IPublicCameraState) {
    // // Run animation with another postponed state update at animation end
    if (Helpers.isAnimationObject(property, value)) {
      // asyncCameraAnimationOperation
      this.app.viewport
        .animateCamera(value as IPublicCameraState)
        .then((cameraProps) => this.app.stateManager.setState('camera', cameraProps));
      // we can set "animation in progress" here
      return true;
    }

    // TODO: solve problem with animation in-progress sequence overlaps with state update request
    // Apply external operation
    // this.app.viewport[property] = updateValue;

    // Always return original updateValue
    return value;
  }
}
