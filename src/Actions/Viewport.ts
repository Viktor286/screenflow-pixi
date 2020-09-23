import FlowApp from '../Interfaces/FlowApp';
import { IWorldScreenCoords } from '../Interfaces/Viewport';

export default class ViewportActions {
  runAheadZoomIn: number;
  runAheadZoomOut: number;

  constructor(public app: FlowApp) {
    this.runAheadZoomIn = 0;
    this.runAheadZoomOut = 0;
  }

  moveTo(target: IWorldScreenCoords, targetScale?: number) {
    this.app.stateManager.setState('camera', {
      animation: this.app.viewport.cameraPropsConversion(target, targetScale),
    });
  }

  zoomIn(zoomPoint?: IWorldScreenCoords) {
    if (this.runAheadZoomIn > 1) this.runAheadZoomIn = 1;

    this.app.stateManager.setState('camera', {
      animation: this.app.viewport.cameraPropsConversion(
        zoomPoint,
        this.app.viewport.getNextScaleStepUp(this.runAheadZoomIn),
      ),
    });

    this.runAheadZoomIn += 1;

    setTimeout(() => {
      this.runAheadZoomIn -= 1;
      if (this.runAheadZoomIn < 0) this.runAheadZoomIn = 0;
    }, 700);
  }

  zoom100(zoomPoint?: IWorldScreenCoords) {
    const scale = 1;

    this.app.stateManager.setState('camera', {
      animation: this.app.viewport.cameraPropsConversion(zoomPoint, scale),
    });
  }

  zoomOut(zoomPoint?: IWorldScreenCoords) {
    if (this.runAheadZoomOut > 1) this.runAheadZoomOut = 1;

    this.app.stateManager.setState('camera', {
      animation: this.app.viewport.cameraPropsConversion(
        zoomPoint,
        this.app.viewport.getNextScaleStepDown(this.runAheadZoomOut),
      ),
    });

    this.runAheadZoomOut += 1;

    setTimeout(() => {
      this.runAheadZoomOut -= 1;
      if (this.runAheadZoomOut < 0) this.runAheadZoomOut = 0;
    }, 700);
  }
}
