import _debug from "debug";
import { Observable } from "rxjs";
import { navTopActions } from "../actions";

const debug = _debug("reducers:navtopreducer")

const initialState = {
  accountDropdownIsOpen: false,
  navbarIsOpen: false,
};

// TODO! Move to `lib/utils.js`?
export const getMenuState = (payload, state, stateKey) => {
  const isOpen = {
    OPEN: true,
    CLOSE: false,
    TOGGLE: !state[stateKey],
  }[payload||'TOGGLE'];

  return {
    ...state,
    [stateKey]: isOpen
  }
}

export default Observable.of(() => initialState)
  .merge(
    navTopActions.accountDropdown$.map(payload => state => getMenuState(payload, state, 'accountDropdownIsOpen')),
    navTopActions.navbarToggler$.map(payload => state => getMenuState(payload, state, 'navbarIsOpen')),
  );
