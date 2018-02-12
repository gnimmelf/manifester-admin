import Rx from "rxjs";
import loginReducer$ from "../reducers/loginReducer";

const rootReducer$ = Rx.Observable.merge(
  loginReducer$.map(reducer => ["login", reducer]),
);

export default rootReducer$;