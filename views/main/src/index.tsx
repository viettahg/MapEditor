import document from 'global/document';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import App from './app';
import * as serviceWorker from "./serviceWorker";
import { store } from './store';

const root = document.createElement('div');

if (document.body) {
  document.body.style.margin = '0';

  document.body.appendChild(root);
  ReactDOM.render(
    <Provider store={store}>
      <App />,
    </Provider>,
    root
  );
}

// ReactDOM.render(
//   <Provider store={store}>
//     <App />
//   </Provider>,
//   document.getElementById('root'),
// );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
