import React from 'react';
import FlowApp from '../FlowApp';
import { css } from 'emotion';

const mainContainer = css`
  display: flex;
  width: auto;
  left: 50%;
  transform: translateX(-50%);
  margin: 10px auto 0;
  padding: 0;
  position: absolute;
  justify-content: center;
`;

const buttonBase = css`
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -webkit-touch-callout: none;
`;

const squareButton = css`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 45px;
  height: 45px;
  margin: 0 4px;
  opacity: 0.6;
  color: white;
  border-radius: 0.5rem;
  background: #395062;
  border: 1px solid #5f9ae2;
  ${buttonBase}
`;

const buttonIcon = css`
  padding: 0;
  margin: 0;
  height: 21px;
  font-size: 21px;
  font-family: Georgia, sans-serif;
  text-align: center;
  line-height: 100%;
  transform: translateY(-50%);
  position: absolute;
  top: 50%;
  ${buttonBase}
`;

const buttonTextLabel = css`
  ${buttonIcon}
  font-size: 14px;
  height: 14px;
  font-family: Verdana, sans-serif;
`;

const labeledButtonCss = css`
  ${squareButton}
  width: 55px;
`;

function BasicButton({ text, action }: IButtonProp) {
  return (
    <div className={squareButton} onClick={(e) => action(e)}>
      <div className={buttonIcon}>{text}</div>
    </div>
  );
}

function LabeledButton({ text, action }: IButtonProp) {
  return (
    <div className={labeledButtonCss} onClick={(e) => action(e)}>
      <div className={buttonTextLabel}>{text}</div>
    </div>
  );
}

interface IApp {
  app: FlowApp;
}

interface IAction {
  (e: React.MouseEvent): any;
}

interface IButtonProp {
  text: string;
  action: IAction;
}

function ReactWebUI({ app }: IApp) {
  return (
    <div className="App">
      <main className={mainContainer}>
        <BasicButton text="-" action={(e) => app.actions.viewportZoomOut()} />
        <LabeledButton text={app.viewport.getZoomString()} action={(e) => app.actions.viewportZoom100()} />
        <BasicButton text="+" action={(e) => app.actions.viewportZoomIn()} />
      </main>
    </div>
  );
}

export default ReactWebUI;

// import * as serviceWorker from './serviceWorker';
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
