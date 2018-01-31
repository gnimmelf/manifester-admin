import Rx from "rxjs";
import counterReducer$ from "../reducers/counterReducer";
import loginReducer$ from "../reducers/loginReducer";

const rootReducer$ = Rx.Observable.merge(
  counterReducer$.map(reducer => ["counter", reducer]),
  loginReducer$.map(reducer => ["login", reducer]),
);

export default rootReducer$;