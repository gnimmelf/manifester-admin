import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, createState } from "./state/RxState";
import reducer$ from "./reducers";
import Login from './components/Login.jsx';


ReactDOM.render(
  <Provider state$={createState(reducer$)}>
    <div className="container">
      <Login />
    </div>
  </Provider>,
  document.getElementById("app"),
);
