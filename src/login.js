import ReactDOM from 'react-dom';
import { RxStateProvider, createState } from "./state/RxState";
import { Observable } from "rxjs";
import loginReducer$ from "./reducers/loginReducer";
import Login from './components/Login.jsx';
import style from './css/styles.css';

const rootReducer$ = Observable.merge(
  loginReducer$.map(reducer => ["login", reducer])
);

ReactDOM.render(
  <RxStateProvider state$={createState(rootReducer$)}>
    <div className="login" styleName="style.center-box">
      <Login/>
    </div>
  </RxStateProvider>,
  document.getElementById("app"),
);