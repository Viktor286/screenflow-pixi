import GraphicsEngine from './GraphicsEngine';
import Viewport from './Viewport';
import StageEvents from './InteractionEvents/StageEvents';
import DevMonitor from './DevMonitor';
import Memos from './Memos';
import WebUI from './WebUI';
import GUI from './GUI';
import ViewportActions from '../Actions/Viewport';
import StateManager from './StateManager';

export default class FlowApp {
  engine: GraphicsEngine;
  hostHTML: HTMLElement;
  viewport: Viewport;
  devMonitor: DevMonitor | null; // TODO: replace for "Debug" with included prod logic
  memos: Memos;
  gui: GUI;
  webUi: WebUI;
  actions: ViewportActions;
  stageEvents: StageEvents;
  stateManager: StateManager;

  constructor(targetDiv: HTMLElement) {
    this.hostHTML = targetDiv;
    this.engine = new GraphicsEngine(this);
    // this.devMonitor = new DevMonitor();
    this.devMonitor = null;
    this.stageEvents = new StageEvents(this);
    this.viewport = new Viewport(this);
    this.memos = new Memos(this);
    this.actions = new ViewportActions(this);
    this.stateManager = new StateManager(this);
    this.gui = new GUI(this);
    this.webUi = new WebUI(this);

    console.log('FlowApp', this);
  }

  get hostHTMLWidth() {
    return this.hostHTML.clientWidth;
  }

  get hostHTMLHeight() {
    return this.hostHTML.clientHeight;
  }
}
