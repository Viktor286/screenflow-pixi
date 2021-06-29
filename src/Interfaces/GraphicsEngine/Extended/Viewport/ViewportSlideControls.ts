import FlowApp from '../../../FlowApp';
import { CgViewport } from './CgViewport';

// TODO: how to
export default class ViewportSlideControls {
  public activated = false;
  public isSliding = false;
  private moveEndTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(public app: FlowApp, public viewport: CgViewport) {}

  public installSlideControls() {
    this.viewport.pixiViewport
      .drag()
      .pinch({
        noDrag: true,
      })
      .wheel()
      .decelerate({
        friction: 0.95,
        bounce: 0.8,
        minSpeed: 0.05,
      })
      .clampZoom({
        minScale: this.viewport.zoomScales.steps[0],
        maxScale: this.viewport.zoomScales.steps[this.viewport.zoomScales.steps.length - 1],
      });

    // Both "moved-end" and 'zoomed-end' events have not stable debounce, firing often than should be.
    // It was decided to use only 'moved' callback for everything
    this.viewport.pixiViewport.on('moved', this.onSliderMoved);
    this.viewport.pixiViewport.on('zoomed', this.onSliderZoomed);
    this.activated = true;
  }

  public uninstallSlideControls() {
    this.viewport.pixiViewport.plugins.remove('drag');
    this.viewport.pixiViewport.plugins.remove('pinch');
    this.viewport.pixiViewport.plugins.remove('wheel');

    this.viewport.pixiViewport.off('moved', this.onSliderMoved);
    this.viewport.pixiViewport.off('zoomed', this.onSliderZoomed);

    this.activated = false;
  }

  public pauseSlideControls() {
    this.viewport.pixiViewport.plugins.pause('drag');
    this.viewport.pixiViewport.plugins.pause('pinch');
    this.viewport.pixiViewport.plugins.pause('wheel');
    this.activated = false;
  }

  public unpauseSlideControls() {
    this.viewport.pixiViewport.plugins.resume('drag');
    this.viewport.pixiViewport.plugins.resume('pinch');
    this.viewport.pixiViewport.plugins.resume('wheel');
    this.activated = true;
  }

  private onSliderMoved = () => {
    if (!this.isSliding) {
      this.isSliding = true;
    }

    if (this.moveEndTimer) {
      clearTimeout(this.moveEndTimer);
    }

    // this.app.gui.stageBackTile.updateGraphics();

    this.moveEndTimer = setTimeout(this.onSliderEnd, 300); // lower than 300 values start throw doubles
  };

  private onSliderEnd = () => {
    setTimeout(() => {
      this.isSliding = false;
    }, 200);
  };

  private onSliderZoomed = () => {
    // if (
    //   this.app.viewport.scale < this.viewport.zoomScales.steps[this.viewport.zoomScales.steps.length - 1] &&
    //   this.app.viewport.scale > this.viewport.zoomScales.steps[0]
    // ) {
    //   this.app.board.updateSelectionGraphics();
    //   this.app.webUi.updateZoomBtn();
    // }
  };
}
