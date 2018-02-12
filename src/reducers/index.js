import Rx from "rxjs";
import counterReducer$ from "../reducers/counterReducer";
import loginReducer$ from "../reducers/loginReducer";

const rootReducer$ = Rx.Observable.merge(
  loginReducer$.map(reducer => ["login", reducer]),
);

export default rootReducer$;