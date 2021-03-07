import React, { Component, ComponentClass } from 'react';
import FlowApp from '../FlowApp';
import * as styles from './styles';
import ReactDOM from 'react-dom';
import SquareButton from './Components/SquareButton';
import RectangleButton from './Components/RectangleButton';
import { buttonsTheme } from './Components/ButtonStyles';

let app: FlowApp;

type IState = {
  zoomIndicator: string;
  isMemoSelected: boolean;
  isShiftActive: boolean;
};

class ReactWebUI extends Component {
  public readonly state: IState;

  constructor(props: object) {
    super(props);
    this.state = {
      zoomIndicator: app.viewport.getZoomString(),
      isMemoSelected: false,
      isShiftActive: false,
    };
  }

  public toggleShiftMode() {
    app.webUi.setShiftModeState(this.state.isShiftActive ? 'off' : 'lock');
  }

  theme(): buttonsTheme {
    return this.state.isShiftActive ? 'yellow' : 'blue';
  }

  // Symbols ⊹, ⯐, ⌗, ⊡, ⌬, ⌾, ⍟, ⍰, ▣, ◉, ⛶, ✛, ⧉, ⭲,
  // https://www.fileformat.info/info/charset/UTF-32/list.htm?start=7168

  public render() {
    return (
      <main className={styles.mainContainer}>
        <SquareButton
          text={this.state.isShiftActive ? '⇩' : '⇧'}
          theme={this.theme()}
          action={() => this.toggleShiftMode()}
        />
        {this.state.isMemoSelected ? (
          <>
            <SquareButton
              text="🗑"
              theme={this.theme()}
              action={() => app.stateManager.actions.board.deleteSelectedElement()}
            />
            <SquareButton
              text="s-"
              theme={this.theme()}
              action={() => app.stateManager.actions.board.decreaseSelectedElementScale()}
            />
            <SquareButton
              text="s+"
              theme={this.theme()}
              action={() => app.stateManager.actions.board.increaseSelectedElementScale()}
            />
          </>
        ) : null}
        <SquareButton
          text="-"
          theme={this.theme()}
          action={() => app.stateManager.actions.viewport.zoomOut()}
        />
        <RectangleButton
          text={this.state.isShiftActive ? '⛶' : this.state.zoomIndicator}
          theme={this.theme()}
          action={() => app.stateManager.actions.viewport.zoom100()}
        />
        <SquareButton
          text="+"
          theme={this.theme()}
          action={() => app.stateManager.actions.viewport.zoomIn()}
        />
        <SquareButton
          text="⛶"
          theme={this.theme()}
          action={() => app.stateManager.actions.viewport.fitToBoard()}
        />
        <SquareButton text={'🖼️'} theme={this.theme()} action={() => app.webUi.selectImageToUpload()} />
        <SquareButton text={'🖫'} theme={this.theme()} action={() => app.project.exportToLocal()} />
        <SquareButton text={'📂'} theme={this.theme()} action={() => app.project.importFromLocal()} />
      </main>
    );
  }
}

export function reactInitializer(appRef: FlowApp): Component {
  app = appRef;
  return (ReactDOM.render(
    React.createElement((ReactWebUI as unknown) as ComponentClass<object>, {}, null),
    document.getElementById('web-ui'),
  ) as unknown) as Component;
}

// export default (ReactWebUI as unknown) as ComponentClass<InitProps>;

// import * as serviceWorker from './serviceWorker';
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
