import FlowApp from './FlowApp';

export class WebUi {
  webUi: HTMLElement;
  zoomInBtn: HTMLElement;
  zoomOutBtn: HTMLElement;
  zoom100Btn: HTMLElement;

  constructor(public app: FlowApp) {
    this.webUi = document.createElement('div');

    Object.assign(this.webUi.style, this.styles.mainContainer);

    this.zoomOutBtn = this.initZoomOutBtn();
    this.webUi.appendChild(this.zoomOutBtn);

    this.zoom100Btn = this.initZoom100Btn();
    this.webUi.appendChild(this.zoom100Btn);

    this.zoomInBtn = this.initZoomInBtn();
    this.webUi.appendChild(this.zoomInBtn);

    document.body.appendChild(this.webUi);
  }

  get styles() {
    return {
      mainContainer: {
        display: 'flex',
        width: 'auto',
        // background: 'blue',
        left: '50%',
        transform: 'translateX(-50%)',
        margin: '0 auto',
        position: 'absolute',
        justifyContent: 'center',
      },
      squareButton: {
        width: '3vw',
        height: '3vw',
        opacity: '.6',
        lineHeight: '100%',
        fontSize: '1.5rem',
        borderRadius: '.5rem',
        userSelect: 'none',
        '-webkit-touch-callout': 'none',
      },
    };
  }

  initZoomOutBtn = () => {
    const zoomBtn = document.createElement('button');
    zoomBtn.innerHTML = '-';

    Object.assign(zoomBtn.style, this.styles.squareButton);

    zoomBtn.addEventListener('click', () => {
      this.app.actions.viewportZoomOut();
    });

    return zoomBtn;
  };

  initZoom100Btn = () => {
    const zoomBtn = document.createElement('button');
    zoomBtn.innerHTML = this.app.viewport.getZoom();

    Object.assign(zoomBtn.style, { ...this.styles.squareButton, width: '3.5vw', fontSize: '.9rem' });

    zoomBtn.addEventListener('click', () => {
      this.app.actions.viewportZoom100();
    });

    return zoomBtn;
  };

  initZoomInBtn = () => {
    const zoomBtn = document.createElement('button');
    zoomBtn.innerHTML = '+';

    Object.assign(zoomBtn.style, this.styles.squareButton);

    zoomBtn.addEventListener('click', () => {
      this.app.actions.viewportZoomIn();
    });

    return zoomBtn;
  };
}
