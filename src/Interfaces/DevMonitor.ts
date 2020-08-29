import { IUniScreenCoords } from './Viewport';

type StreamMessage = string;
type Monitor = 'stageEvents' | 'viewportEvents' | 'memoEvents';

interface IMonitorStreams {
  [key: string]: MonitoringStream;
}

export default class DevMonitor {
  eventMonitorDiv: HTMLElement;
  eventMonitorStreams: IMonitorStreams;

  constructor() {
    this.eventMonitorStreams = {};

    this.eventMonitorDiv = this.createEventMonitorDiv();
    // TODO: display viewport params: move, w, h, center, corner, zoom %, scale

    window.document.body.appendChild(this.eventMonitorDiv);
  }

  createEventMonitorDiv() {
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

  createDevMonitorElement(title: string): HTMLElement {
    const section = document.createElement('section');
    section.id = title;
    section.classList.add('event-monitor-section');
    section.innerHTML = `<div class="header"><h2>${title}</h2></div>`;
    return section;
  }

  addDevMonitor(title: string) {
    const mStream = new MonitoringStream(title);
    const mSection = this.createDevMonitorElement(title);
    mStream.initStreamUiContainer(mSection);
    this.eventMonitorDiv.appendChild(mSection);
    this.eventMonitorStreams[title] = mStream;
  }

  dispatchMonitor(monitor: Monitor, eventType: string, eventMsg: string) {
    this.eventMonitorStreams[monitor].addStreamMessage(eventType, eventMsg);
    this.eventMonitorStreams[monitor].updateStreamView();
  }

  pointToStr(point: IUniScreenCoords) {
    let x = 0;
    let y = 0;

    if (point.sX !== undefined && point.sY !== undefined) {
      x = point.sX;
      y = point.sY;
    }

    if (point.wX !== undefined && point.wY !== undefined) {
      x = point.wX;
      y = point.wY;
    }

    if (point.x !== undefined && point.y !== undefined) {
      x = point.x;
      y = point.y;
    }

    return `${Math.round(x)} : ${Math.round(y)}`;
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
