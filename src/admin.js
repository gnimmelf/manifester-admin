import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, createState } from "./state/RxState";
import reducer$ from "./reducers";
import Admin from './components/Admin.jsx';

export default ReactDOM.render(
  <Provider state$={createState(reducer$)}>

    <Admin />
  </Provider>,
  document.getElementById("app"),
);
