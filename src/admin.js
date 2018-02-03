import ReactDOM from 'react-dom';
import { RxStateProvider, createState } from "./state/RxState";
import reducer$ from "./reducers";
import Admin from './components/Login.jsx';
import style from './css/styles.css';

ReactDOM.render(
  <RxStateProvider state$={createState(reducer$)}>
    <div className="login" styleName="style.center-box">
      <Admin />
    </div>
  </RxStateProvider>,
  document.getElementById("app"),
);