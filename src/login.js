import ReactDOM from 'react-dom';
import { RxStateProvider, createState } from "./state/RxState";
import reducer$ from "./reducers";
import Login from './components/Login.jsx';
import style from './css/styles.css';

import { Observable } from "rxjs";
import axios from "axios";
import { log } from './lib/utils';

const loader$ = Observable.of([['schemas', '/api/schemas']])
  .flatMap(x => x)
  .map(([key, url]) => Observable.from(axios.get(url).then(res => ({ [key]:res.data.data[key] }))))
  .flatMap(x => x)
  .scan((state, res) => ({
    ...state,
    ...res,
  }), {
    authPath: window.AppSettings.authPath
  })
  .do(log("init state"))


ReactDOM.render(
  <RxStateProvider state$={createState(reducer$, loader$)}>
    <div className="login" styleName="style.center-box">
      <Login/>
    </div>
  </RxStateProvider>,
  document.getElementById("app"),
);