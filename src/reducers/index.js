import Rx from "rxjs";
import loginReducer$ from "./loginReducer";
import adminReducer$ from "./adminReducer";

const rootReducer$ = Rx.Observable.merge(
  loginReducer$.map(reducer => ["login", reducer]),
  adminReducer$.map(reducer => ["admin", reducer])
);

export default rootReducer$;