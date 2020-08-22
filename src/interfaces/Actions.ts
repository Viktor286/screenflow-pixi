import FlowApp from './FlowApp';
import { WordScreenCoords } from './Viewport';

export class Actions {
  constructor(public app: FlowApp) {}

  viewportMoveCamera(targetPoint?: WordScreenCoords, targetScale?: number) {
    if (!targetPoint) {
      targetPoint = this.app.viewport.getScreeCenterInWord();
    }

    if (!targetScale) {
      targetScale = this.app.viewport.instance.scale.x;
    }

    this.app.viewport.animations.moveCameraTo(targetPoint, targetScale);
  }

  viewportMoveTo(target: WordScreenCoords) {
    this.viewportMoveCamera(target);
  }

  viewportZoomIn(zoomPoint?: WordScreenCoords) {
    const currentZoom = this.app.viewport.instance.scale.x;
    this.viewportMoveCamera(zoomPoint, currentZoom + 0.5);
  }

  viewportZoom100(zoomPoint?: WordScreenCoords) {
    this.viewportMoveCamera(zoomPoint, 1);
  }

  viewportZoomOut(zoomPoint?: WordScreenCoords) {
    const currentZoom = this.app.viewport.instance.scale.x;
    this.viewportMoveCamera(zoomPoint, currentZoom - 0.5);
  }
}
