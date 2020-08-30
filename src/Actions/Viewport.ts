import FlowApp from '../Interfaces/FlowApp';
import { IWorldScreenCoords } from '../Interfaces/Viewport';

export default class ViewportActions {
  runAheadZoomIn: number;
  runAheadZoomOut: number;

  constructor(public app: FlowApp) {
    this.runAheadZoomIn = 0;
    this.runAheadZoomOut = 0;
  }

  viewportMoveCamera(targetPoint?: IWorldScreenCoords, targetScale?: number) {
    if (!targetPoint) {
      targetPoint = this.app.viewport.getScreeCenterInWord();
    }

    if (targetScale === undefined) {
      targetScale = this.app.viewport.scale;
    }

    // TODO: remove
    // this.app.viewport.animations.moveCameraTo(targetPoint, targetScale);
    this.app.camera.moveCameraTo(targetPoint, targetScale);
  }

  viewportMoveTo(target: IWorldScreenCoords) {
    this.viewportMoveCamera(target);
  }

  viewportZoomIn(zoomPoint?: IWorldScreenCoords) {
    if (this.runAheadZoomIn > 1) this.runAheadZoomIn = 1;

    this.viewportMoveCamera(zoomPoint, this.app.viewport.getNextScaleStepUp(this.runAheadZoomIn));
    this.runAheadZoomIn += 1;

    setTimeout(() => {
      this.runAheadZoomIn -= 1;
      if (this.runAheadZoomIn < 0) this.runAheadZoomIn = 0;
    }, 700);
  }

  viewportZoom100(zoomPoint?: IWorldScreenCoords) {
    this.viewportMoveCamera(zoomPoint, 1);
  }

  viewportZoomOut(zoomPoint?: IWorldScreenCoords) {
    if (this.runAheadZoomOut > 1) this.runAheadZoomOut = 1;

    this.viewportMoveCamera(zoomPoint, this.app.viewport.getNextScaleStepDown(this.runAheadZoomOut));
    this.runAheadZoomOut += 1;

    setTimeout(() => {
      this.runAheadZoomOut -= 1;
      if (this.runAheadZoomOut < 0) this.runAheadZoomOut = 0;
    }, 700);
  }

  updateZoomBtn() {
    this.app.webUi.zoomIndicator.innerHTML = this.app.viewport.getZoom();
  }
}
