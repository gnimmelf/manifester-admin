import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import { RxStateProvider, createState } from "./state/RxState";
import reducer$ from "./reducers";
import Login from './components/Login.jsx';
import style from './css/styles.css';

ReactDOM.render(
  <RxStateProvider state$={createState(reducer$)}>
    <Router basename="/login">
      <div>
        <div className="login" styleName="style.center-box">
          <Route exact path="/" component={Login}/>
        </div>
      </div>
    </Router>
  </RxStateProvider>,
  document.getElementById("app"),
);