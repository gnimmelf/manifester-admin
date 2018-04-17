import _debug from "debug";
import PropTypes from "prop-types";
import { connect } from "../state/RxState";

import { appActions } from "../actions";

import Loading from './Loading.jsx';
import Login from './Login.jsx';
import Account from './Account.jsx';
import Register from './Register.jsx';
import NavTop from './NavTop.jsx';
import FlashMessage from './FlashMessage.jsx';

import utilCss from '../css/util.css';
import appCss from '../css/app.css';

// TODO! Tmp for `Checkout`
import { Button, ButtonGroup } from 'my-ui-components';

const debug = _debug("component:app")

const router = (props) => {
  const restrict = (com) => (props.user ? com : Login);

  switch (props.location.parts[0]) {
    case 'login':
      return Login;

    default:
      return restrict(Account);
  }
}

export const App = (props) => {
  debug("APP.props", props)
  return (

    <With status={props.status} Page={router(props)}>

      <div styleName="appCss.app-container">

        <header styleName="appCss.header-container">
          <NavTop {...props} />
        </header>

        <div styleName="appCss.page-container">

          <div styleName="appCss.flash-container">
            <FlashMessage  />
          </div>

          <Page />

        </div>

      </div>

    </With>
  )
}

export default connect(({app, account}) => app, appActions)(App);