import _debug from "debug";
import { Observable } from "rxjs";
import { flashMessageActions } from "../actions";

const debug = _debug("reducers:flashmessagereducer")

const initialState = {
  queue: []
};

export default Observable.of(() => initialState)
  .merge(
    flashMessageActions.push$.map((payload) => state => {
      state.queue.unshift(payload);
      return state
    }),
    flashMessageActions.pop$.map(_payload => state => {
      state.queue.shift();
      return state
    }),
    flashMessageActions.clear$.map(_payload => _state => ({
      ...initialState,
      queue: [],
    })),
  );
