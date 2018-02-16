import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import { Observable } from "rxjs";
import axios from "axios";
import { RxStateProvider, createState } from "./state/RxState";
import adminReducers$ from "./reducers/adminReducer";
import style from './css/styles.css';
import Admin from './components/Admin.jsx';

const rootReducer$ = Observable.merge(
  adminReducers$.map(reducer => ["admin", reducer])
);

ReactDOM.render(
  <RxStateProvider state$={createState(rootReducer$)}>
    <Router basename="/admin">
      <div className="admin" styleName="">
        <Route exact path="/" component={Admin}/>
      </div>
    </Router>
  </RxStateProvider>,
  document.getElementById("app"),
);