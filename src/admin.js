import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, createState } from "./state/RxState";
import reducer$ from "./reducers";
import App from './components/App.jsx';

ReactDOM.render(
  <Provider state$={createState(reducer$)}>
    <App />
  </Provider>,
  document.getElementById("app"),
);
