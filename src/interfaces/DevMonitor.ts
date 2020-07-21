type StreamMessage = string;
type Monitor = 'stageEvents' | 'viewportEvents' | 'memoEvents';

interface IMonitors {
  [key: string]: MonitoringStream;
}

export default class DevMonitor {
  htmlHost: HTMLElement;
  monitors: IMonitors;

  constructor() {
    this.monitors = {};

    this.htmlHost = document.createElement('div');
    this.htmlHost.id = 'DevMonitor';
    this.htmlHost.style.width = '100%';
    this.htmlHost.style.position = 'absolute';
    this.htmlHost.style.bottom = '0';
    this.htmlHost.style.background = '#16171c';
    this.htmlHost.style.color = '#91b6e3';
    this.htmlHost.style.fontSize = '12px';
    this.htmlHost.style.maxHeight = '50vh';
    this.htmlHost.style.display = 'flex';
    this.htmlHost.style.justifyContent = 'space-around';
    this.htmlHost.style.zIndex = '9999'; // TODO: Inspect z-indexes

    window.document.body.appendChild(this.htmlHost);

    console.log('this.htmlHost', this.htmlHost);
  }

  createDevMonitorElement(title: string): HTMLElement {
    const section = document.createElement('section');
    section.id = title;
    section.classList.add('dev-monitor-section');
    section.innerHTML = `<div class="header"><h2>${title}</h2></div>`;
    return section;
  }

  addDevMonitor(title: string) {
    const mStream = new MonitoringStream(title);
    const mSection = this.createDevMonitorElement(title);
    mStream.initStreamUiContainer(mSection);
    this.htmlHost.appendChild(mSection);
    this.monitors[title] = mStream;
  }

  dispatchMonitor(monitor: Monitor, eventType: string, eventMsg: string) {
    this.monitors[monitor].addStreamMessage(eventType, eventMsg);
    this.monitors[monitor].updateStreamView();
  }
}

class MonitoringStream {
  Stream: StreamMessage[];
  StreamMsgLimit: number;
  viewContainer: HTMLElement | null;

  constructor(public title: string) {
    this.Stream = [];
    this.viewContainer = null;
    this.StreamMsgLimit = 20;
  }

  formatStreamMessage(type: string, msg: string) {
    const now = new Date();
    const timestamp = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    return `${timestamp} <span class="e-type">${type}</span> ${msg}`;
  }

  addStreamMessage(type: string, msg: string) {
    this.Stream.push(this.formatStreamMessage(type, msg));
    if (this.Stream.length > this.StreamMsgLimit) {
      this.Stream.shift();
    }
  }

  initStreamUiContainer(targetElement: HTMLElement) {
    this.viewContainer = document.createElement('div');
    this.viewContainer.classList.add('stream');
    targetElement.appendChild(this.viewContainer);
  }

  updateStreamView() {
    if (this.viewContainer !== null) {
      this.viewContainer.innerHTML = this.Stream.join('<br />');
    }
  }
}
