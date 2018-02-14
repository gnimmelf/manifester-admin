import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import { Observable } from "rxjs";
import axios from "axios";
import { RxStateProvider, createState } from "./state/RxState";
import reducer$ from "./reducers";
import style from './css/styles.css';
import Admin from './components/Admin.jsx';

const initialState$ = Observable.of([['schemas', '/api/schemas']])
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
  <RxStateProvider state$={createState(reducer$, initialState$)}>
    <Router basename="/admin">
      <div className="admin" styleName="">
        <Route exact path="/" component={Admin}/>
      </div>
    </Router>
  </RxStateProvider>,
  document.getElementById("app"),
);