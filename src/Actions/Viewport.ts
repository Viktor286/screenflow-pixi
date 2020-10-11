import FlowApp from '../Interfaces/FlowApp';
import { IWorldCoords } from '../Interfaces/Viewport';

export default class ViewportActions {
  private runAheadZoomIn = 0;
  private runAheadZoomOut = 0;

  constructor(public app: FlowApp) {}

  public fitToBoard() {
    const { x: wX, y: wY, width, height } = this.app.viewport.instance.getLocalBounds();
    this.app.actions.viewport.fitToArea({ wX: wX + width / 2, wY: wY + height / 2 }, width, height);
  }

  public fitToArea(targetPoint: IWorldCoords, width: number, height: number) {
    const targetScale = this.app.viewport.findScaleFit(width, height);

    this.app.stateManager.setState('camera', {
      animation: this.app.viewport.cameraPropsConversion(
        targetPoint,
        targetScale - (targetScale / 100) * this.app.viewport.fitAreaMarginPercent,
      ),
    });
  }

  public moveTo(target: IWorldCoords, targetScale?: number) {
    this.app.stateManager.setState('camera', {
      animation: this.app.viewport.cameraPropsConversion(target, targetScale),
    });
  }

  public zoomIn(zoomPoint?: IWorldCoords) {
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

  public zoom100(zoomPoint?: IWorldCoords) {
    const scale = 1;

    this.app.stateManager.setState('camera', {
      animation: this.app.viewport.cameraPropsConversion(zoomPoint, scale),
    });
  }

  public zoomOut(zoomPoint?: IWorldCoords) {
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

  public amendCameraState() {
    const { x, y, cwX, cwY, scale } = this.app.viewport;
    this.app.stateManager.setState('camera', {
      amend: {
        x,
        y,
        cwX,
        cwY,
        scale,
      },
    });
  }
}
