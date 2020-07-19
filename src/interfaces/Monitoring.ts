class MonitoringColumn {
  logStack: String[];
  container: HTMLElement;
  content: HTMLElement;

  constructor(public title: string, public parent: HTMLElement) {
    this.logStack = [];

    this.container = document.createElement('div');

    this.container.id = this.title;
    this.container.innerHTML = `<div class="header"><h2>${this.title}</h2></div>`;

    this.content = document.createElement('div');
    this.content.classList.add('content');

    this.container.appendChild(this.content);
    this.parent.appendChild(this.container);
  }

  addMessage(type: string, textMsg: string) {
    const now = new Date();
    const timestamp = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    this.logStack.push(`${timestamp} <span class="e-type"> | </span> ${textMsg}`);

    if (this.logStack.length > 20) {
      this.logStack.shift();
    }

    this.updateView();
  }

  updateView() {
    this.content.innerHTML = this.logStack.join('<br />');
  }
}

interface IMonitors {
  stageEventMonitor: MonitoringColumn;
  viewportEventMonitor: MonitoringColumn;
  objectEventMonitor: MonitoringColumn;
}

export class InteractionEventsMonitor {
  monitors: IMonitors;
  parentElm: HTMLElement;
  deactivated: boolean;

  constructor() {
    this.deactivated = false;

    const eventsMonitorsDiv = document.createElement('div');
    eventsMonitorsDiv.id = 'uiMonitor';
    this.parentElm = document.body.appendChild(eventsMonitorsDiv);

    this.monitors = {
      stageEventMonitor: new MonitoringColumn('stageEventMonitor', this.parentElm),
      viewportEventMonitor: new MonitoringColumn('viewportEventMonitor', this.parentElm),
      objectEventMonitor: new MonitoringColumn('objectEventMonitor', this.parentElm),
    };
  }

  dispatchEvent(type: string, eventMsg: string) {
    if (this.deactivated) return;

    switch (type) {
      case 'stage':
        this.monitors.stageEventMonitor.addMessage(type, eventMsg);
        break;
      case 'viewport':
        this.monitors.viewportEventMonitor.addMessage(type, eventMsg);
        break;
      case 'object':
        this.monitors.objectEventMonitor.addMessage(type, eventMsg);
        break;
    }
  }
}
