// http://jamesknelson.com/re-exporting-es6-modules/
import history from "my-history-singleton";
import appActions from "./appActions";
import accountActions from "./accountActions";
import bookingActions from "./bookingActions";
import flashMessageActions from "./flashMessageActions";
import loginActions from "./loginActions";
import navTopActions from "./navTopActions";
import registerActions from "./registerActions";
import cartActions from "./cartActions";

// Re-export

export {
  accountActions,
  appActions,
  bookingActions,
  flashMessageActions,
  loginActions,
  navTopActions,
  registerActions,
  cartActions,
};

// Expose wrapper functions for often-used actions.

export const flash = (message, status) => {
  flashMessageActions.clear$.next('*');
  (message && flashMessageActions.push$.next({content: message, status:status}));
}

const HISTORY_ACTIONS = ['PUSH', 'REPLACE']
export const redirect = (pathname, ...rest) => {

  // `rest` is optional `action` and/or `message` in any order
  const {action, message} = rest.reduce((acc, cur) => ({
    ...acc,
    [~HISTORY_ACTIONS.indexOf(cur) ? 'action' : 'message']: cur,
  }), {action: 'REPLACE', message: undefined});

  history[action.toLowerCase()](pathname, {flashMessage: message})
}

export const authenticate = () => {
  appActions.authenticate$.next();
}

