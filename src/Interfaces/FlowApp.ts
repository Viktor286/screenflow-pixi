import GraphicsEngine from './GraphicsEngine';
import Viewport from './Viewport';
import StageEvents from './InteractionEvents/StageEvents';
import DevMonitor from './DevMonitor';
import Board from './Board';
import WebUI from './WebUI';
import GUI from './GUI';
import StateManager from './StateManager';
import Actions from '../Actions';

export default class FlowApp {
  public readonly engine: GraphicsEngine;
  public readonly hostHTML: HTMLElement;
  public readonly viewport: Viewport;
  public readonly devMonitor: DevMonitor | null; // TODO: replace for "Debug" with included prod logic
  public readonly board: Board;
  public readonly gui: GUI;
  public readonly webUi: WebUI;
  public readonly actions: Actions;
  public readonly stageEvents: StageEvents;
  public readonly stateManager: StateManager;
  public readonly env: string | undefined;

  constructor(targetDiv: HTMLElement) {
    this.env = process.env.NODE_ENV;
    this.hostHTML = targetDiv;
    this.engine = new GraphicsEngine(this);
    // this.devMonitor = new DevMonitor();
    this.devMonitor = null;
    this.stageEvents = new StageEvents(this);
    this.viewport = new Viewport(this);
    this.board = new Board(this);
    this.actions = new Actions(this);
    this.stateManager = new StateManager(this);
    this.gui = new GUI(this);
    this.webUi = new WebUI(this);

    if (this.env !== 'production') {
      // @ts-ignore
      window.app = this;
    }
  }

  get hostHTMLWidth() {
    return this.hostHTML.clientWidth;
  }

  get hostHTMLHeight() {
    return this.hostHTML.clientHeight;
  }
}
