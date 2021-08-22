import FlowApp from '../../../FlowApp';
import { CgInteractiveContainer, IScreenCoords, IWorldCoords } from '../../index';
import { Viewport as PixiViewport } from 'pixi-viewport';
import ViewportSlideControls from './ViewportSlideControls';
import ViewportZoomScales from './ViewportZoomScales';
// import { StageEvent } from '../../../InteractionEvents/StageEvents';
import { gsap } from 'gsap';

export type CgViewportEvents = 'viewportUpdate';

interface IEventList {
  [CgViewportEvents: string]: Function[];
}

interface IViewportUpdateEvent {
  scaleX: number;
  scaleY: number;
}

export class CgViewport extends CgInteractiveContainer {
  public readonly pixiViewport: PixiViewport;
  public readonly slideControls: ViewportSlideControls;
  public readonly zoomScales = new ViewportZoomScales();
  private eventList: IEventList = { viewportUpdate: [] };

  constructor(
    public app: FlowApp,
    public cgObj = new PixiViewport({
      screenWidth: 300,
      screenHeight: 300,
      worldWidth: 300,
      worldHeight: 300,
    }),
  ) {
    super(cgObj);

    this.pixiViewport = this.cgObj; // alias for plugin usage visibility

    this.slideControls = new ViewportSlideControls(this.app, this);
    this.slideControls.installSlideControls();

    this.pixiViewport.on('moved', () => {
      this.triggerEvent('viewportUpdate');
    });
  }

  public addEventListener(eventType: CgViewportEvents, cb: Function) {
    if (eventType === 'viewportUpdate') {
      this.eventList.viewportUpdate.push(cb);
    }
  }

  private triggerEvent(eventType: CgViewportEvents) {
    if (this.eventList.hasOwnProperty(eventType)) {
      if (eventType === 'viewportUpdate') {
        this.eventList[eventType].forEach((cb) => {
          const e: IViewportUpdateEvent = {
            scaleX: this.scaleX,
            scaleY: this.scaleY,
          };
          cb(e);
        });
      }
    }
  }

  set screenWidth(val: number) {
    this.pixiViewport.screenWidth = val;
  }

  get screenWidth() {
    return this.pixiViewport.screenWidth;
  }

  set screenHeight(val: number) {
    this.pixiViewport.screenHeight = val;
  }

  get screenHeight() {
    return this.pixiViewport.screenHeight;
  }

  // public getScreenCoordsFromEvent(e: StageEvent): IScreenCoords {
  //   return { sX: e.data.global.x, sY: e.data.global.y };
  // }
  //
  // public getWorldScreenCoordsFromEvent(e: StageEvent): IWorldCoords {
  //   const screenClick: IScreenCoords = this.getScreenCoordsFromEvent(e);
  //   return this.screenToWorld(screenClick);
  // }

  // public addToViewport(displayObject: PIXI.DisplayObject, index: number = 0): PIXI.DisplayObject {
  //   return this.instance.addChildAt(displayObject, index);
  // }

  // public addBoardElementToViewport(boardElement: BoardElement): void {
  //   this.instance.addChildAt(boardElement.cgObj, 0);
  // }

  // public removeFromViewport(displayObject: PIXI.DisplayObject): PIXI.DisplayObject {
  //   return this.instance.removeChild(displayObject);
  // }

  public getZoomString(): string {
    return Math.round(this.x * 100).toString();
  }

  public screenToWorld({ sX, sY }: IScreenCoords): IWorldCoords {
    const { x: wX, y: wY } = this.pixiViewport.toWorld(sX, sY);
    return { wX, wY };
  }

  public screenCenter(): IScreenCoords {
    return { sX: this.screenWidth / 2, sY: this.screenHeight / 2 };
  }

  public worldScreenCenter(): IWorldCoords {
    return { wX: this.pixiViewport.worldScreenWidth / 2, wY: this.pixiViewport.worldScreenHeight / 2 };
  }

  // get center()
  // center of screen in world coordinates = worldScreenWidth / 2 - x / scale

  // get worldScreenWidth()
  // worldScreenWidth = screenWidth / scale

  public getScreenCenterInWord(): IWorldCoords {
    return {
      wX: this.pixiViewport.worldScreenWidth / 2 - this.x / this.scaleX,
      wY: this.pixiViewport.worldScreenHeight / 2 - this.y / this.scaleY,
    };
  }

  public getWorldCoordsFromMouse(): IWorldCoords {
    const { sX, sY } = this.app.engine.getScreenCoordsFromMouse();
    const { x: wX, y: wY } = this.cgObj.toLocal({ x: sX, y: sY }); // TODO: how to isolate toLocal?
    return { wX, wY };
  }

  public findScaleFit(width: number, height: number) {
    return this.pixiViewport.findFit(width, height);
  }

  public viewportPropsConversion(targetPoint?: IWorldCoords, targetScale: number = 1) {
    if (!targetPoint) {
      targetPoint = this.getScreenCenterInWord();
    }

    if (targetScale === undefined) {
      targetScale = this.scaleX;
    }

    if (targetScale >= 32) targetScale = 32;
    if (targetScale <= 0.01) targetScale = 0.01;

    return {
      x: (this.screenWidth / targetScale / 2 - targetPoint.wX) * targetScale,
      y: (this.screenHeight / targetScale / 2 - targetPoint.wY) * targetScale,
      scale: targetScale,
    };
  }

  public animateViewport(viewportProps: Partial<CgViewport>): Promise<Partial<CgViewport>> {
    const { x, y, scaleX } = viewportProps; // TODO: scale or scaleX, have to decided eventually?

    const animateProps = {
      x,
      y,
      scaleX,
    };
    return new Promise((resolve) => {
      gsap.to(this, {
        ...animateProps,
        duration: 0.5,
        ease: 'power3.out',
        onStart: () => {
          // this.interactive = false;
        },
        onUpdate: () => {
          this.app.gui.stageBackTile.updateGraphics();
          // this.app.board.updateSelectionGraphics();
        },
        onComplete: () => {
          // this.interactive = true;
          setTimeout(() => this.onViewportAnimationEnds()); // send exec to next frame
          resolve({ ...animateProps });
        },
      });
    });
  }

  private onViewportAnimationEnds = (): void => {
    // this.app.webUi.updateZoomBtn();
  };
}
