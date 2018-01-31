import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, createState } from "./state/RxState";
import reducer$ from "./reducers";
import Login from './components/Login.jsx';
import style from './css/styles.css';

console.log("styles", style)

ReactDOM.render(
  <Provider state$={createState(reducer$)}>
    <div className="container" styleName="style.red">
      <Login />
    </div>
  </Provider>,
  document.getElementById("app"),
);
