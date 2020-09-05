import FlowApp from '../Interfaces/FlowApp';
import { IWorldScreenCoords } from '../Interfaces/Viewport';

export default class ViewportActions {
  runAheadZoomIn: number;
  runAheadZoomOut: number;

  constructor(public app: FlowApp) {
    this.runAheadZoomIn = 0;
    this.runAheadZoomOut = 0;
  }

  viewportMoveTo(target: IWorldScreenCoords) {
    const cameraProps = this.app.viewport.cameraPropsConversion(target);
    this.app.stateManager.setState('camera', { animation: cameraProps });
  }

  viewportZoomIn(zoomPoint?: IWorldScreenCoords) {
    if (this.runAheadZoomIn > 1) this.runAheadZoomIn = 1;

    const scale = this.app.viewport.getNextScaleStepUp(this.runAheadZoomIn);
    const cameraProps = this.app.viewport.cameraPropsConversion(zoomPoint, scale);

    this.app.stateManager.setState('camera', { animation: cameraProps });

    this.runAheadZoomIn += 1;

    setTimeout(() => {
      this.runAheadZoomIn -= 1;
      if (this.runAheadZoomIn < 0) this.runAheadZoomIn = 0;
    }, 700);
  }

  viewportZoom100(zoomPoint?: IWorldScreenCoords) {
    const scale = 1;
    const cameraProps = this.app.viewport.cameraPropsConversion(zoomPoint, scale);

    this.app.stateManager.setState('camera', { animation: cameraProps });
  }

  viewportZoomOut(zoomPoint?: IWorldScreenCoords) {
    if (this.runAheadZoomOut > 1) this.runAheadZoomOut = 1;

    const scale = this.app.viewport.getNextScaleStepDown(this.runAheadZoomOut);
    const cameraProps = this.app.viewport.cameraPropsConversion(zoomPoint, scale);

    this.app.stateManager.setState('camera', { animation: cameraProps });

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
