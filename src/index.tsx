// import React from 'react';
// import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import * as PIXI from 'pixi.js'

const app = new PIXI.Application({
  width: 1200,
  height: 800,
  antialias: true,
  resolution: 1,
  transparent: true
});

const appDiv = document.querySelector('.app');
if (appDiv) {
  appDiv.appendChild(app.view);
}

// import * as serviceWorker from './serviceWorker';

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
