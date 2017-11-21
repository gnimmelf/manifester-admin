import Rx from "rxjs";
import counterReducer$ from "../reducers/counterReducer";

const reducer$ = Rx.Observable.merge(
  counterReducer$.map(reducer => ["counter", reducer]),
);

export default reducer$;