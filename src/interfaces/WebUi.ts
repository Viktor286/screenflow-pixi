import FlowApp from './FlowApp';

export class WebUi {
  webUi: HTMLElement;
  zoomInBtn: HTMLElement;
  zoomOutBtn: HTMLElement;

  constructor(public app: FlowApp) {
    this.webUi = document.createElement('div');

    Object.assign(this.webUi.style, this.styles.mainContainer);

    this.zoomOutBtn = this.initZoomOutBtn();
    this.webUi.appendChild(this.zoomOutBtn);

    this.zoomInBtn = this.initZoomInBtn();
    this.webUi.appendChild(this.zoomInBtn);

    document.body.appendChild(this.webUi);
  }

  get styles() {
    return {
      mainContainer: {
        width: '100%',
        display: 'flex',
        position: 'absolute',
        justifyContent: 'center',
      },
      squareButton: {
        width: '3vw',
        height: '3vw',
        userSelect: 'none',
        opacity: '.6',
        lineHeight: '100%',
        fontSize: '1.5rem',
        borderRadius: '.5rem',
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
