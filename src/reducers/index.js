import { Observable } from "rxjs";
import appReducer$ from "./appReducer";
import navTopReducer$ from "./navTopReducer";
import loginReducer$ from "./loginReducer";
import flashMessageReducer$ from "./flashMessageReducer";
import accountReducer$ from "./accountReducer";


const rootReducer$ = Observable.merge(
  appReducer$.map(reducer => ["app", reducer]),
  loginReducer$.map(reducer => ["login", reducer]),
  navTopReducer$.map(reducer => ["navTop", reducer]),
  flashMessageReducer$.map(reducer => ["flashMessage", reducer]),
  accountReducer$.map(reducer => ["account", reducer]),
);

export default rootReducer$;