import { CgEngine, CgInteractiveContainer } from './GraphicsEngine';
// // import StageEvents from './InteractionEvents/StageEvents';
// import Keyboard from './InteractionEvents/Keyboard';
import DevMonitor from './DevMonitor';
// import Board from './Board';
// import WebUI from './WebUI';
import GUI from './GUI';
// import StateManager from '../StateManager';
// import Project from './Project';
import { CgViewport } from './GraphicsEngine/Extended/Viewport/CgViewport';
import * as PIXI from 'pixi.js'; // temp object

declare global {
  interface Window {
    app: FlowApp;
    automationScreenshot: string | undefined;
    performance: {
      now(): number;
    };
  }
}

export default class FlowApp {
  public readonly engine: CgEngine;
  public readonly hostHTML: HTMLElement;
  public readonly cgSceneRoot: CgInteractiveContainer;
  public readonly viewport: CgViewport;
  public readonly devMonitor: DevMonitor | null; // TODO: replace for "Debug" with included prod logic
  // public readonly board: Board;
  public readonly gui: GUI;
  // public readonly webUi: WebUI;
  // // public readonly stageEvents: StageEvents;
  // public readonly stateManager: StateManager;
  // public readonly project: Project;
  // public readonly keyboard: Keyboard;
  public readonly env: string | undefined;

  constructor(targetDiv: HTMLElement) {
    this.env = process.env.NODE_ENV;

    this.hostHTML = targetDiv;
    this.engine = new CgEngine();
    this.hostHTML.appendChild(this.engine.view);
    this.cgSceneRoot = new CgInteractiveContainer(this.engine.stage);

    this.viewport = new CgViewport(this);
    this.cgSceneRoot.prependElement(this.viewport);

    // temp object
    const sprite = this.viewport.cgObj.addChild(new PIXI.Sprite(PIXI.Texture.WHITE));
    sprite.tint = 0xff0000;
    sprite.width = sprite.height = 100;
    sprite.position.set(100, 100);

    // this.devMonitor = new DevMonitor();
    this.devMonitor = null;
    // this.stageEvents = new StageEvents(this);
    //
    // this.engine.addDisplayObject(this.viewport.instance);
    // this.board = new Board(this);
    // this.stateManager = new StateManager(this);
    // this.project = new Project(this);
    this.gui = new GUI(this);
    // this.webUi = new WebUI(this);
    // this.keyboard = new Keyboard(this);

    if (this.env !== 'production') {
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
