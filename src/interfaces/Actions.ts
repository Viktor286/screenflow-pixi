import FlowApp from './FlowApp';
import { WordScreenCoords } from './Viewport';

export class Actions {
  constructor(public app: FlowApp) {}

  viewportMoveCamera(targetPoint?: WordScreenCoords, targetScale?: number) {
    if (!targetPoint) {
      targetPoint = this.app.viewport.getScreeCenterInWord();
    }

    if (targetScale === undefined) {
      targetScale = this.app.viewport.instance.scale.x;
    }

    this.app.viewport.animations.moveCameraTo(targetPoint, targetScale);
  }

  viewportMoveTo(target: WordScreenCoords) {
    this.viewportMoveCamera(target);
  }

  viewportZoomIn(zoomPoint?: WordScreenCoords) {
    this.viewportMoveCamera(zoomPoint, this.app.viewport.getNextScaleStepUp());
  }

  viewportZoom100(zoomPoint?: WordScreenCoords) {
    this.viewportMoveCamera(zoomPoint, 1);
  }

  viewportZoomOut(zoomPoint?: WordScreenCoords) {
    this.viewportMoveCamera(zoomPoint, this.app.viewport.getNextScaleStepDown());
  }

  updateZoomBtn() {
    this.app.webUi.zoom100Btn.innerHTML = this.app.viewport.getZoom();
  }
}
