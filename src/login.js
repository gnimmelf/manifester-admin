import ReactDOM from 'react-dom';
import { RxStateProvider, createState } from "./state/RxState";
import reducer$ from "./reducers";
import Login from './components/Login.jsx';
import style from './css/styles.css';

ReactDOM.render(
  <RxStateProvider state$={createState(reducer$)}>
    <div className="login" styleName="style.center-box">
      <Login />
    </div>
  </RxStateProvider>,
  document.getElementById("app"),
);