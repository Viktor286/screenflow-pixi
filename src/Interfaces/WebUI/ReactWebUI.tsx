import React, { Component, ComponentClass } from 'react';
import FlowApp from '../FlowApp';
import * as styles from './Styles';
import ReactDOM from 'react-dom';
import SquareButton from './Components/SquareButton';
import RectangleButton from './Components/RectangleButton';

let app: FlowApp;

type IState = {
  zoomIndicator: string;
};

class ReactWebUI extends Component {
  state: IState;

  constructor(props: object) {
    super(props);
    this.state = {
      zoomIndicator: app.viewport.getZoomString(),
    };
  }

  render() {
    return (
      <main className={styles.mainContainer}>
        <SquareButton text="-" action={() => app.actions.viewportZoomOut()} />
        <RectangleButton text={this.state.zoomIndicator} action={() => app.actions.viewportZoom100()} />
        <SquareButton text="+" action={() => app.actions.viewportZoomIn()} />
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
