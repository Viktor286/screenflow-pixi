type StreamMessage = string;
type Monitor = 'stageEvents' | 'viewportEvents' | 'boardEvents';

interface IMonitorStreams {
  [key: string]: MonitoringStream;
}

export default class DevMonitor {
  private readonly eventMonitorDiv: HTMLElement = DevMonitor.createEventMonitorDiv();
  private readonly eventMonitorStreams: IMonitorStreams = {};

  constructor() {
    // TODO: display viewport params: move, w, h, center, corner, zoom %, scale

    window.document.body.appendChild(this.eventMonitorDiv);
  }

  private static createEventMonitorDiv() {
    const div = document.createElement('div');
    div.id = 'EventMonitor';
    div.style.width = '100%';
    div.style.position = 'absolute';
    div.style.bottom = '0';
    div.style.background = '#16171c';
    div.style.opacity = '0.65';
    div.style.color = '#91b6e3';
    div.style.fontSize = '12px';
    div.style.maxHeight = '50vh';
    div.style.display = 'flex';
    div.style.justifyContent = 'space-around';
    div.style.zIndex = '9999'; // TODO: Inspect z-indexes
    return div;
  }

  private static createDevMonitorElement(title: string): HTMLElement {
    const section = document.createElement('section');
    section.id = title;
    section.classList.add('event-monitor-section');
    section.innerHTML = `<div class="header"><h2>${title}</h2></div>`;
    return section;
  }

  public addDevMonitor(title: string) {
    const mStream = new MonitoringStream(title);
    const mSection = DevMonitor.createDevMonitorElement(title);
    mStream.initStreamUiContainer(mSection);
    this.eventMonitorDiv.appendChild(mSection);
    this.eventMonitorStreams[title] = mStream;
  }

  public dispatchMonitor(monitor: Monitor, eventType: string, eventMsg: string) {
    this.eventMonitorStreams[monitor].addStreamMessage(eventType, eventMsg);
    this.eventMonitorStreams[monitor].updateStreamView();
  }
}

class MonitoringStream {
  Stream: StreamMessage[] = [];
  StreamMsgLimit: number = 20;
  viewContainer: HTMLElement | null = null;

  constructor(public title: string) {}

  private static formatStreamMessage(type: string, msg: string) {
    const now = new Date();
    const timestamp = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    return `${timestamp} <span class="e-type">${type}</span> ${msg}`;
  }

  public addStreamMessage(type: string, msg: string) {
    this.Stream.push(MonitoringStream.formatStreamMessage(type, msg));
    if (this.Stream.length > this.StreamMsgLimit) {
      this.Stream.shift();
    }
  }

  public initStreamUiContainer(targetElement: HTMLElement) {
    this.viewContainer = document.createElement('div');
    this.viewContainer.classList.add('stream');
    targetElement.appendChild(this.viewContainer);
  }

  public updateStreamView() {
    if (this.viewContainer !== null) {
      this.viewContainer.innerHTML = this.Stream.join('<br />');
    }
  }
}
