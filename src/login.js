import ReactDOM from 'react-dom';
import { Provider, createState } from "./state/RxState";
import reducer$ from "./reducers";
import Login from './components/Login.jsx';
import style from './css/styles.css';

ReactDOM.render(
  <Provider state$={createState(reducer$)}>
    <div className="login" styleName="style.center-box">
      <Login />
    </div>
  </Provider>,
  document.getElementById("app"),
);
