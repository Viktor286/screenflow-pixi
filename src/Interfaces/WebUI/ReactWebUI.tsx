import React, { Component, ComponentClass } from 'react';
import FlowApp from '../FlowApp';
import * as styles from './Styles';
import ReactDOM from 'react-dom';

let app: FlowApp;

type IState = {
  zoomIndicator: string;
};

class ReactWebUI extends Component {
  app: FlowApp;
  state: IState;

  constructor(props: object) {
    super(props);
    this.app = app;
    this.state = {
      zoomIndicator: this.app.viewport.getZoomString(),
    };
  }

  render() {
    return (
      <main className={styles.mainContainer}>
        <BasicButton text="-" action={(e) => this.app.actions.viewportZoomOut()} />
        <LabeledButton text={this.state.zoomIndicator} action={(e) => this.app.actions.viewportZoom100()} />
        <BasicButton text="+" action={(e) => this.app.actions.viewportZoomIn()} />
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

interface IButtonProp {
  text: string;
  action: IAction;
}

interface IAction {
  (e: React.MouseEvent): any;
}

function BasicButton({ text, action }: IButtonProp) {
  return (
    <div className={styles.squareButton} onClick={(e) => action(e)}>
      <div className={styles.buttonIcon}>{text}</div>
    </div>
  );
}

function LabeledButton({ text, action }: IButtonProp) {
  return (
    <div className={styles.labeledButtonCss} onClick={(e) => action(e)}>
      <div className={styles.buttonTextLabel}>{text}</div>
    </div>
  );
}

// export default (ReactWebUI as unknown) as ComponentClass<InitProps>;

// import * as serviceWorker from './serviceWorker';
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
