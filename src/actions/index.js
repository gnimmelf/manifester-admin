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
export const redirect = (pathname, options={}) => {


  options = {
    onChange: undefined,
    history: 'PUSH',
    ...options
  };

  console.assert(!!~HISTORY_ACTIONS.indexOf(options.history), 'Unknown history action: '+history);

  // Run `onChange`
  ;(typeof options.onChange == 'function' && options.onChange());

  history[options.history.toLowerCase()](pathname)
}

export const authenticate = () => {
  appActions.authenticate$.next();
}

