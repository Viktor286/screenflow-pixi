import FlowApp from './FlowApp';

export class WebUi {
  webUi: HTMLElement;
  zoomInBtn: HTMLElement;
  zoomOutBtn: HTMLElement;
  zoom100Btn: HTMLElement;
  zoomIndicator: HTMLElement;

  constructor(public app: FlowApp) {
    this.webUi = document.createElement('div');

    Object.assign(this.webUi.style, this.styles.mainContainer);

    this.zoomOutBtn = this.initZoomOutBtn();
    this.webUi.appendChild(this.zoomOutBtn);

    this.zoom100Btn = this.initZoom100Btn();
    this.webUi.appendChild(this.zoom100Btn);

    this.zoomIndicator = this.iniZoomIndicator();
    this.zoom100Btn.appendChild(this.zoomIndicator);

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
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '3vw',
        height: '3vw',
        margin: '0 4px',
        opacity: '.6',
        color: 'white',
        borderRadius: '.5rem',
        background: '#395062',
        border: '1px solid #5f9ae2',
        cursor: 'pointer',
        '-webkit-touch-callout': 'none',
        userSelect: 'none',
        '-webkit-user-select': 'none',
        '-moz-user-select': 'none',
        '-ms-user-select': 'none',
      },
      buttonIcon: {
        padding: 0,
        margin: 0,
        height: '1vw',
        fontSize: '2vw',
        textAlign: 'center',
        // background: 'blue',
        lineHeight: 0,
        transform: 'translateY(40%)',
        userSelect: 'none',
        '-webkit-user-select': 'none',
        '-moz-user-select': 'none',
        '-ms-user-select': 'none',
      },
    };
  }

  initZoomOutBtn = () => {
    const zoomBtn = document.createElement('div');
    const elmIcon = document.createElement('div');

    elmIcon.classList.add('icon');
    elmIcon.innerHTML = '-';
    Object.assign(elmIcon.style, this.styles.buttonIcon);
    zoomBtn.appendChild(elmIcon);

    Object.assign(zoomBtn.style, this.styles.squareButton);

    zoomBtn.addEventListener('click', () => {
      this.app.actions.viewportZoomOut();
    });

    return zoomBtn;
  };

  iniZoomIndicator = () => {
    const elmIcon = document.createElement('div');
    elmIcon.classList.add('icon');
    elmIcon.innerHTML = this.app.viewport.getZoom();
    Object.assign(elmIcon.style, { ...this.styles.buttonIcon, fontSize: '1.3vw' });
    return elmIcon;
  };

  initZoom100Btn = () => {
    const zoomBtn = document.createElement('div');
    Object.assign(zoomBtn.style, { ...this.styles.squareButton, width: '3.5vw' });

    zoomBtn.addEventListener('click', () => {
      this.app.actions.viewportZoom100();
    });

    return zoomBtn;
  };

  initZoomInBtn = () => {
    const zoomBtn = document.createElement('div');
    const elmIcon = document.createElement('div');

    elmIcon.classList.add('icon');
    elmIcon.innerHTML = '+';
    Object.assign(elmIcon.style, this.styles.buttonIcon);
    zoomBtn.appendChild(elmIcon);

    Object.assign(zoomBtn.style, this.styles.squareButton);

    zoomBtn.addEventListener('click', () => {
      this.app.actions.viewportZoomIn();
    });

    return zoomBtn;
  };
}
